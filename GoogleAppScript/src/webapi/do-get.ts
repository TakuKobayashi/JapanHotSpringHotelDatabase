import { loadSpreadsheetToObjects } from '../common/converter';

export function doGet(e: any): GoogleAppsScript.Content.TextOutput {
  // e.parameterでURL QueryのObejctが取得できる
  const targetSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const resultObject = loadSpreadsheetToObjects(targetSpreadSheet);
  const jsonOut = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  jsonOut.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  jsonOut.setContent(JSON.stringify(resultObject));
  return jsonOut;
}
