<?php
$db_name = "pechymn";
$link=mysql_connect("localhost", "pechymn", "pw") or die("Could not connect");
mysql_select_db($db_name, $link);
mysql_query("SET NAMES 'utf8'");

function fixSQL($str){
	if (trim($str) != ''):
		$str = str_replace('<script', '', $str);
		$str = str_replace('.js', '', $str);
		$str = str_replace('cast(', '', $str);
		$str = str_replace("\\'", "'", $str);
		$str = str_replace("'", "''", $str);
	endif;
	return $str;
}

function elim_newline($str){
	return str_replace("\n",'',str_replace("\r\n",'',$str));
}


function checkHashVal($hashed_val, $input, $datetime){
	$hashed_val = strtoupper($hashed_val);
	
	if(!is_numeric($datetime) || strlen($datetime)!=14){
		return false;
	}
	else if(getHash($input, $datetime)!=$hashed_val){
		return false;
	}
	else{
		return true;
	}
	
}

function getHash($input, $datetime){
	$salt = "00000000000000000000";
	$coded_i = $salt.$input.$datetime;
	
	if(!is_numeric($datetime) || strlen($datetime)!=14){
		return "";
	}
	else{
		return strtoupper(hash('sha512', $coded_i));
	}
	
	
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>