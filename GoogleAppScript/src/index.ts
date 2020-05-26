global.doGet = (e: any) => {
  //リクエストパラメータ名"text"の値を取得する
  Logger.log(`Hello World`);
  var text = e.parameter.text;
  var value;
  if (text) {
      value = "You say " + text;
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