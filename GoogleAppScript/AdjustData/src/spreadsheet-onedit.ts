function onEdit(event: GoogleAppsScript.Events.SheetsOnEdit): void {
  Logger.log("Hello onEdit!");
  Logger.log(event.triggerUid);
  Logger.log(event.user);
  Logger.log(event.authMode);
  //Spreadsheet名を取得する場合
  Logger.log(event.source.getName()); //←sourceは、"spreadsheet"オブジェクトです

  //編集されたセルの値を取得したい場合
  Logger.log(event.value);
  if(event.range){
    // getRange(row, column, numRows)
    const targetSheet = event.range.getSheet();
    const keyNumberPairs = getKeyNumberPairs(targetSheet);
    Logger.log(keyNumberPairs);

    const targetRange = event.range;
    // データを自動整形
    const results = normalizeAll(targetRange);
    targetRange.setValues(results);

    // 変更箇所に住所の項目がある場合のみ実行する
    if(targetRange.getColumn() <= keyNumberPairs.address && keyNumberPairs.address < targetRange.getColumn() + targetRange.getWidth()){
      updateLatLon(targetSheet, targetRange.getRow(), targetRange.getHeight(), keyNumberPairs);
    }
    Logger.log(event.range.getColumn().toString());
    Logger.log(event.range.getRow().toString());
    Logger.log(event.range.getWidth().toString());
    Logger.log(event.range.getHeight().toString());
    Logger.log(event.range.getValues());
  }
  
  //編集前のセルの値を取得したい場合
  Logger.log(event.oldValue);
}

function getKeyNumberPairs(targetSheet: GoogleAppsScript.Spreadsheet.Sheet): { [s: string]: number } {
  const keyNumberPairs: { [s: string]: number } = {}
  const headerRange = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn());
  const headerValues = headerRange.getValues();
  Logger.log(headerValues);
  if(headerValues[0]){
    for(let i = 0;i < headerValues[0].length;++i){
      keyNumberPairs[headerValues[0][i]] = i + 1;
    }
  }
  return keyNumberPairs;
}

// 住所が入力されていれば自動的に緯度経度も入力されるようにする
function updateLatLon(targetSheet: GoogleAppsScript.Spreadsheet.Sheet, row: number, height: number,keyNumberPairs: { [s: string]: number ): void {
  // 変更がある行全部の情報を取得する
  const targetRowsRange = targetSheet.getRange(row, 1, height, targetSheet.getLastColumn())
  const targetRowsValues = targetRowsRange.getValues();
  for(let r = 0;r < targetRowsValues.length;++r){
    const addressIndex = keyNumberPairs.address - 1;
    const latIndex = keyNumberPairs.lat - 1;
    const lonIndex = keyNumberPairs.lon - 1;
    if(targetRowsValues[r][addressIndex] && (!targetRowsValues[r][latIndex] || !targetRowsValues[r][lonIndex])){
      const geocodeResponses = convertGeocode(targetRowsValues[r][addressIndex]);
      targetRowsValues[r][latIndex] = geocodeResponses[0].geometry.location.lat;
      targetRowsValues[r][lonIndex] = geocodeResponses[0].geometry.location.lng;
    }
  }
  targetRowsRange.setValues(targetRowsValues);
}

function normalizeAll(range: GoogleAppsScript.Spreadsheet.Range): any[][] {
  const data = range.getValues();
  for(let row = 0; row < data.length;++row){
    for(let column = 0;column < data[row];++column){
      if(data[row][column]){
        data[row][column] = normalize(data[row][column].toString())
      }
    }
  }
  return data;
}

function normalize(word: string): string {
  return word.normalize("NFKC")
}

function convertGeocode(address: string): any {
  const geocoder = Maps.newGeocoder();
  geocoder.setLanguage('ja');
  const responses = geocoder.geocode(address);
  return responses.results;
}