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
      const responses = convertGeocode(sheetData);
      sheetData.lat = responses[0].geometry.location.lat;
      sheetData.lon = responses[0].geometry.location.lng;
      resultJsonObjects.push(sheetData);
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

function convertGeocode(sheetData: any): any {
  const geocoder = Maps.newGeocoder();
  geocoder.setLanguage('ja');
  const responses = geocoder.geocode(sheetData.address);
  return responses.results;
}
