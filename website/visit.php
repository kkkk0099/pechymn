<?php
include 'db.php';

try {
	$HTTP_USER_AGENT = $_SERVER['HTTP_USER_AGENT'];
	$ip = "";
	$version_type = ($_REQUEST["t"]==null?"":$_REQUEST["t"]);
	$version = ($_REQUEST["v"]==null?"":$_REQUEST["v"]);

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

	$result = mysql_query("SELECT ID FROM tbl_hymn_visit WHERE ip_addr='".$ip."' AND curr_time between subtime(now(),'0:0:30') and now()");

	if($result && mysql_num_rows($result)==0)
	{
		$str = "INSERT INTO tbl_hymn_visit(curr_time, ip_addr, browser, Type, version) 
				VALUES( NOW(), '".$ip."','".fixSQL($HTTP_USER_AGENT)."','".fixSQL($version_type)."','".fixSQL($version)."' )";
		mysql_query($str, $link) or die(mysql_error());
	}
	
	echo '1';
} catch (Exception $e) {
	echo '0';
}

?>