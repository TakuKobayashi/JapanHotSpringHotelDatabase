global.doGet = (e: any) => {
  const targetSpreadSheet = SpreadsheetApp.openById("1XsetLCeR4-Q1ntWFRFAWnuXhZK3C23RQgWBTTs7eFW0");
  console.log(targetSpreadSheet.getName())
  for(const sheet of targetSpreadSheet.getSheets()){
    const dataRange  = sheet.getDataRange();
    console.log(sheet.getSheetName());
    console.log(dataRange);
    console.log(dataRange.getValues());
  }
  //リクエストパラメータ名"text"の値を取得する
  var value;
  if (e.parameter) {
      value = "You say " + JSON.stringify(e.parameter);
  } else {
      value = "Please say something!";
  }
  var result = {
      message: value
  }
  var out = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  out.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  out.setContent(JSON.stringify(result));
  return out;
}