function onPost(e: any): GoogleAppsScript.Content.TextOutput {
  Logger.log(e.parameter);
  Logger.log(e.postData.getDataAsString());
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ message: "success!" }));
  return output;
}