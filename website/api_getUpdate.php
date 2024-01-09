<?php
header('Content-Type: application/json; charset=utf-8');
include 'db.php';

function echoJson($input){
	echo $_GET['callback'].'('.$input.')';
}


try {
	$version = ($_REQUEST["version"]==null?"":$_REQUEST["version"]);
	$d = ($_REQUEST["d"]==null?"":$_REQUEST["d"]);
	if($d!="" && !preg_match("/^\d{14}$/i", $d)){
		echoJson("{}"); die();
	}
	else if($version!="" && !is_numeric($version)){
		echoJson("{}"); die();
	}
	else{
		if($d == "" || date('YmdHis', strtotime($d)) == $d){
			if($d == "") $d = "00000000000000";
			if($version == "") $version = "1.6";
			$latest_d = $d;

			$result = mysql_query("SELECT id FROM history_update WHERE status=1 AND DATE_FORMAT(crt_datetime, '%Y%m%d%H%i%S') > '".str_replace("'","''",$d)."' ");

			$output = "";

			if($result && mysql_num_rows($result)>0)
			{
				$result = mysql_query(
							"SELECT * FROM hymn WHERE code IN (SELECT DISTINCT code FROM history_update WHERE status=1 AND version >= ".$version." ) ");

				while ($row = mysql_fetch_assoc($result)) {
					if($output!="") $output .= ",";
					$output .= '"'.$row['code'].'":["'.$row['name'].'","'.$row['hymn_num'].'","'.$row['content'].(trim($row['name_en'])=='' || trim($row['content_en'])==''? '': '<br><br><b><u>'.$row['name_en'].'</u></b><br><br>'.$row['content_en']).'"]';
				}

				//---Get Max datetime----
				$result = mysql_query(
							"SELECT DATE_FORMAT(crt_datetime, '%Y%m%d%H%i%S') AS d FROM history_update ORDER BY ID DESC LIMIT 1 ");
				if ($row = mysql_fetch_assoc($result)) {
					$latest_d = $row['d'];
				}
			}

			if($output!=""){
				echoJson('{ "d" : "'.$latest_d.'" , "data" : {'.$output.'} }');
			}else{
				echoJson("{}"); die();
			}


		}else{
			echoJson("{}"); die();
		}
	}



} catch (Exception $e) {
	echoJson("{}"); die();
}

?>