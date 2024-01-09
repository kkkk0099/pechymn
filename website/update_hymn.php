<?php
include 'db.php';

$password="";
$password2="";

try {
	$login = ($_REQUEST["login"]==null?"":$_REQUEST["login"]);
	$method = ($_REQUEST["method"]==null?"":$_REQUEST["method"]);
	$hymn_version = ($_REQUEST["hymn_version"]==null?"":$_REQUEST["hymn_version"]);
	$hymn_type = ($_REQUEST["hymn_type"]==null?"":$_REQUEST["hymn_type"]);
	$hymn_num = ($_REQUEST["hymn_num"]==null?"":$_REQUEST["hymn_num"]);
	$hymn_name = ($_REQUEST["hymn_name"]==null?"":$_REQUEST["hymn_name"]);
	$hymn_content = elim_newline(($_REQUEST["hymn_content"]==null?"":$_REQUEST["hymn_content"]));
	$hymn_content_en = elim_newline($_REQUEST["hymn_content_en"]==null?"":$_REQUEST["hymn_content_en"]);


	if($login==$password || $login==$password2)
	{

		if($method=="load" && $hymn_type!="" && $hymn_num!=""){
			echo '{';
			$result = mysql_query("SELECT * FROM hymn WHERE code='hymn_".str_replace("'","''",$hymn_type)."_".str_replace("'","''",$hymn_num)."' LIMIT 1");

			if($result && mysql_num_rows($result)>0)
			{
				while ($row = mysql_fetch_assoc($result)) {
					echo '"name":'.'"'.$row['name'].'" , "content":'.'"'.elim_newline($row['content']).'" , "content_en":'.'"'.elim_newline($row['content_en']).'"';
				}
			}
			echo '}';
			die();
		}


		if($method=="submit" && $hymn_type!="" && $hymn_num!="" && $hymn_name!="" && $hymn_content!=""){
			
			if($login==$password){
				mysql_query("UPDATE hymn SET name='".str_replace("'","''",$hymn_name)."', content='".str_replace("'","''",str_replace("\'","'",$hymn_content))."', content_en='".str_replace("'","''",str_replace("\'","'",$hymn_content_en))."' WHERE code='hymn_".str_replace("'","''",$hymn_type)."_".str_replace("'","''",$hymn_num)."'");

				mysql_query("INSERT INTO history_update (version, code, crt_datetime) VALUES ( '".str_replace("'","''",$hymn_version)."', 'hymn_".str_replace("'","''",$hymn_type)."_".str_replace("'","''",$hymn_num)."', NOW())");
			}else if($login==$password2){
				mysql_query("UPDATE hymn SET content_en='".str_replace("'","''",str_replace("\'","'",$hymn_content_en))."' WHERE code='hymn_".str_replace("'","''",$hymn_type)."_".str_replace("'","''",$hymn_num)."'");

				mysql_query("INSERT INTO history_update (version, code, crt_datetime, status) VALUES ( '".str_replace("'","''",$hymn_version)."', 'hymn_".str_replace("'","''",$hymn_type)."_".str_replace("'","''",$hymn_num)."', NOW(), -1)");
			}


			echo '1';
			die();
		}

		
		$version = "1.6";
		$rs = mysql_query("SELECT MAX(version) as version FROM history_update");
		if($rs && mysql_num_rows($rs)>0)
		{
			$row = mysql_fetch_assoc($rs);
			$version = $row['version'];
		}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
<script src="jquery_mobile/jquery-1.7.1.min.js"></script>
<link rel="stylesheet" href="jquery_mobile/jquery.mobile.css" />
<script src="jquery_mobile/jquery.mobile.docs.js"></script>
<script>
	$(document).ready(function() {
		//---Remove ads---
		$('div.ui-loader').remove();
		$('div.bModal').remove();
		$('div.popup').remove();
		//----------------



		$( "input[name='hymn_type']" ).click(function() {
			resetForm();
		});
	});

	function updatePreview(){
		$('#hymn_content').val($('#hymn_content').val().replace(/\"/g, ''));
		$('#hymn_content_en').val($('#hymn_content_en').val().replace(/\"/g, ''));
		$('#preview').html("<b>" + $('#hymn_name').val() + "</b><br/><br/>" + $('#hymn_content').val() + "<br/><br/>" + $('#hymn_content_en').val());
	}

	function loadHymn(){
		var hymn_type = $('input[checked="checked"]').val();
		var hymn_num = $('#hymn_num').val();

		$.ajax({
			url: "update_hymn.php",
			type: "POST",
			data: { login: "<?=$login?>", method: "load", hymn_type: hymn_type, hymn_num: hymn_num }, 
			success: function (data) {
				data = $.parseJSON(data);
				$('#hymn_name').val(data.name);
				$('#hymn_content').val(data.content);
				$('#hymn_content_en').val(data.content_en);
				updatePreview();
			},
			error: function (msg) {  }
		}); 
	}

	function resetForm(){
		$('#preview').html('');
		$('#hymn_content').val('');
		$('#hymn_content_en').val('');
		$('#hymn_name').val('');
		$('#hymn_num').val('');
		$('#hymn_num').focus();
	}
	
	function submitHymn(){
		if(confirm("Proceed to save?")){
			var hymn_type = $('input[checked="checked"]').val();
			var hymn_version = $('#hymn_version').val();
			var hymn_num = $('#hymn_num').val();
			var hymn_name = $('#hymn_name').val();
			var hymn_content = $('#hymn_content').val();
			var hymn_content_en = $('#hymn_content_en').val();

			$.ajax({
				url: "update_hymn.php",
				type: "POST",
				data: { login: "<?=$login?>", method: "submit", hymn_version: hymn_version, hymn_type: hymn_type, hymn_num: hymn_num, hymn_name: hymn_name, hymn_content: hymn_content, hymn_content_en: hymn_content_en }, 
				success: function (data) {
					if(data=="1"){
						alert('Update success');
					}else{
						alert('Update failed');
					}
				},
				error: function (msg) { alert('Update failed'); }
			}); 
		}
	}
</script>
</head>
<body>
<style>
table.tblInput {width: 100%;}
table.tblInput td{ padding: 10px 20px; }
#hymn_content, #hymn_content_en { height: 200px; }
</style>
<div style="text-align:center;">
<table class="tblInput">
	<tr>
		<td style="width: 150px;">
			<fieldset data-role="controlgroup" data-mini="true" data-type="horizontal" style="text-align: center;">
				<input type="radio" name="hymn_type" id="hymn_type_a" value="a" checked="checked" />
				<label for="hymn_type_a">A</label>
				<input type="radio" name="hymn_type" id="hymn_type_b" value="b"  />
				<label for="hymn_type_b">B</label>
				<input type="radio" name="hymn_type" id="hymn_type_c" value="c"  />
				<label for="hymn_type_c">C</label>
			</fieldset>
		</td>
		<td>
			 <input type="text" id="hymn_num" name="hymn_num" placeholder="Number" onkeyup="loadHymn()" />
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<hr/>
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<table style="border:0; width:100%">
				<tr>
					<td style="width:80%;">
						<input name="hymn_name" id="hymn_name" placeholder="Title" onkeyup="updatePreview()" onblur="updatePreview()" <?=($login==$password?"":"Disabled")?>></input>
					</td>
					<td>
						&nbsp;&nbsp;&nbsp;Version:
						<input name="hymn_version" id="hymn_version" placeholder="Version" value="<?=$version?>" <?=($login==$password?"":"Disabled")?>></input>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<textarea name="hymn_content" id="hymn_content" placeholder="歌詞" onkeyup="updatePreview()" onblur="updatePreview()" <?=($login==$password?"":"Disabled")?>></textarea>
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<textarea name="hymn_content_en" id="hymn_content_en" placeholder="Lyrics" onkeyup="updatePreview()" onblur="updatePreview()"></textarea>
		</td>
	</tr>
	<tr>
		<td colspan="2" style="border: solid 1px #777777;">
			&nbsp;
			<div id="preview">
			</div>
			&nbsp;
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<div style="display: inline-block; width:45%;"><button type="submit" data-theme="d" onClick="resetForm();">Cancel</button></div>
			<div style="display: inline-block; width:45%;"><button type="submit" data-theme="b" onClick="submitHymn();">Submit</button></div>
		</td>
	</tr>
</table>
</div>
</body>
</html>
<?php
	
	}else{
	}
} catch (Exception $e) {
}
?>