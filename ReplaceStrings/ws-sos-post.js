/*
    SOSサーバへHTTP POSTで送信する例
    ws-sos-prototype.jsを元に必要最小限のソースに簡略化

	使用モジュール
	request		HTTP通信の送信(クライアント)

*/
/* webクライアント Node requestモジュール対応*/
var request = require('request');//requestモジュールの読み込み
var options = {
        url: "http://localhost:8080/52nSOS/service",    //LOCALに
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
  "templateIdentifier": "ws01/template/temp",
  "resultValues": ""
}`;
var request_post_body = JSON.parse(request_post_body_json);
request_post_body.resultValues = '1@2020-02-02T13:02:00+09:00#12.34@';  //テストデータ
options.body = JSON.stringify(request_post_body); //POST送信用BODYデータ作成（JSON形式）
console.log("*** BODY OF HTTP POST data ***\n\r")
console.log(options.body);
console.log("\n");      //空行

request(options,function(error, res, body){ //requestを使ってHTTP POST送信
    console.log("[Response]");
    console.log("StatusCode: "+res.statusCode);
    console.log("StatusMessage: "+res.statusMessage);
    console.log("Body;\n"+body);
    console.log("\n");
});
