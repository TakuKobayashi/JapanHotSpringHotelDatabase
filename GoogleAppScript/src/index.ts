global.doGet = (e: any) => {
  // e.parameterでURL QueryのObejctが取得できる
  const targetSpreadSheet = SpreadsheetApp.openById('1XsetLCeR4-Q1ntWFRFAWnuXhZK3C23RQgWBTTs7eFW0');
  const resultObject = {};
  for (const sheet of targetSpreadSheet.getSheets()) {
    const resultJsonObjects = [];
    const dataRange = sheet.getDataRange();
    const data = dataRange.getValues();
    for (let row = 1; row < data.length; ++row) {
      const sheetData: { [s: string]: any } = {};
      const keys = data[0];
      for (let column = 0; column < keys.length; ++column) {
        sheetData[keys[column]] = data[row][column];
      }
      const resultData = updateLatLonRowSheet(sheet, row, sheetData);
      resultJsonObjects.push(resultData);
    }
    resultObject[sheet.getSheetName()] = resultJsonObjects;
  }
  const jsonOut = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  jsonOut.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  jsonOut.setContent(JSON.stringify(resultObject));
  return jsonOut;
};

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

function convertGeocode(sheetData: any): any {
  const geocoder = Maps.newGeocoder();
  geocoder.setLanguage('ja');
  const responses = geocoder.geocode(sheetData.address);
  return responses.results;
}
