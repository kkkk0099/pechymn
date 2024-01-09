<?php
include 'db.php';

header('Content-Type: text/html; charset=utf-8');

try {
	$song_id = $_REQUEST["id"];
	$msg = $_REQUEST["msg"];
	$ip = "";

	if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
	{
	  $ip=$_SERVER['HTTP_CLIENT_IP'];
	}
	elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
	{
	  $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	else
	{
	  $ip=$_SERVER['REMOTE_ADDR'];
	}

	if($song_id!='' && strlen($song_id)<30 && strlen($msg)<500)
	{
		
		$result = mysql_query("SELECT ID FROM tbl_report_err WHERE ip_addr='".$ip."' AND curr_time between subtime(now(),'0:0:15') and now()");
	
		if($result && mysql_num_rows($result)==0)
		{
			$str = "INSERT INTO tbl_report_err(curr_time, ip_addr, song_id, msg) 
					VALUES( NOW(), '".$ip."','".fixSQL($song_id)."','".fixSQL($msg)."' )";
			mysql_query($str, $link) or die(mysql_error());
		}
	}

	echo $_GET['callback'].'({result:1})';

} catch (Exception $e) {
	echo '0';
}

?>