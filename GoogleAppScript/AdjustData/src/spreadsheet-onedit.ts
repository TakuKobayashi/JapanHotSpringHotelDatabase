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

    // データを自動整形
    const data = event.range.getValues();
    for(let row = 0; row < data.length;++row){
      for(let column = 0;column < data[row];++column){
        if(data[row][column]){
          data[row][column] = normalize(data[row][column].toString())
        }
      }
    }
    event.range.setValues(data);

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

function normalize(word: string): string {
  return word.normalize("NFKC")
}

function convertGeocode(address: string): any {
  const geocoder = Maps.newGeocoder();
  geocoder.setLanguage('ja');
  const responses = geocoder.geocode(address);
  return responses.results;
}