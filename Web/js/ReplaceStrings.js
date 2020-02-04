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
/* 変換用テーブル */
function ReplaceStrings_table(table){
    this.index = table;
};

ReplaceStrings_table.prototype.replace_text = function(text){
//    console.log(text);
    for(i in this.index){
        let string=`%${i}%`;
        regexp = new RegExp(string,'g');  // /affasf/g

        text = text.replace(regexp,this.index[i]);
    //    console.log(regexp);
    //    console.log(text);
    }
    return text;
}

function ReplaceStrings_text(text){
    this.text = text;   //変換元になるデータ（TEXT形式）を保存する。
};
ReplaceStrings_text.prototype.replace_table = function(table){
    let txt = this.text;    //編集用にメッソド内にコピーを残す。元データは直接編集しない。
    for(i in table){
        let string=`%${i}%`;
        regexp = new RegExp(string,'g');  // /affasf/g

        txt = txt.replace(regexp,table[i]);
    //    console.log(regexp);
    //    console.log(text);
    }
    return txt;
}
/* Webでは不使用　以下はnodeで利用する
module.exports = {
    replaceStrings_table : ReplaceStrings_table,
    replaceStrings_text  : ReplaceStrings_text
}
*/