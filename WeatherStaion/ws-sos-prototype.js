/*
	WeatherStaionのデータをSOSサーバに転送するためのプログラム
	Node ExpressでHTTP通信を受信し，プログラムを実行
	
	使用モジュール
	express		HTTP通信の送受信
	body-parser	JSON形式データをjavascriptのオブジェクトに変換



*/
/* webクライアント Node requestモジュール対応*/
var request = require('request');//requestモジュールの読み込み
var options = {
        url: "http://eeciot.tsuruoka-nct.ac.jp:8080/52nSOS/service",
        method: "POST",
        headers: {
                'User-Agent': 'node request',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
        },
	body:{}
};

/* SOS WS00の温度データ送信用データ(JSON形式)のひな型 */
var request_post_body_json = `{
  "request": "InsertResult",
  "service": "SOS",
  "version": "2.0.0",
  "templateIdentifier": "ws00/template/temp",
  "resultValues": ""
}`;
var request_post_body = JSON.parse(request_post_body_json);

/* 時刻を日本時間で表示する関数 */
var daytime_iso8601_JST = function (dt) {
    var zero = "00";
    var now = dt.getFullYear() + "-"
           + (zero+(dt.getMonth() + 1)).slice(-2) + "-"
           + (zero+dt.getDate()).slice(-2) + "T"
           + (zero+dt.getHours()).slice(-2) + ":" + (zero+dt.getMinutes()).slice(-2) + ":" + (zero+dt.getSeconds()).slice(-2) + '+09:00';//+09:00はＯＫ，+9:00はSOSは受け付けず
    return now;
}

var bodyParser = require('body-parser'); //JSON受け取り用にbody-parserモジュール呼び出し
var express = require('express');
var app = express();
/*  ボディのパース処理 「Content-Type:type」を判別して処理内容をきめる。*/
/* Content-Type: application/x-www-form-urlencoded ex.foo=bar&name=JSON*/
app.use(bodyParser.urlencoded({ extended: true }));
/* Content-Type: application/json */
app.use(bodyParser.json());
/* ボディの値がそのままパースされる。 */
app.use(bodyParser.raw());
/* Content-Type: text/plain */
app.use(bodyParser.text());

app.listen(3000,function(){ //Expressサーバの稼働開始
  console.log("Start POXY for SOS Server");
  console.log("Receiving WeatherStaion output data and Change data format for SOS InsertResult API in JSON");
  console.log("HTTP TCP PORT:3000");
});

/* Expressサーバで/postにアクセスされた際の処理  */
app.post('/post', function (req, res) {
  let data = req.body.items[0].v.split(',');
  let timestamp = req.body.items[0].t+'000';
  let day = new Date(parseInt(timestamp));
  let body = req.body;
  console.log("*** Request BODY ***");
  console.log(req.body);

  /*******************************************************
     WeatherStaionkからのデータから必要なデータを切り出して
     SOSのテンプレート用のデータに変換
   ********************************************************/
  let send_data = body.items.length+'@';
  let body_post = '';
  /* BODYデータからデータ部分itemsを切り出す。 */
  for(let i=0; i< body.items.length ; i++){
        let values = body.items[i].v.split(',');
        let day    = new Date(parseInt(body.items[i].t+'000'));

        send_data += daytime_iso8601_JST(day)+'#';;
        send_data += values[0]+'@';
  }
  request_post_body.resultValues = send_data;
  options.body = JSON.stringify(request_post_body); //POST送信用BODYデータ作成
  console.log("*** BODY OF HTTP POST data %d ***",body.items.length);
  console.log(options.body);
  console.log("\n");      //空行

  /***********************************************************
    SOS用のデータを送信
  ***********************************************************/
  request(options,function(error, res, body){
                console.log("[Response]");
                console.log("StatusCode: "+res.statusCode);
                console.log("StatusMessage: "+res.statusMessage);
                console.log("Body;\n"+body);
                console.log("\n");
   });

   // リクエストボディを出力
  res.send('OK');//応答のBODY部にデータをいれて返信

  res.end();
});
