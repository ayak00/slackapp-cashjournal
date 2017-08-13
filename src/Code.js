/**
 * Slackコマンド  
 * 	/cash [金額] ([支払先] [内容]) ([-d 支払日])  
 *				()：省略可。「支払先」を省略して「内容」を入力する場合は「-」等何か入れる。  
 *				支払日を省略した場合は、本日扱い。  
 * 例
 * 	/cj 1500 昼食
 * 	/cj 1200 コンビニ お菓子
 * 	/cj 500 -d 7-18
 * 	/cj 1000 小学校 共同費 -d 2017-7-11
 * 	/cj 300 - テニス -d 7-9
 *
 * 返却値
 * 	OK:No.n:金額  
 * 		※No.n：追加したNo.。(後で利用予定。レシート等の写真をアップロードする際に、タイトルに入れて関連づけるため)
 * 	NG:Error message
 *
 * データファイルURL
 *  https://docs.google.com/spreadsheets/d/[File ID]/edit
 * 必要なシート
 *  cash、log
 * cashシートのヘッダ行
 * 	No.,日付,金額,支払先,内容
 * 
 */

var CMD = "/cash";
var CMD_OPT_DATE = "-d";

var FILE_ID = "[File ID]";
var SHEETNAME_CASH = "cash";
var SHEETNAME_LOG = "log";

function doPost(e) {

  if (e == undefined || e.parameter == undefined) {
    Logger.log("不正な呼び出し:e/e.parameter == undefined");
    return null; 
  }

  var ssheet = SpreadsheetApp.openById(FILE_ID);
    
  var logsheet = ssheet.getSheetByName(SHEETNAME_LOG);
  var logrow = logsheet.getLastRow()+1;
  logsheet.getRange(logrow, 1).setValue(new Date());
  logsheet.getRange(logrow, 2).setValue(e.parameter.user_name);
  var e2json = JSON.stringify(e);
  logsheet.getRange(logrow, 4).setValue(e2json);
  
  if (e.parameter.command == undefined) {
    logsheet.getRange(logrow, 3).setValue("不正な呼び出し:command == undefined");
    return ContentService.createTextOutput("NG:Command undefined"); 
  } else if (e.parameter.command != CMD) {
    logsheet.getRange(logrow, 3).setValue("不正な呼び出し:command != CMD");
    return ContentService.createTextOutput("NG:Command error");
  }
  if (e.parameter.text == "") {
    logsheet.getRange(logrow, 3).setValue("Param Error");
    return ContentService.createTextOutput("NG:param error");
  }
  
  var paramArray = (e.parameter.text).split(" ");
  var paramObj = getParamObj(paramArray);
  
  var sheet = ssheet.getSheetByName(SHEETNAME_CASH);
  var inputrow = sheet.getLastRow()+1;
  var col = 1;
  sheet.getRange(inputrow, col).setValue("=row()-1"); 
  sheet.getRange(inputrow, ++col).setValue(paramObj.date); 
  sheet.getRange(inputrow, ++col).setValue(paramObj.amount); 
  sheet.getRange(inputrow, ++col).setValue(paramObj.payee); 
  sheet.getRange(inputrow, ++col).setValue(paramObj.item);
  
  logsheet.getRange(logrow, 3).setValue("OK");
  return ContentService.createTextOutput("OK:No."+sheet.getRange(inputrow, 1).getValue()+":"+paramArray[0]+"円");
}

/**
 * 配列になっているパラメータをオブジェクトにセットして返却
 */
function getParamObj(paramArray) {
     
  var paramObj = new Object();
  
  paramObj.date = new Date();
  paramObj.amount = paramArray[0];
  paramObj.payee = "";
  paramObj.item = "";

  switch (paramArray.length) {
    case 1:
      break;
    case 2:
      paramObj.payee = paramArray[1];
      break;
    case 3:
      if (paramArray[1] == CMD_OPT_DATE) {
        paramObj.date = paramArray[2];
      } else {
        paramObj.payee = paramArray[1];
        paramObj.item = paramArray[2];
      }
      break;
    case 4:
      if (paramArray[2] == CMD_OPT_DATE) {
        paramObj.payee = paramArray[1];
        paramObj.date = paramArray[3];
      }
      break;
    case 5:
      if (paramArray[3] == CMD_OPT_DATE) {
        paramObj.payee = paramArray[1];
        paramObj.item = paramArray[2];
        paramObj.date = paramArray[4];
      }
      break;
    default:
      break;
  }
 
  return paramObj; 
}
