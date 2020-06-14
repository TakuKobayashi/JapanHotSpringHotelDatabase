function doGet(e: any): GoogleAppsScript.Content.TextOutput {
  Logger.log("doGet");
  Logger.log(e.parameter);
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ message: "doGet success!" }));
  return output;
}

function doPost(e: any): GoogleAppsScript.Content.TextOutput {
  Logger.log("doPost");
  Logger.log(e.postData.getDataAsString());
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ message: "doPost success! :" + e.postData.getDataAsString() }));
  return output;
}