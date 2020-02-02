/*
	Arduino��SOS API���쐻������
	InsertResutl API(JSON�`��)�����
*/

// InsertSensor API�̗�
//
String insertresult = R"({
  "request": "InsertResult",
  "service": "SOS",
  "version": "2.0.0",
  "templateIdentifier": "tsuruoka/arduino/00/temp/",
  "resultValues": "%DATA%"
})";


/* SOS API�N���X */
class SOS_API {
private:

protected:
	String original;	//API�̕ҏW�O
	String copy;		//�ҏW�p
public:
	SOS_API();
	SOS_API(String ca);				//API�̃e���v���[�g�̓ǂݍ���
	String write(String word);		//%DATA%��word�ɏ���������
	String replace(String str0, String str1);	//str0��str1�ɏ���������
	String undo();					//�ҏW�O�̃e���v���[�g�ɖ߂�
};

/* �R���X�g���N�^ */
SOS_API::SOS_API() {

}

/*�@
	�R���X�g���N�^
	�����@String str :SOS API�̃e���v���[�g
*/
SOS_API::SOS_API(String str) {
	original = str;
	copy = original;
}

/*
	���b�\�h	
	�@�\	�e���v���[�g����%DATA%�������word�ɓ���ւ���
	����	String word		:�e���v���[�g����%DATA%��word�ɏ���������
	�߂�l	Sting			:�����������API�f�[�^
*/
String SOS_API::write(String word)
{
	copy.replace("%DATA%", word);
	return copy;
}


/*
	���b�\�h
	�@�\	�e���v���[�g���̕�����str0�𕶎���str1�ɒu��������
	����	String str0		:�e���v���[�g���̒u������镶����
			String str1		:�e���v���[�g����str0�ɑւ��u�����镶����
	�߂�l	Sting			:�����������API�f�[�^
*/
String SOS_API::replace(String str0, String str1)
{
	copy.replace(str0, str1);
	return copy;
}


/*
	���b�\�h
	�@�\	�ҏW�f�[�^��ҏW�O�̏�����Ԃɖ߂�
	����	String word		:�e���v���[�g����%DATA%��word�ɏ���������
	�߂�l	Sting			:�����������API�f�[�^
*/
String SOS_API::undo()
{
	copy = original;
	return original;
}


/* SOS_API�̌p���̗� */
class inheritance_SOS_API : public SOS_API {
private:
public:
	inheritance_SOS_API();
	inheritance_SOS_API(String data);
};
inheritance_SOS_API::inheritance_SOS_API()
{

}
/* �����t���R���X�g���N�^ */
inheritance_SOS_API::inheritance_SOS_API(String data):SOS_API(data)
{
	//protected��public�Ōp�����Ă���̂Ŋ��N���XSOS_AP�̃v���p�e�B�������Ă���D
	copy = data;
}


void setup()
{
	SOS_API sos_insertresult(insertresult);	//
	inheritance_SOS_API inheri_sos_insertresult(insertresult);

	Serial.begin(9600);
	delay(1000);	//�V���A���|�[�g�̏������̎��Ԃ��҂�
	Serial.println("*****************************************");
	Serial.println("Start Arduino\n");

	String  data = "1@2017-04-19T13:30:00+02:00#12.34@";	//�f�[�^��̈��
	
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
