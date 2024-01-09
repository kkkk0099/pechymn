<?php
include 'db.php';

try {
	$song_id = $_REQUEST["id"];
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

	if($song_id!='' && strlen($song_id)<30)
	{
		
		$result = mysql_query("SELECT ID FROM tbl_hymn_song WHERE ip_addr='".$ip."' AND curr_time between subtime(now(),'0:0:7') and now()");
	
		if($result && mysql_num_rows($result)==0)
		{
			$str = "INSERT INTO tbl_hymn_song(curr_time, ip_addr, song_id) 
					VALUES( NOW(), '".$ip."','".fixSQL($song_id)."' )";
			mysql_query($str, $link) or die(mysql_error());
		}
		
	}

	echo '1';

} catch (Exception $e) {
	echo '0';
}

?>