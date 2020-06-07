global.doGet = (e: any) => {
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