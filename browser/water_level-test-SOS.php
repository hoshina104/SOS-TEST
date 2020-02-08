<?php
/* 【注意】初期状態では必ずwater_level.txtの空ファイルを置くこと*/
/*  空ファイルの作成法 echo -n > newfine */
/*  空ファイルの属性が他のユーザーやグループからの書き込み可となっていること */
/* エラー出力制御  */
//ini_set('display_errors', 'On'); //エラー出力 'On'1/'Off'
   ini_set( 'error_reporting', E_ALL ); //全エラー・警告を出力
   include(__DIR__."/function00.php"); //使用する関数群をここに集約

/*** 設定 ***/

// データ保存ファイルの相対パス
//    define('TEMP_FILE_PATH', 'water_level.txt');
    define('TEMP_FILE_PATH', 'ajiki/water_level-test.txt');  //データ収納先
    define('FILE_HEAD','test-');	//日付データファイルのヘッダ名
    // 日時情報(YYYY/MM/DD HH:ii:ss形式)
    $timestamp = time();
    $strDate = date("Y/m/d H:i:s",$timestamp);
    //   echo $strDate."<br />";

    // 書き込む文字列
    $strLog = '';    //中身が空

/*** 値チェック ***/
    $strDistVal = $_GET['dist'];                   // 'water_level'という名前の変数に格納された値を受け取る
    $strTempVal = $_GET['temp'];                   // 'temp'という名前の変数に格納された値を受け取る
//    echo $strWaterLevelVal."<br />";
    echo "<b>Measure result</b><br>\n";
    $strDistVal = number_format($strDistVal,3, '.', '');    // 値をフォーマット（小数点以下の数値を3桁まで切り詰める）
    echo "GET dist   ->".$strDistVal."<br/>";
    $strTempVal = number_format($strTempVal, 2,'.','');    // 値をフォーマット（小数点以下の数値を2桁まで切り詰める）
    echo "GET temp   ->".$strTempVal."<br/>";
    $measVal=number_format(water_level($strDistVal,$strTempVal),1,'.',''); // 値をフォーマット（小数点以下の数値を1桁まで切り詰める
    if($measVal>=0.0){				//測定水位が負の数は0[cm]として転送する
    	$strWaterLevelVal =  $measVal;
    }else{
        $strWaterLevelVal =  number_format(0.00,1,'.','');
    }
    echo "Send Waterlevel ->".$strWaterLevelVal."<br/>"; //水深に換算

/* SOSへの送信 ※春日井市へのデータを遮断する場合はコメントアウト*/
    send_SOS_client($strWaterLevelVal);

/*******************************

SOS InsertResultをつかって
SOSサーバ procedure:kasugai01へデータを送る。

*******************************/
//ここから↓　①
/* 設定する値サンプル　ここから↓ */
$sos_insertResult_template=array(
    'Temperature' => 'kasugai01/template/Temperature',
    'Water_Depth' => 'kasugai01/template/Water_Depth',
    'SOSUrl'      => 'http://eeciot.tsuruoka-nct.ac.jp:8080/52nSOS/service'
);
$sos_insertResult_data = array(
    'Server'   => $sos_insertResult_template['SOSUrl'],
//      'template' => $sos_insertResult_template['Temperature'],    //使用テン $
    'template' => '',
    'data'     => ''   //(書式：1@日時#物理量@)1@2017-01-01T00:00:00+09:00#12.0$
);
/* 設定する値サンプル　ここまで↑ */
$Daytime = Date('c',time());

$sos_insertResult_data['template'] = $sos_insertResult_template['Temperature'];
$sos_insertResult_data['data']= '1@'.$Daytime.'#'.$strTempVal;
sos_insertResult($sos_insertResult_data);
echo "<br>\n<br>\n";
$sos_insertResult_data['template'] = $sos_insertResult_template['Water_Depth'];
$sos_insertResult_data['data']= '1@'.$Daytime.'#'.$measVal;
sos_insertResult($sos_insertResult_data);
//ここまで↑　　①




/*** 値を書き込み ***/

    // 書き込み形式
    // 日時情報（YYYY/MM/DD HH:ii:ss） + 水位 + 改行コード
    $strLog = $strDate . " Data[cm]  ". $strDistVal;
    $strLog = $strLog  . " Temp[C] "  . $strTempVal;
    $strLog = $strLog  . " Wl[cm] "   . $measVal;
    $strLog = $strLog  . "\r\n";	//改行コード(ファイル)
    echo $strLog."<br/>";

//    $pdate='2015/10/09';
    $pdate=substr($strDate,0,10);           //データ取得時の日付部分だけを抽出


    if(($fp= fopen(TEMP_FILE_PATH,"r+"))==FALSE){ //データファイルのオープン
	echo "<br/>Can not file :".TEMP_FILE_PATH."<br/>";
    }else{
	echo "<br/>Open file;".TEMP_FILE_PATH."<br/>";
    }

    flock($fp, LOCK_SH);                    //読み手となる。LOCK_SHで読み手、LOCK_EXで書き手
    $rec = fgets( $fp );                    //最初の一行を読み取る
    flock($fp, LOCK_UN);                    //ロック解除
//    echo "rec= ".$rec." ".strlen($rec)."<-<br />";


    $ndate=substr($rec, 0,10);              //ファイルの先頭行から日付を読み取る日付が"Y/m/d"形式のみ対応

//$ndate:ファイル内のデータの日付 $pdate:現在の日付
//*** 日付を跨ぐ場合の操作 ***//
    if($rec!=0 and strcmp($pdate,$ndate)!=0){           //日付を跨ぐ場合 $rec==0とはファイルが存在し且初期状態の時
        $fname="./ajiki/"
               .FILE_HEAD
               .substr($ndate,0,4)
               .substr($ndate,5,2)
               .substr($ndate,8,2).'.txt';
//        shell_exec('copy /Y '.TEMP_FILE_PATH.' '.$fname);   //コマンドの実行(windows用)
        shell_exec('cp -f '.TEMP_FILE_PATH.' '.$fname);   //Linux用

        flock($fp, LOCK_EX);                //ファイルをlock
        ftruncate($fp,0);                   //ファイルの中身を空にする
        fseek( $fp, 0, SEEK_SET);           // ファイルの先頭に移動
        flock($fp, LOCK_UN);                //ファルイルのlock解除

    }else{                                  //日付を跨がない場合
        fseek( $fp, 0, SEEK_END);           // ファイルの終端に移動
    }


//*** データの書き込み ***//
    flock($fp, LOCK_EX);    // ファイルを排他ロック
    fwrite($fp, $strLog);   // 送信された値をテキストファイルに書き込み
    flock($fp, LOCK_UN);    // ロックを開放
    fclose($fp);            // ファイルポインタをクローズ
?>

<?php
/*        // MySQLへのデータ保存 2016/06/28追記
        // MySQLサーバへ接続
        $link = mysql_connect('localhost', 'hoshina', 'hoshina');
        if (!$link) die('接続失敗です。'.mysql_error());
        // データベースの選択
        $db_selected = mysql_select_db('waterlevelkasugai', $link);
        if (!$db_selected) die('データベース選択失敗です。'.mysql_error());
        // クエリの入力：データを追加する
        mysql_set_charset('utf8');
        $query = 'INSERT INTO Data (datetime, waterlevel,temperature) VALUES ("'.$strDate.'",'.$strWaterLevelVal.','.$strTempVal.')';
        $result = mysql_query($query);
        if (!$result) die('クエリーが失敗しました。'.mysql_error());
        // サーバから切断
        mysql_close($link);
*/ ?>

<?php
/*
	データベースへ送信
	2018.1.30 更新
*/
	// データベースに格納するデータの準備
	$location = 'suii00';
	$dateVal = $strDate;
	$measVal = $strWaterLevelVal;
	$tempVal = $strTempVal;
	// データベースパラメータの設定
	$dbname = 'mysql:dbname=waterlevelkasugai;host=localhost';
	$dbuser = 'hoshina';
	$dbpasswd = 'hoshina';
	// データベースへの接続
	try{
		$dbh = new PDO($dbname, $dbuser, $dbpasswd);
		$dbh->query('SET NAMES utf8');
		// クエリの入力
		$sql = 'INSERT INTO Data (datetime,waterlevel,temperature) VALUES ("'.$dateVal.'",'.$measVal.','.$tempVal.')';
		$dbh->query($sql);
		echo 'データを格納しました。';
	}catch (PDOException $e){
		print('Error:'.$e->getMessage());
		die();
	}
	$dbh = null;
?>

<?php
/********************************
    SOS InsertResult
引数 $sos_insertResult_data
戻り値、成功0、失敗-1
 ********************************/
function sos_insertResult($setting){
        /* $setting 設定値の配列
        $setting['SOSUrl']      //SOSサーバ転送先
        $setting['template']    //テンプレートの種類
                $setting['data']     　 //データ
        */

        /* 【注意】以下は、SOSサーバの変更、取得センサの変更がない限り、変更不 $

        /* SOSサーバ・センサノード・取得情報の設定 */
        $url = $setting['Server'];          /* データの送り先 */
//    var_dump($setting);
        echo "<br>\n<br>\n";
        echo "<b>Excute InsertResult<br></b>\n";
        echo 'SOSURL   :'.$url."<br>\n";
        echo 'Template :'.$setting['template']."<br>\n";
        echo 'Data     :'.$setting['data']."<br>\n";
        /* SOSへ送るPOSTデータの定義 */
        $sos_GetResult = array(
            'request'   => 'InsertResult',
            'service'   => 'SOS',
            'version'   => '2.0.0',
            'templateIdentifier'  => $setting['template'],
            'resultValues'        => $setting['data']
            );

        $postdata = json_encode($sos_GetResult,JSON_UNESCAPED_SLASHES);

        /* HTTP POST関連の処理　ここから↓ */
        $options = array('http'    => array(
        //HTTP転送時のヘッダ情報
            'method'  => 'POST',
            'header'  => 'Content-type:application/json',
            'content' => $postdata,
        ));


    $context = stream_context_create($options);
    $SOSdata = file_get_contents($url, false, $context);
    /* file_get_contentsはstatuコードが200のときのみ動作し、bad request 400のと$
        /* HTTP POST関連の処理　ここまで↑ */
    $result = json_decode($SOSdata,true);
//    print('POST DATA ->\n'.$postdata."\n");  //POSTデータの内容表示
    if(($SOSdata=='')||($result['exceptions']!='')){   //エラーを生じた場合、SO$
        echo "<b>Not excute InsertResult!<br></b>\n";
        echo "[Send POST data]<br>\n".$postdata."<br><br>\n\n";
        echo "[Response SOS Response]<br>\n".$SOSdata."<br><br>\n\n";
//        print('exceptions:->'.$result['exceptions'][0]['text']."\n");
        return(-1);
    }else{
        echo "<b>Success to send data to SOS server</b><br>\n";
        return(0);
    }
}
?>
