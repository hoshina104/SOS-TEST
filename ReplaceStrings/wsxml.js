/*
    SOSのXML中にあるキーワードを変換する
    クラス　RaplaceStrings_table
    コンストラクタ
    RaplaceStrings_table（table）　tableをコンストラクタに入力する。
    table: object形式
    例　table
    ｛
        a1:"b1",
        a2:1233.4
    ｝
    
    メッソド
    replace(text)
    text中の%a1%を変換する。%a1%をtableに基づいて置換する


    種類
    RaplaceStrings_table    :コンストラクタはtableを引数とする。 
        メッソドreplae_text(text)で変換結果をtext形式で出力する。
    RaplaceStrings_text     :コンストラクタはtextを引数とする。
        メッソドreplace_table(table)でtext形式で変換結果を出力

*/
let replacestring    = require('./ReplaceStrings.js');  //モジュールからを引き出す


/* 変換用テーブル */
var table00 = `{
    "id":"ws00",
    "procedure":"ws00",
    "offering":"offering0",
    "feartureOfInterest":"Kyouinshitu-3",
    "x":"139.79777552451446",
    "y":"38.709857896925634",
    "z":"15",
    "temp":"ws00/template/temp",
    "humi":"ws00/template/humi" 
}`;
let table = JSON.parse(table00);

const file = 'InsertSensor-Tsuruoka-template-ws-0.xml';       //InsertSensor用
//const file = 'insertResultTemplate-tsuruoka0-temp-ws.xml';　  //InsertResultTemplate用
//const file = 'insertResultTemplate-tsuruoka0-humi-ws.xml';　    //InsertResultTemplate用
const fs = require('fs','utf8');
let text = fs.readFileSync(file, 'utf8');

let replace_with_text = new replacestring.replaceStrings_text(text);    //モジュールからクラス「replaceStrings_text」をインスタンスする。
let result_xml  = replace_with_text.replace_table(table);               //オブジェクト「replace_with_text」のメッソド「replace_table」を実行

console.log("\r\n");
console.log(result_xml);
console.log("\r\n");