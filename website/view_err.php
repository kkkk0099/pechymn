<?php
include 'db.php';

$password="";

$status = ($_REQUEST["status"]==null?"":$_REQUEST["status"]);
if($status=="") $status="0";

try {
	$login = ($_REQUEST["login"]==null?"":$_REQUEST["login"]);

	if($login==$password)
	{
	}else{
		echo '0';
		die();
	}
} catch (Exception $e) {
	echo '0';
	die();
}


try {
	$id = ($_REQUEST["id"]==null?"":$_REQUEST["id"]);
	$value = ($_REQUEST["value"]==null?"":$_REQUEST["value"]);


	if($id!="" && $value!=""){
		$result = mysql_query("UPDATE tbl_report_err SET status = ".$value." WHERE id=".$_REQUEST["id"]);
		echo "1";
		die();
	}

} catch (Exception $e) {
	echo '0';
	die();
}

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-hk">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
<script src="jquery_mobile/jquery-1.7.1.min.js"></script>
<script>
	$(document).ready(function() {
		//---Remove ads---
		$('div.ui-loader').remove();
		$('div.bModal').remove();
		$('div.popup').remove();
		//----------------
	});

	function updateStatus(radio){
		var id = $(radio).attr("name").replace("status", "");
		var value = $(radio).attr("value");

		var hymn_type = $('input[checked="checked"]').val();
		var hymn_version = $('#hymn_version').val();
		var hymn_num = $('#hymn_num').val();
		var hymn_name = $('#hymn_name').val();
		var hymn_content = $('#hymn_content').val();

		$.ajax({
			url: "view_err.php",
			type: "POST",
			data: { login: "<?=$password?>", id: id, value: value }, 
			success: function (data) {
				if(data=="1"){
					$(radio).closest("tr").removeClass();
					$(radio).closest("tr").addClass("bgcolor" + value);
				}else{
					alert('Update failed');
				}
			},
			error: function (msg) { alert('Update failed'); }
		}); 
	}
</script>
<style>
	.bgcolor0 { background-color: #FFFFFF; }
	.bgcolor-1 { background-color: #bbbbbb; }
	.bgcolor2 { background-color: #E2FFD9; }
	.bgcolor1 { background-color: #A7C1F0; }
</style>
</head>
<body>
<form action="view_err.php?login=<?=$password?>" method="POST">
<select name="status" onchange="form.submit();">
	<option value="all" <?=($status=="all"?"selected":"")?>>全部</option>
	<option value="0" <?=($status=="0"?"selected":"")?>>未處理</option>
	<option value="-1" <?=($status=="-1"?"selected":"")?>>無需處理</option>
	<option value="2" <?=($status=="2"?"selected":"")?>>已更新OTA</option>
	<option value="1" <?=($status=="1"?"selected":"")?>>已處理</option>
</select>
<br/><br/>
<?php


$result = mysql_query("SELECT r.*, Report_Num FROM tbl_report_err r LEFT OUTER JOIN (SELECT song_id, COUNT(ID) AS Report_Num FROM tbl_report_err GROUP BY song_id) t1 ON r.song_id = t1.song_id ".($status=="all"?"":" WHERE r.status = ".$status)." ORDER BY FIELD(r.status, 0, 2, -1, 1), r.ID DESC; ");

if($result && mysql_num_rows($result)>0)
{
	echo '<table border=1><tr><td>ID</td><td>日期</td><td>Song ID</td><td>回報次數</td><td>內容</td><td></td></tr>';
	while ($row = mysql_fetch_assoc($result)) {
		echo '<tr class="bgcolor'.$row['status'].'"> <td>'.$row['id'].'</td><td>'.$row['curr_time'].'</td><td>'.$row['song_id'].'</td><td>'.$row['Report_Num'].'</td><td>'.$row['msg'].'</td><td style="width:110px;">
			<label><input type="radio" name="status'.$row['id'].'" value="0" '.($row['status']=="0"?"checked":"").' onClick="updateStatus(this)" />未處理</label><br/>
			<label><input type="radio" name="status'.$row['id'].'" value="-1" '.($row['status']=="-1"?"checked":"").' onClick="updateStatus(this)" />無需處理</label><br/>
			<label><input type="radio" name="status'.$row['id'].'" value="2" '.($row['status']=="2"?"checked":"").' onClick="updateStatus(this)" />已更新OTA</label><br/>
			<label><input type="radio" name="status'.$row['id'].'" value="1" '.($row['status']=="1"?"checked":"").' onClick="updateStatus(this)" />已處理</label>
		</td></tr>';
	}
	echo '</table>';
}

?>
</form>
</body>
</html>