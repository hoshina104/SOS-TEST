/*
	ArduinoでSOS APIを作製する一例
	InsertResutl API(JSON形式)を作る
*/

// InsertSensor APIの例
//
String insertresult = R"({
  "request": "InsertResult",
  "service": "SOS",
  "version": "2.0.0",
  "templateIdentifier": "tsuruoka/arduino/00/temp/",
  "resultValues": "%DATA%"
})";


/* SOS APIクラス */
class SOS_API {
private:

protected:
	String original;	//APIの編集前
	String copy;		//編集用
public:
	SOS_API();
	SOS_API(String ca);				//APIのテンプレートの読み込み
	String write(String word);		//%DATA%をwordに書き換える
	String replace(String str0, String str1);	//str0をstr1に書き換える
	String undo();					//編集前のテンプレートに戻す
};

/* コンストラクタ */
SOS_API::SOS_API() {

}

/*　
	コンストラクタ
	引数　String str :SOS APIのテンプレート
*/
SOS_API::SOS_API(String str) {
	original = str;
	copy = original;
}

/*
	メッソド	
	機能	テンプレート内の%DATA%文字列をwordに入れ替える
	引数	String word		:テンプレート内の%DATA%をwordに書き換える
	戻り値	Sting			:書き換え後のAPIデータ
*/
String SOS_API::write(String word)
{
	copy.replace("%DATA%", word);
	return copy;
}


/*
	メッソド
	機能	テンプレート内の文字列str0を文字列str1に置き換える
	引数	String str0		:テンプレート内の置換される文字列
			String str1		:テンプレート内のstr0に替わり置換する文字列
	戻り値	Sting			:書き換え後のAPIデータ
*/
String SOS_API::replace(String str0, String str1)
{
	copy.replace(str0, str1);
	return copy;
}


/*
	メッソド
	機能	編集データを編集前の初期状態に戻す
	引数	String word		:テンプレート内の%DATA%をwordに書き換える
	戻り値	Sting			:書き換え後のAPIデータ
*/
String SOS_API::undo()
{
	copy = original;
	return original;
}


/* SOS_APIの継承の例 */
class inheritance_SOS_API : public SOS_API {
private:
public:
	inheritance_SOS_API();
	inheritance_SOS_API(String data);
};
inheritance_SOS_API::inheritance_SOS_API()
{

}
/* 引数付きコンストラクタ */
inheritance_SOS_API::inheritance_SOS_API(String data):SOS_API(data)
{
	//protectedをpublicで継承しているので基底クラスSOS_APのプロパティが見えている．

}


void setup()
{
	SOS_API sos_insertresult(insertresult);	//
	inheritance_SOS_API inheri_sos_insertresult(insertresult);

	Serial.begin(9600);
	delay(1000);	//シリアルポートの初期化の時間を稼ぐ
	Serial.println("*****************************************");
	Serial.println("Start Arduino\n");

	String  data = "1@2017-04-19T13:30:00+02:00#12.34@";	//データ列の一例
	
	Serial.println("write method");
	Serial.print("SOS APPI: InsertResult JSON\n"); Serial.println(sos_insertresult.write(data));
	Serial.println("\n");
	Serial.print("SOS APPI: InsertResult JSON\n"); Serial.println(sos_insertresult.undo());

	Serial.println("replace method");
	Serial.print("SOS APPI: InsertResult JSON\n"); Serial.println(sos_insertresult.replace("%DATA%",data));
	Serial.println("\n");
	Serial.print("SOS APPI: InsertResult JSON\n"); Serial.println(sos_insertresult.undo());

	Serial.println("inheri check");
	Serial.println(inheri_sos_insertresult.write("XYZ123ABC"));
	Serial.println(sos_insertresult.write("SOS-SOS"));

}

// Add the main program code into the continuous loop() function
void loop()
{


}
