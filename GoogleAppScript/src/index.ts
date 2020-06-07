global.doGet = (e: any) => {
  // e.parameterでURL QueryのObejctが取得できる
  const targetSpreadSheet = SpreadsheetApp.openById('1XsetLCeR4-Q1ntWFRFAWnuXhZK3C23RQgWBTTs7eFW0');
  const resultObject = {};
  console.log(targetSpreadSheet.getName());
  for (const sheet of targetSpreadSheet.getSheets()) {
    const resultJsonObjects = [];
    const dataRange = sheet.getDataRange();
    console.log(dataRange.getWidth);
    const data = dataRange.getValues();
    for (let row = 1; row < data.length; ++row) {
      const sheetData = {};
      const keys = data[0];
      for (let column = 0; column < keys.length; ++column) {
        sheetData[keys[column]] = data[row][column];
      }
      resultJsonObjects.push(sheetData);
    }
    resultObject[sheet.getSheetName()] = resultJsonObjects;
    console.log(sheet.getSheetName());
    console.log(dataRange);
    console.log(dataRange.getValues());
  }
  var out = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  out.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  out.setContent(JSON.stringify(resultObject));
  return out;
};
