<?php
include 'db.php';

function echoJson($input, $format){
	if($format=="v2"){
		echo $input;
	}else{
		echo $_GET['callback'].'('.$input.')';
	}
}


try {
	$format = ($_REQUEST["format"]==null?"":$_REQUEST["format"]);

	$song_id = ($_REQUEST["song_id"]==null?"":$_REQUEST["song_id"]);
	$user_id = ($_REQUEST["user_id"]==null?"":$_REQUEST["user_id"]);
	$token = ($_REQUEST["token"]==null?"":$_REQUEST["token"]);
	$datetime = ($_REQUEST["datetime"]==null?"":$_REQUEST["datetime"]);
	
	if($datetime=="" || !is_numeric($datetime) || strlen($datetime)!=14 || strpos($datetime, date("Ymd"))===false ){
		echoJson("{}", $format); die();
	}
	else if($user_id=="" || !is_numeric($user_id)){
		echoJson("{}", $format); die();
	}
	else if($song_id==""){
		echoJson("{}", $format); die();
	}
	else if($token==""){
		echoJson("{}", $format); die();
	}
	else{
		
		$user_key = "";
		$result = mysql_query("SELECT user_key FROM tbl_users WHERE user_id = ".$user_id." LIMIT 1");

		while ($row = mysql_fetch_assoc($result)) {
			$user_key = strval($row['user_key']);
		}
		
		if($user_key!=""){

			if(checkHashVal($token, $user_id.$user_key.$song_id, $datetime)){	//Valid request

				
				$result = mysql_query("SELECT ID FROM tbl_hymn_song_m WHERE user_id=".$user_id." AND curr_time between subtime(now(),'0:0:5') and now()");
			
				if($result && mysql_num_rows($result)==0)
				{
					mysql_query("INSERT INTO tbl_hymn_song_m (user_id, curr_time, song_id) VALUES ( ".$user_id.", now(), '".fixSQL($song_id)."')");
	
					echoJson('{"status":"1"}', $format); die();

				}else{
					echoJson("{}", $format); die();
				}

			}else{
				echoJson("{}", $format); die();
			}
			
		}else{
			echoJson("{}", $format); die();
		}

	}


} catch (Exception $e) {
	echoJson("{}", $format); die();
}

?>