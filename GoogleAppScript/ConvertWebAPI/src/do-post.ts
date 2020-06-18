import { loadSpreadsheetToObjects } from './common/converter';

export function doPost(e: any): GoogleAppsScript.Content.TextOutput {
  // e.parameterでURL QueryのObejctが取得できる
  const targetSpreadSheet = SpreadsheetApp.openById(process.env.TARGET_SPREADSHEET_ID);
  const resultObject = loadSpreadsheetToObjects(targetSpreadSheet);
  const jsonOut = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  jsonOut.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  jsonOut.setContent(JSON.stringify(resultObject));
  return jsonOut;
}
