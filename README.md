# 簡易現金支出管理
Slackコマンド - Google Apps Script(GAS) - Google Sheets

Slackコマンドから現金支出を入力、Google Sheetsにため込む。
あとでうまい事使う用。

---

## 使い方
1. データ管理用Google Sheetsを作成。  
1. 以下のシートを作成。  
    - cash
    - log
1. 作成したGoogle Sheetsのスプレッドシート IDを確認。
    > https://docs.google.com/spreadsheets/d/[ここのID]/edit#gid=0
1. GASファイル(Code.gs)を編集　　
    > var FILE_ID = "[File ID]";  

    [File ID]をスプレッドシートIDで書き換え。

1. GASファイルをGoogle Driveにアップロード。  

1. Webアプリとして公開。  
1. Slackコマンドの追加。 
 
    6,7の手順はこっちで。-> [SlackCmdTest](https://github.com/ayak00/SlackCmdTest)



