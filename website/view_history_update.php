<?php
include 'db.php';

$password="";

$status = ($_REQUEST["status"]==null?"":$_REQUEST["status"]);
if($status=="") $status="-1";

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
		$result = mysql_query("UPDATE history_update SET status = ".$value." WHERE id=".$_REQUEST["id"]);
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
			url: "view_history_update.php",
			type: "POST",
			data: { login: "<?=$login?>", id: id, value: value }, 
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
	.bgcolor-1 { background-color: #FFFFFF; }
	.bgcolor0 { background-color: #bbbbbb; }
	.bgcolor2 { background-color: #E2FFD9; }
	.bgcolor1 { background-color: #A7C1F0; }
</style>
</head>
<body>
<form action="view_history_update.php?login=<?=$login?>" method="POST">
<select name="status" onchange="form.submit();">
	<option value="all" <?=($status=="all"?"selected":"")?>>全部</option>
	<option value="0" <?=($status=="0"?"selected":"")?>>不執行</option>
	<option value="-1" <?=($status=="-1"?"selected":"")?>>待處理</option>
	<option value="1" <?=($status=="1"?"selected":"")?>>已處理</option>
</select>
<br/><br/>
<?php


$result = mysql_query("SELECT * FROM history_update ".($status=="all"?"":" WHERE status = ".$status)." ORDER BY ID DESC; ");

if($result && mysql_num_rows($result)>0)
{
	echo '<table border=1><tr><td>ID</td><td>Version</td><td>Code</td><td>Date</td><td>Status</td></tr>';
	while ($row = mysql_fetch_assoc($result)) {
		echo '<tr class="bgcolor'.$row['status'].'"> <td>'.$row['id'].'</td><td>'.$row['version'].'</td><td>'.$row['code'].'</td><td>'.$row['crt_datetime'].'</td><td style="width:110px;">
			<label><input type="radio" name="status'.$row['id'].'" value="0" '.($row['status']=="0"?"checked":"").' onClick="updateStatus(this)" />不執行</label><br/>
			<label><input type="radio" name="status'.$row['id'].'" value="-1" '.($row['status']=="-1"?"checked":"").' onClick="updateStatus(this)" />待處理</label><br/>
			<label><input type="radio" name="status'.$row['id'].'" value="1" '.($row['status']=="1"?"checked":"").' onClick="updateStatus(this)" />已處理</label>
		</td></tr>';
	}
	echo '</table>';
}

?>
</form>
</body>
</html>