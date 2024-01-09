<?php
header('Content-Type: application/json; charset=utf-8');
include 'db.php';

function echoJson($input){
	echo $_GET['callback'].'('.$input.')';
}

$latest_d = new DateTime("first day of this month");
$start_date = new DateTime("first day of last month - 5 month");
$end_date = new DateTime("last day of last month");


/*echo " latest_d: ".$latest_d->format('Y-m-d');
echo " start_date: ".$start_date->format('Y-m-d');
echo " end_date: ".$end_date->format('Y-m-d');
die();*/

try {
	$d = ($_REQUEST["d"]==null?"":$_REQUEST["d"]);
	if($d!="" && !preg_match("/^\d{14}$/i", $d)){
		echoJson("{}"); die();
	}
	else{
		if($d == "" || date('YmdHis', strtotime($d)) == $d){
			if($d == "") $d = "00000000000000";

			
			if($d>=$latest_d->format('Ymd000000')){
				echoJson("{}"); die();
			}

			$output = "";

			$a_hot_limit = 15;
			$a_cool_limit = 20;
			$b_hot_limit = 10;
			$b_cool_limit = 15;
			$c_hot_limit = 5;
			$c_cool_limit = 10;


			$result = mysql_query("SELECT song_id, COUNT(id) AS num FROM tbl_hymn_song WHERE curr_time BETWEEN '".$start_date->format('Y-m-d')."' AND '".$end_date->format('Y-m-d')."' AND song_id LIKE 'hymn_a_%' GROUP BY song_id ORDER BY num DESC LIMIT ".$a_hot_limit);
			while ($row = mysql_fetch_assoc($result)) {
				if($output!="") $output .= ",";
				$output .= '["hot","'.$row['song_id'].'"]';
			}

			$result = mysql_query("SELECT song_id, COUNT(id) AS num FROM tbl_hymn_song WHERE curr_time BETWEEN '".$start_date->format('Y-m-d')."' AND '".$end_date->format('Y-m-d')."' AND song_id LIKE 'hymn_b_%' GROUP BY song_id ORDER BY num DESC LIMIT ".$b_hot_limit);
			while ($row = mysql_fetch_assoc($result)) {
				if($output!="") $output .= ",";
				$output .= '["hot","'.$row['song_id'].'"]';
			}

			$result = mysql_query("SELECT song_id, COUNT(id) AS num FROM tbl_hymn_song WHERE curr_time BETWEEN '".$start_date->format('Y-m-d')."' AND '".$end_date->format('Y-m-d')."' AND song_id LIKE 'hymn_c_%' GROUP BY song_id ORDER BY num DESC LIMIT ".$c_hot_limit);
			while ($row = mysql_fetch_assoc($result)) {
				if($output!="") $output .= ",";
				$output .= '["hot","'.$row['song_id'].'"]';
			}



			$result = mysql_query("SELECT song_id, COUNT(id) AS num FROM tbl_hymn_song WHERE curr_time BETWEEN '".$start_date->format('Y-m-d')."' AND '".$end_date->format('Y-m-d')."' AND song_id LIKE 'hymn_a_%' GROUP BY song_id ORDER BY num LIMIT ".$a_cool_limit);
			while ($row = mysql_fetch_assoc($result)) {
				if($output!="") $output .= ",";
				$output .= '["cool","'.$row['song_id'].'"]';
			}

			$result = mysql_query("SELECT song_id, COUNT(id) AS num FROM tbl_hymn_song WHERE curr_time BETWEEN '".$start_date->format('Y-m-d')."' AND '".$end_date->format('Y-m-d')."' AND song_id LIKE 'hymn_b_%' GROUP BY song_id ORDER BY num LIMIT ".$b_cool_limit);
			while ($row = mysql_fetch_assoc($result)) {
				if($output!="") $output .= ",";
				$output .= '["cool","'.$row['song_id'].'"]';
			}

			$result = mysql_query("SELECT song_id, COUNT(id) AS num FROM tbl_hymn_song WHERE curr_time BETWEEN '".$start_date->format('Y-m-d')."' AND '".$end_date->format('Y-m-d')."' AND song_id LIKE 'hymn_c_%' GROUP BY song_id ORDER BY num LIMIT ".$c_cool_limit);
			while ($row = mysql_fetch_assoc($result)) {
				if($output!="") $output .= ",";
				$output .= '["cool","'.$row['song_id'].'"]';
			}
			


			if($output!=""){
				echoJson('{ "d" : "'.$latest_d->format('Ymd000000').'" , "list" : ['.$output.']}');
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