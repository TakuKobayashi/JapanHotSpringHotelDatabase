// MySQLのカラム名に相当する行番号
const KEYS_COLUMN_ROW = 1;

function onEdit(event: GoogleAppsScript.Events.SheetsOnEdit): void {
  if (event.range) {
    // getRange(row, column, numRows)
    const targetSheet = event.range.getSheet();
    const keyNumberPairs = getKeyNumberPairs(targetSheet);

    const targetRange = event.range;
    // データを自動整形
    const updatedRangeValues = normalizeAll(targetRange);

    // 変更がある行全部の情報を取得する
    const targetRowsRange = targetSheet.getRange(targetRange.getRow(), 1, targetRange.getHeight(), targetSheet.getLastColumn());
    const targetRowsValues = targetRowsRange.getValues();
    let updatedRowsRangeValues = updateAutoIncreamentId(targetRowsValues, keyNumberPairs, targetRange.getRow());

    const columnRangeMin = targetRange.getColumn();
    const columnRangeMax = targetRange.getColumn() + targetRange.getWidth();
    // 変更箇所に住所の項目がある場合のみ実行する
    if (columnRangeMin <= keyNumberPairs.address && keyNumberPairs.address < columnRangeMax) {
      updatedRowsRangeValues = updateLatLon(updatedRowsRangeValues, keyNumberPairs);
    }

    if (targetRange != updatedRangeValues) {
      targetRange.setValues(updatedRangeValues);
    }
    if (targetRowsValues != updatedRowsRangeValues) {
      targetRowsRange.setValues(updatedRowsRangeValues);
    }
  }
}

function updateAutoIncreamentId(targetRowsValues: any[][], keyNumberPairs: { [s: string]: number }, startRow: number) {
  const updateTargetRowsValues = [...targetRowsValues];
  const idIndex = keyNumberPairs.id - 1;
  for (let r = 0; r < updateTargetRowsValues.length; ++r) {
    if (!updateTargetRowsValues[r].some((rowValue) => rowValue)) {
      continue;
    }
    if (!updateTargetRowsValues[r][idIndex]) {
      updateTargetRowsValues[r][idIndex] = startRow + r - 1;
    }
  }
  return updateTargetRowsValues;
}

function getKeyNumberPairs(targetSheet: GoogleAppsScript.Spreadsheet.Sheet): { [s: string]: number } {
  const keyNumberPairs: { [s: string]: number } = {};
  const headerRange = targetSheet.getRange(KEYS_COLUMN_ROW, 1, 1, targetSheet.getLastColumn());
  const headerValues = headerRange.getValues();
  if (headerValues[0]) {
    for (let i = 0; i < headerValues[0].length; ++i) {
      keyNumberPairs[headerValues[0][i]] = i + 1;
    }
  }
  return keyNumberPairs;
}

// 住所が入力されていれば自動的に緯度経度も入力されるようにする
function updateLatLon(targetRowsValues: any[][], keyNumberPairs: { [s: string]: number }): void {
  const updateTargetRowsValues = [...targetRowsValues];
  for (let r = 0; r < updateTargetRowsValues.length; ++r) {
    const addressIndex = keyNumberPairs.address - 1;
    const latIndex = keyNumberPairs.lat - 1;
    const lonIndex = keyNumberPairs.lon - 1;
    const postalCodeIndex = keyNumberPairs.postal_code - 1;
    if (updateTargetRowsValues[r][addressIndex] && (!updateTargetRowsValues[r][latIndex] || !updateTargetRowsValues[r][lonIndex])) {
      const geocodeResponses = convertGeocode(updateTargetRowsValues[r][addressIndex]);
      updateTargetRowsValues[r][latIndex] = geocodeResponses[0].geometry.location.lat;
      updateTargetRowsValues[r][lonIndex] = geocodeResponses[0].geometry.location.lng;
      const postal_code_component = geocodeResponses[0].address_components.find((component) => component.types.includes('postal_code'));
      if (postal_code_component) {
        updateTargetRowsValues[r][postalCodeIndex] = postal_code_component.long_name;
      }
    }
  }
  return updateTargetRowsValues;
}

function normalizeAll(range: GoogleAppsScript.Spreadsheet.Range): any[][] {
  const data = range.getValues();
  for (let row = 0; row < data.length; ++row) {
    for (let column = 0; column < data[row]; ++column) {
      if (data[row][column]) {
        data[row][column] = data[row][column].normalize('NFKC');
      }
    }
  }
  return data;
}

function convertGeocode(address: string): any {
  const geocoder = Maps.newGeocoder();
  geocoder.setLanguage('ja');
  const responses = geocoder.geocode(address);
  return responses.results;
}
