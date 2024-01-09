<?php
include 'db.php';

header('Content-Type: text/javascript; charset=utf-8');
header("Content-Disposition: attachment; filename=hymn_script.js");

$password="";

try {

	$login = ($_REQUEST["login"]==null?"":$_REQUEST["login"]);


	if($login==$password)
	{

		$result = mysql_query("SELECT * FROM hymn");

		$hymn_a_data = "";
		$hymn_b_data = "";
		$hymn_c_data = "";

		if($result && mysql_num_rows($result)>0)
		{
			while ($row = mysql_fetch_assoc($result)) {
				if($row['type']=="hymn_a_data"){
					if($hymn_a_data!="") $hymn_a_data .= ",";
					$hymn_a_data .= '"'.$row['code'].'":["'.$row['name'].'","'.$row['hymn_num'].'","'.$row['content'].($row['content_en']==""?"":'<br><br><b><u>'.$row['name_en'].'</u></b><br><br>'.$row['content_en']).'"]';
				}else if($row['type']=="hymn_b_data"){
					if($hymn_b_data!="") $hymn_b_data .= ",";
					$hymn_b_data .= '"'.$row['code'].'":["'.$row['name'].'","'.$row['hymn_num'].'","'.$row['content'].($row['content_en']==""?"":'<br><br><b><u>'.$row['name_en'].'</u></b><br><br>'.$row['content_en']).'"]';
				}else if($row['type']=="hymn_c_data"){
					if($hymn_c_data!="") $hymn_c_data .= ",";
					$hymn_c_data .= '"'.$row['code'].'":["'.$row['name'].'","'.$row['hymn_num'].'","'.$row['content'].($row['content_en']==""?"":'<br><br><b><u>'.$row['name_en'].'</u></b><br><br>'.$row['content_en']).'"]';
				}
			}
		}

		$hymn_a_data = "var hymn_a_data = {\n".$hymn_a_data."\n};\n";
		$hymn_b_data = "var hymn_b_data = {\n".$hymn_b_data."\n};\n";
		$hymn_c_data = "var hymn_c_data = {\n".$hymn_c_data."\n};";

		echo $hymn_a_data.$hymn_b_data.$hymn_c_data;

	}

} catch (Exception $e) {
}

?>