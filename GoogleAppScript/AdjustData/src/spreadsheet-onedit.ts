// MySQLのカラム名に相当する行番号
const KEYS_COLUMN_ROW = 1;

function onEdit(event: GoogleAppsScript.Events.SheetsOnEdit): void {
  if (event.range) {
    // getRange(row, column, numRows)
    const targetSheet = event.range.getSheet();
    const keyNumberPairs = getKeyNumberPairs(targetSheet);

    const targetRange = event.range;
    // データを自動整形
    const results = normalizeAll(targetRange);
    targetRange.setValues(results);

    const columnRangeMin = targetRange.getColumn();
    const columnRangeMax = targetRange.getColumn() + targetRange.getWidth();
    // 変更箇所に住所の項目がある場合のみ実行する
    if (columnRangeMin <= keyNumberPairs.address && keyNumberPairs.address < columnRangeMax) {
      updateLatLon(targetSheet, targetRange.getRow(), targetRange.getHeight(), keyNumberPairs);
    }
  }

  //編集前のセルの値を取得したい場合
  Logger.log(event.oldValue);
}

function getKeyNumberPairs(targetSheet: GoogleAppsScript.Spreadsheet.Sheet): { [s: string]: number } {
  const keyNumberPairs: { [s: string]: number } = {};
  const headerRange = targetSheet.getRange(KEYS_COLUMN_ROW, 1, 1, targetSheet.getLastColumn());
  const headerValues = headerRange.getValues();
  Logger.log(headerValues);
  if (headerValues[0]) {
    for (let i = 0; i < headerValues[0].length; ++i) {
      keyNumberPairs[headerValues[0][i]] = i + 1;
    }
  }
  return keyNumberPairs;
}

// 住所が入力されていれば自動的に緯度経度も入力されるようにする
function updateLatLon(
  targetSheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  height: number,
  keyNumberPairs: { [s: string]: number },
): void {
  // 変更がある行全部の情報を取得する
  const targetRowsRange = targetSheet.getRange(row, 1, height, targetSheet.getLastColumn());
  const targetRowsValues = targetRowsRange.getValues();
  for (let r = 0; r < targetRowsValues.length; ++r) {
    const addressIndex = keyNumberPairs.address - 1;
    const latIndex = keyNumberPairs.lat - 1;
    const lonIndex = keyNumberPairs.lon - 1;
    const postalCodeIndex = keyNumberPairs.postal_code - 1;
    if (targetRowsValues[r][addressIndex] && (!targetRowsValues[r][latIndex] || !targetRowsValues[r][lonIndex])) {
      const geocodeResponses = convertGeocode(targetRowsValues[r][addressIndex]);
      targetRowsValues[r][latIndex] = geocodeResponses[0].geometry.location.lat;
      targetRowsValues[r][lonIndex] = geocodeResponses[0].geometry.location.lng;
      const postal_code_component = geocodeResponses[0].address_components.find((component) => component.types.includes('postal_code'));
      if (postal_code_component) {
        targetRowsValues[r][postalCodeIndex] = postal_code_component.long_name;
      }
    }
  }
  targetRowsRange.setValues(targetRowsValues);
}

function normalizeAll(range: GoogleAppsScript.Spreadsheet.Range): any[][] {
  const data = range.getValues();
  for (let row = 0; row < data.length; ++row) {
    for (let column = 0; column < data[row]; ++column) {
      if (data[row][column]) {
        data[row][column] = normalize(data[row][column].toString());
      }
    }
  }
  return data;
}

function normalize(word: string): string {
  return word.normalize('NFKC');
}

function convertGeocode(address: string): any {
  const geocoder = Maps.newGeocoder();
  geocoder.setLanguage('ja');
  const responses = geocoder.geocode(address);
  return responses.results;
}
