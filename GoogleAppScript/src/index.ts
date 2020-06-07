global.doGet = (e: any) => {
  const ss = SpreadsheetApp.openById("1XsetLCeR4-Q1ntWFRFAWnuXhZK3C23RQgWBTTs7eFW0");
  console.log(ss.getName())
  console.log(ss)
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