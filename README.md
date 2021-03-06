# 日本の温泉宿の情報をまとめたサイト

## Google App Script

今回、Google Spread Sheetの情報を全てWebAPIとしてJSONを取得できるようなAPIは以下のリンクにアクセスすることで取得することができます。

[日本の温泉宿の情報を取得するWebAPI](https://script.google.com/macros/s/AKfycbwjYzpnc_C_Gtc7LbojP0qsuHECr3woy2qy5NznAVU/exec)

WebAPIとして取得する元となっているGoogle Spread Sheetはこちら(随時更新していきます)

[日本の温泉宿の情報](https://docs.google.com/spreadsheets/d/1XsetLCeR4-Q1ntWFRFAWnuXhZK3C23RQgWBTTs7eFW0/edit?usp=sharing)

このとき、Versionは常に最新のHead、かつそのIdは `AKfycbwjYzpnc_C_Gtc7LbojP0qsuHECr3woy2qy5NznAVU` になる。
Google App ScriptのWebAPIのURLは
`https://script.google.com/macros/s/{GASのId}/exec`
となる

### Clasp

Google App Scriptをローカルのエディタで開発できるツール [clasp](https://github.com/google/clasp/)

[clasp](https://github.com/google/clasp/) を使って、Typescript + Webpack で開発しています。

##### 参考

* [GAS のGoogle謹製CLIツール clasp](https://qiita.com/HeRo/items/4e65dcc82783b2766c03)
* [clasp + webpackでGAS(Google App Script)のコードをTypeScriptで書く](https://wp-kyoto.net/clasp-gas-typescript-webpack/)
* [GAS を npm パッケージ + Webpack + TypeScript で開発する](https://qiita.com/shohei_ot/items/7b26461359068a192b96)

### Google App Scriptを WebAPIとして使う

Google App Scriptの中身を編集して、URL を発行してJSONを返すようにしている

##### 参考

* [今から10分ではじめる Google Apps Script(GAS) で Web API公開](https://qiita.com/riversun/items/c924cfe70e16ee3fe3ba)


### Spreadsheetを読み込んでGoogle App ScriptとWebAPIにする

GASでSpreadsheetを操作するときの[リファレンス](https://developers.google.com/apps-script/reference/spreadsheet/sheet)はこちら

##### 参考

* [【初心者向けGAS】スプレッドシートのシートを取得する２つの方法](https://tonari-it.com/gas-spreadsheet-get-sheet/)

### Claspの自動デプロイの実装

Github Actionsを修正して、pushされたら自動的にGoogle Apps Sriptに反映、公開される仕組みを作成した

* [Google Apps Script のデプロイを Circle CI から行う](https://qiita.com/howdy39/items/2c21251331e011d04512)

### Google Apps Script にて公開されたWebAPIをPostで実行確認する

Postでデプロイしたはずだが、`curl` で実行してもWebAPIが実行されない。
これは `curl` の仕様により、`-X POST` とするとリダイレクトがうまくいかないことによるものでした。
そのため以下のようなコマンドを実行することで確認することができました。

```
curl -L -d '' https://script.google.com/macros/s/{deployId}/exec
```

##### 参考

* [GASのdoPost関数をcurlでテストする時リダイレクトが必要なら-Xオプションを使わない](https://qiita.com/cajonito/items/9e66ef60831d51105bc0)

