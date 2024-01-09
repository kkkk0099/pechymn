<?php
header('Content-Type: application/json; charset=utf-8');
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

	$user_id = ($_REQUEST["user_id"]==null?"":$_REQUEST["user_id"]);
	$user_key = ($_REQUEST["user_key"]==null?"":$_REQUEST["user_key"]);
	$token = ($_REQUEST["token"]==null?"":$_REQUEST["token"]);
	$datetime = ($_REQUEST["datetime"]==null?"":$_REQUEST["datetime"]);
	$version = ($_REQUEST["version"]==null?"":$_REQUEST["version"]);
	$OS_type = ($_REQUEST["OS_type"]==null?"":$_REQUEST["OS_type"]);
	
	$pref_fontsize = ($_REQUEST["pref_fontsize"]==null?"":$_REQUEST["pref_fontsize"]);
	$pref_theme = ($_REQUEST["pref_theme"]==null?"":$_REQUEST["pref_theme"]);
	$pref_lang = ($_REQUEST["pref_lang"]==null?"":$_REQUEST["pref_lang"]);
	$pref_showc = ($_REQUEST["pref_showc"]==null?"":$_REQUEST["pref_showc"]);
	
	
	if($datetime=="" || !is_numeric($datetime) || strlen($datetime)!=14 || strpos($datetime, date("Ymd"))===false ){
		echoJson("{}", $format); die();
	}
	else if($user_id!="" && !is_numeric($user_id)){
		echoJson("{}", $format); die();
	}
	else if($version=="" || !is_numeric($version)){
		echoJson("{}", $format); die();
	}
	else if($token==""){
		echoJson("{}", $format); die();
	}
	else if($user_key==""){
		echoJson("{}", $format); die();
	}
	else{

		$str_to_hash = $version.$OS_type.$pref_fontsize.$pref_theme.$pref_lang.$pref_showc;
		
		
		if(checkHashVal($token, $user_id.$user_key.$str_to_hash, $datetime)){	//Valid request
		
			$existing_user_id = "";
			$result = mysql_query("SELECT user_id FROM tbl_users WHERE user_key = '".fixSQL($user_key)."' LIMIT 1");

			while ($row = mysql_fetch_assoc($result)) {
				$existing_user_id = strval($row['user_id']);
			}
			
			if($existing_user_id==""){ //new user
			
				mysql_query("INSERT INTO tbl_users (user_key, crt_datetime, pref_fontsize, pref_theme, pref_lang, pref_showc, version, OS_type) VALUES ('".fixSQL($user_key)."', now(), '".fixSQL($pref_fontsize)."', '".fixSQL($pref_theme)."', '".fixSQL($pref_lang)."', '".fixSQL($pref_showc)."', '".fixSQL($version)."', '".fixSQL($OS_type)."' )");
				$result = mysql_query("SELECT LAST_INSERT_ID() AS LAST_INSERT_ID;");
							
				$id = "";
				while ($row = mysql_fetch_assoc($result)) {
					$id = strval($row['LAST_INSERT_ID']);
				}

				if(is_numeric($id)){

					mysql_query("INSERT INTO tbl_hymn_visit_m (user_id, curr_time) VALUES ( ".$id.", now() )");

					echoJson('{"status":"1", "id":"'.$id.'", "user_key":"'.$user_key.'"}', $format); die();
					
				}else{
					echoJson("{}", $format); die();
				}
				
			}
			else if($existing_user_id==$user_id){ //update existing user
				
				mysql_query("UPDATE tbl_users SET version='".fixSQL($version)."'
							, OS_type='".fixSQL($OS_type)."'
							, pref_fontsize='".fixSQL($pref_fontsize)."'
							, pref_theme='".fixSQL($pref_theme)."'
							, pref_lang='".fixSQL($pref_lang)."'
							, pref_showc='".fixSQL($pref_showc)."' WHERE user_id = ".$user_id);

							
				mysql_query("INSERT INTO tbl_hymn_visit_m (user_id, curr_time) VALUES ( ".$user_id.", now() )");

							
				echoJson('{"status":"1"}', $format); die();
					
			}
			else{	//diff user with same user_key - conflict
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