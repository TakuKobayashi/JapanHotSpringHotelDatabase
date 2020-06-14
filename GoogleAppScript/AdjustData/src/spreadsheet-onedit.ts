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
    Logger.log(event.range.getColumn().toString());
    Logger.log(event.range.getRow().toString());
    Logger.log(event.range.getWidth().toString());
    Logger.log(event.range.getHeight().toString());
    Logger.log(event.range.getValues());
  }
  
  //編集前のセルの値を取得したい場合
  Logger.log(event.oldValue);
}

function updateLatLonRowSheet(sheet: any, rowNumber: number, sheetData: any): any {
  const resultData = {...sheetData}
  if(!sheetData.lat || !sheetData.lon){
    resultData.address = sheetData.address.normalize("NFKC")
    const responses = convertGeocode(sheetData);
    resultData.lat = responses[0].geometry.location.lat;
    resultData.lon = responses[0].geometry.location.lng;
    const dataArr = Object.values(resultData)
    // spreadsheetのデータの更新
    sheet.getRange(rowNumber + 1, 1, 1, dataArr.length).setValues([dataArr]);
  }
  return resultData;
}