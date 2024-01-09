<?php
include 'db.php';

header('Content-Type: text/html; charset=utf-8');

$password="";


try {

	$login = ($_REQUEST["login"]==null?"":$_REQUEST["login"]);


	if($login==$password)
	{

		$handle = @fopen("hymn_script.js", "r");
		if ($handle) {
			$i=0;
			while (($buffer = fgets($handle)) !== false) {
				$read_all_split[$i] = rtrim($buffer, "\n");
				$i++;
			}
			fclose($handle);
		}
		
		$hymn_a_data = json_decode('{'.$read_all_split[1].'}');
		$hymn_b_data = json_decode('{'.$read_all_split[4].'}');
		$hymn_c_data = json_decode('{'.$read_all_split[7].'}');

		while ($mydata = current($hymn_a_data)) {
			mysql_query("INSERT INTO hymn (type, code, hymn_num, name, content) VALUES (
						'hymn_a_data'
						,'".key($hymn_a_data)."'
						,'".$mydata[1]."'
						,'".str_replace("'","''",$mydata[0])."'
						,'".str_replace("'","''",$mydata[2])."'
						)");
			next($hymn_a_data);
		}
		
		while ($mydata = current($hymn_b_data)) {
			mysql_query("INSERT INTO hymn (type, code, hymn_num, name, content) VALUES (
						'hymn_b_data'
						,'".key($hymn_b_data)."'
						,'".$mydata[1]."'
						,'".str_replace("'","''",$mydata[0])."'
						,'".str_replace("'","''",$mydata[2])."'
						)");
			next($hymn_b_data);
		}

		while ($mydata = current($hymn_c_data)) {
			mysql_query("INSERT INTO hymn (type, code, hymn_num, name, content) VALUES (
						'hymn_c_data'
						,'".key($hymn_c_data)."'
						,'".$mydata[1]."'
						,'".str_replace("'","''",$mydata[0])."'
						,'".str_replace("'","''",$mydata[2])."'
						)");
			next($hymn_c_data);
		}

		echo "1";


	}


} catch (Exception $e) {
}

?>