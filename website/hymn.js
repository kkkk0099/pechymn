(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

	version_type = "Web";
	version_num = "2.2";
	version = "Version " + version_num;
	hymn_header = "hymn_a";
	
	var domain_prefix = "http://www.pechymn.com/";
	
	var isAdmin = false;
	
	var hymn_id = "";
	var title = "";
	var number = "";
	var history_prefix = "history_";
	var history_max = 8;
	var bookmark_prefix = "bookmark_";
	var bookmark_max = 20;
	var curr_lang = "big5";
	var result_num = 0;
	
	var split_mode = true;
	var split_mode_validScreen = true;
	
	var swapper = [
					["你","祢"]
					,["他","祂"]
					,["膽","胆"]
					,["群","羣"]
					,["擧","舉"]
					,["并","並"]
					,["嘗","嚐"]
					,["床","牀"]
					,["挂","掛"]
					,["滙","匯"]
					,["蹤","踪"]
				  ];
	
	$(document).ready(function() {
		//---Remove ads---
		$('div.ui-loader').remove();
		$('div.bModal').remove();
		$('div.popup').remove();
		//----------------

		$('body').addClass(version_type);

		$('#pl_main_body').show();



		if(version_type.toUpperCase() != "WEB"){ refreshOTAContent(); }
		init_page();
		if(version_type.toUpperCase() != "WEB"){ OTAUpdate(); }

	});

	function init_page()
	{
		if(version_type.toUpperCase() == "WEB"){
			if(get_url_param("id")=="admin")
			{
				isAdmin = true;
			}
			
			// Check if a new cache is available on page load.
			if(window.applicationCache)
			{
				
				window.applicationCache.addEventListener('updateready', function(e) {
					if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
					  window.applicationCache.swapCache();
						alert(convertTXT('版本更新完成'));
						window.location.reload();
					} else {
					}
				}, false);
				  
				  
				window.applicationCache.addEventListener(
						'cached',
						function(){
							setCookie('cache_status','1');
				}, false);

			}
		}
		
		
		//---Get setting----
		if(getCookie("search_text")!=null)
		{
		   $('#txt_search').val(getCookie("search_text"));
		}

	   if(getCookie("hymntype")!=null)
	   {
		   hymn_header = getCookie("hymntype");
	   }
		

		var selHymn_id = getCookie("selHymn_id");
		var selHymn_yPos = getCookie("selHymn_yPos");


		loadSetting();
		swapHymn(hymn_header);

		$('#div_version').html(convertTXT('平安詩集 (' + version_type + '版)<br/>' + version));
		updateHymnFont();
		changeSplitMode(split_mode && split_mode_validScreen);

		
		if(selHymn_id!=null && selHymn_id!="")
		{
		   //onClickTitle(selHymn_yPos,selHymn_id);
		}
		
	   if(getCookie("GBBig5")!=null)
	   {
		   changeGBBig5(getCookie("GBBig5"));
	   }
	   else
	   {
		   changeGBBig5('big5');
	   }
	   
		
		//----Bind Text Search Event---
		$('#txt_search').bind('keypress', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			 if(code == 13) { //Enter keycode
				if(version_type.toUpperCase() == 'ANDROID') onSearch();
				$('#txt_search').blur();
				//$('#btn_setting').focus();
			 }
		});

		try
		{
			if(!isAdmin) $.getJSON(domain_prefix + "visit.php?t=" + version_type + "&v=" + version);
		}
		catch (err)
		{
		}


	}
	
	$( window ).resize(function()  {
		updateHymnFont();
		updateSplitMode(false);
	});
	
	function updateHymnFont(){
		if($( window ).width()>550){
			$('#hymn_font1').text(convertTXT('平安詩集'));
			$('#hymn_font2').text(convertTXT('敬拜頌歌'));
			$('#hymn_font3').text(convertTXT('詩歌集'));
			$('.hymntype').css('width','115px');
		}else{
			$('#hymn_font1').text(convertTXT('平'));
			$('#hymn_font2').text(convertTXT('敬'));
			$('#hymn_font3').text(convertTXT('詩'));
			$('.hymntype').css('width','30px');
		}
	}
	
	function updateSplitMode(enforce_update){
        try{
            if($( window ).width()<900){
                //---If no change----
                if(!enforce_update && split_mode_validScreen==false) return;
                
                split_mode_validScreen = false;
                $('#setting_split_mode').hide();
                $('#div_title').css('width','');
                $('#div_title').css('height','');
                if(split_mode){
                    $('#div_content').show();
                    $('#div_title').hide();
                }else{
                    //$('#div_content').show();
                    //$('#div_title').hide();
                }
                $('#div_title').css('float','');
                $('#div_content').css('width','');
                $('#div_content').css('height','');
                $('#div_content').css('float','');
                $('.hide_on_splitmode').show();
            }else{
                $('#setting_split_mode').show();
                
                if(split_mode){
                    //---If no change----
                    if(!enforce_update && split_mode_validScreen && split_mode) return;
                    split_mode_validScreen = true;
                    
                    $('#div_content').show();
                    $('#div_title').show();
                    $('#div_title').css('width','40%');
                    $('#div_title').css('height',$(window).height()-115);
                    $('#div_title').css('float','left');
                    $('#div_content').css('width','60%');
                    $('#div_content').css('height',$(window).height()-115);
                    $('#div_content').css('float','left');
                    $('.hide_on_splitmode').hide();
                    
                    var tmp_id = $('#div_title tr.tr_resultlist').first().attr('uid');
                    if(hymn_id!="") tmp_id = hymn_id;
                    if(tmp_id!=undefined) onClickTitle(0, tmp_id, false);
                }else{
                    //---If no change----
                    if(!enforce_update && split_mode_validScreen && !split_mode) return;
                    split_mode_validScreen = true;
                    if(enforce_update) $('#div_content').hide();
                    
                    $('#div_title').css('width','');
                    $('#div_title').css('height','');
                    $('#div_title').css('float','');
                    $('#div_content').css('width','');
                    $('#div_content').css('height','');
                    $('#div_content').css('float','');
                    $('.hide_on_splitmode').show();
                }
            }
        }catch(err){}
	}
	
	function loadSetting()
	{
	   if(getCookie("fontsize")!=null)
	   {
		   changeFontSize(parseInt(getCookie("fontsize")));
	   }
	   else
	   {
			if(!jQuery.browser.mobile)
			{
				changeFontSize(32);
			}else{
				changeFontSize(18);
			}
	   }
	   if(getCookie("fontweight")!=null)
	   {
		changeFontWeight(getCookie("fontweight"));
	   }
	   else
	   {
		changeFontWeight("bold");
	   }
	   if(getCookie("bgcolor")!=null && getCookie("fontcolor")!=null && getCookie("bordercolor")!=null)
	   {
		   changeColor(getCookie("bgcolor"),getCookie("fontcolor"),getCookie("bordercolor"));
	   }
	   else
	   {
		   changeColor('#FFFFDD','#743A00','#F90');swapSetting(false);
	   }
	   if(getCookie("BarPosition")!=null)
	   {
		   changeBarPosition(getCookie("BarPosition"));
	   }
	   else
	   {
		   changeBarPosition('bottom');
	   }
	   if(getCookie("split_mode")!=null)
	   {
		   split_mode = (getCookie("split_mode")==1? true: false);
	   }
	}
	
	function loadHistory()
	{
		var i;
		var content = "";
		for(i=1;i<=history_max;i++){
			if(hasValue(getCookie(history_prefix+"header"+i)) && hasValue(getCookie(history_prefix+"id"+i))){
				var tmp_hymn_data = func_getHymnData(getCookie(history_prefix+"header"+i));
				var title = tmp_hymn_data[getCookie(history_prefix+"header"+i) + "_" + getCookie(history_prefix+"id"+i)][0];
				content += '<tr><td class="bookmark_td" onClick="gotoSong(\'' + getCookie(history_prefix+"header"+i) + '\',\'' + getCookie(history_prefix+"id"+i) + '\');">(' + getHymnTypeNameByType(getCookie(history_prefix+"header"+i)) + ')&nbsp;&nbsp; ' + getCookie(history_prefix+"id"+i) + '. ' + title + '</td><td class="bookmark_td" style="width:30px"><a href="javascript:clickDeleteHistory(' + i + ');" style="font-size:20px">X</a></td></tr>';
			}
		}
		
		if(content!=""){
			$('#div_history').show();
			content = '<table style="width:100%" style="text-align:left;">' + content + '</table>';
			$('#div_history_content').html(content);
		}else{
			$('#div_history').hide();
		}
	}
	
	function loadBookmark()
	{
		var i;
		var content = "";
		for(i=1;i<=bookmark_max;i++){
			if(hasValue(getCookie(bookmark_prefix+"header"+i)) && hasValue(getCookie(bookmark_prefix+"id"+i))){
				var tmp_hymn_data = func_getHymnData(getCookie(bookmark_prefix+"header"+i));
				var title = tmp_hymn_data[getCookie(bookmark_prefix+"header"+i) + "_" + getCookie(bookmark_prefix+"id"+i)][0];
				content += '<tr><td class="bookmark_td" onClick="gotoSong(\'' + getCookie(bookmark_prefix+"header"+i) + '\',\'' + getCookie(bookmark_prefix+"id"+i) + '\');">(' + getHymnTypeNameByType(getCookie(bookmark_prefix+"header"+i)) + ')&nbsp;&nbsp; ' + getCookie(bookmark_prefix+"id"+i) + '. ' + title + '</td><td class="bookmark_td" style="width:30px"><a href="javascript:clickDeleteBookmark(' + i + ');" style="font-size:20px">X</a></td></tr>';
			}
		}
		
		if(content!=""){
			$('#div_bookmark').show();
			content = '<table style="width:100%" style="text-align:left;">' + content + '</table>';
			$('#div_bookmark_content').html(content);
		}else{
			$('#div_bookmark').hide();
		}
	}

	function func_getHymnData(sel_header){
		var tmp_header = sel_header;
		if (sel_header === undefined) tmp_header = hymn_header;
		if(tmp_header=='hymn_a') return hymn_a_data;
		if(tmp_header=='hymn_b') return hymn_b_data;
		if(tmp_header=='hymn_c') return hymn_c_data;
	}
	
	function clickDeleteHistory(row_num)
	{
		if(confirm(convertTXT("要刪除這個記錄嗎?"))){
			delHistory(row_num);
			loadHistory();
			loadSetting();
		}
	}
	
	function clickDeleteBookmark(row_num)
	{
		if(confirm(convertTXT("要刪除這個記錄嗎?"))){
			delBookmark(row_num);
			loadBookmark();
			loadSetting();
		}
	}
	
	
	function swapHymn(name, needClickAction)
	{
		if(needClickAction===undefined) needClickAction = true;
		if(needClickAction==true) $('#txt_search').val('');
		$('.hymn_group').hide();
		$('#'+name+'_group').show();
		
		$('.hymntype').css('background-color','#CCC');
		$('.hymntype').css('border-color','#666');
		$('.hymntype').css('-webkit-animation-name','none');
		
		$('.hymntype.' + name).css('background-color','#FFC');
		$('.hymntype.' + name).css('border-color','#F90');
		$('.hymntype.' + name).css('-webkit-animation-name','yellowPulse');
		
		hymn_header = name;
		if(needClickAction==true) onGroupClick(1);
		
		setCookie('hymntype', name);
	}
	
	function swapSetting(showSetting)
	{
		$('body').scrollTop(0);
		if(!showSetting)
		{
			$('#pl_setting').fadeOut();
			$('#pl_bookmark').hide();
			$('#pl_main_body').fadeIn();
		}
		else
		{
			$('#pl_setting').fadeIn();
			$('#pl_bookmark').hide();
			$('#pl_main_body').fadeOut();
		}
	}
	
	function swapBookmark(showBookmark)
	{
		$('body').scrollTop(0);
		if(!showBookmark)
		{
			$('#pl_setting').hide();
			$('#pl_bookmark').fadeOut();
			$('#pl_main_body').fadeIn();
		}
		else
		{
			loadHistory();
			loadBookmark();
			loadSetting();
			
			$('#pl_setting').hide();
			$('#pl_bookmark').fadeIn();
			$('#pl_main_body').fadeOut();
		}
	}
	
	function gotoSong(hymn_type, song_id)
	{
		swapBookmark(false);
		swapHymn(hymn_type);
		$('#txt_search').val(song_id);
		onSearch(false);
	}
	
	
	function changeFontSize(number)
	{
		$('.main_body:not(.skipSetting)').css('font-size',number);
		$('.history_div').css('font-size',number);
		
		
		$('.font_option').css('background-color','#CCC');
		$('.font_option').css('border-color','#666');
		$('.font_option').css('-webkit-animation-name','none');
		
		$('.font_option.font' + number).css('background-color','#FFC');
		$('.font_option.font' + number).css('border-color','#F90');
		$('.font_option.font' + number).css('-webkit-animation-name','yellowPulse');
		
		setCookie('fontsize', number);
	}

	function changeFontWeight(style)
	{
		$('#div_content_body').css('font-weight',style);
		

		$('.font_weight').css('background-color','#CCC');
		$('.font_weight').css('border-color','#666');
		$('.font_weight').css('-webkit-animation-name','none');
		
		$('.font_weight.' + style).css('background-color','#FFC');
		$('.font_weight.' + style).css('border-color','#F90');
		$('.font_weight.' + style).css('-webkit-animation-name','yellowPulse');

		setCookie('fontweight', style);
	}
	
	function changeColor(bg, font, border)
	{
		$('.main_body, body, .ui-body-c, .ui-dialog.ui-overlay-c, .ui-bar-a:not(.skipSetting)').css('background-color',bg);
		$('.main_body, body, a:not(.skipSetting), .ui-body-c, .ui-dialog.ui-overlay-c').css('color',font);
		$('.setting_td, .title_list, .title_list_td, .bookmark_td').css('border-color',border);

		$('.ui-input-search, #txt_search').css('background-color','#FFFFFF');
		$('.ui-input-search, #txt_search').css('color','#555555');
		
		
		setCookie("bgcolor", bg);
		setCookie("fontcolor", font);
		setCookie("bordercolor", border);
	}
	
	function changeBarPosition(position)
	{
		$('#div_toolbar').removeClass('fixbottom');
		$('#div_toolbar').removeClass('fixtop');
		$('#div_toolbar').addClass('fix' + position);
		$('#topPadding').height(5);
		$('#bottomPadding').height(5);
		$('#' + position + 'Padding').height(60);
		$('#tblToolbar').removeClass('tblToolbar_top');
		$('#tblToolbar').removeClass('tblToolbar_bottom');
		$('#tblToolbar').addClass('tblToolbar_' + position);

		
		
		$('.bar_option').css('background-color','#CCC');
		$('.bar_option').css('border-color','#666');
		$('.bar_option').css('-webkit-animation-name','none');
		
		$('.bar_option.' + position).css('background-color','#FFC');
		$('.bar_option.' + position).css('border-color','#F90');
		$('.bar_option.' + position).css('-webkit-animation-name','yellowPulse');
		
		setCookie('BarPosition', position);
	}
	
	function changeSplitMode(on_off)
	{
		split_mode = on_off;
		updateSplitMode(true);
		
		
		$('.split_mode_option').css('background-color','#CCC');
		$('.split_mode_option').css('border-color','#666');
		$('.split_mode_option').css('-webkit-animation-name','none');
		
		$('.split_mode_option.' + (on_off?'on':'off')).css('background-color','#FFC');
		$('.split_mode_option.' + (on_off?'on':'off')).css('border-color','#F90');
		$('.split_mode_option.' + (on_off?'on':'off')).css('-webkit-animation-name','yellowPulse');
		
		setCookie("split_mode", (on_off?1:0));
	}
	
	function changeGBBig5(lang)
	{
		if(lang!="gb") lang="big5";
		
		if(curr_lang!=lang)
		{
			for(var i in hymn_a_data){
				for(var j in hymn_a_data[i]){
					hymn_a_data[i][j] = convertText(hymn_a_data[i][j], lang);
				}
			}
			
			for(var i in hymn_b_data){
				for(var j in hymn_b_data[i]){
					hymn_b_data[i][j] = convertText(hymn_b_data[i][j], lang);
				}
			}
			for(var i in hymn_c_data){
				for(var j in hymn_c_data[i]){
					hymn_c_data[i][j] = convertText(hymn_c_data[i][j], lang);
				}
			}
			
			TSC(lang);
			
			curr_lang=lang;
		}
		
		
		
		$('.lang_option').css('background-color','#CCC');
		$('.lang_option').css('border-color','#666');
		$('.lang_option').css('-webkit-animation-name','none');
		
		$('.lang_option.' + lang).css('background-color','#FFC');
		$('.lang_option.' + lang).css('border-color','#F90');
		$('.lang_option.' + lang).css('-webkit-animation-name','yellowPulse');
		
		$('#txt_search').attr('placeholder', convertText($('#txt_search').attr('placeholder'), lang));
		$('#img_Bookmark').attr('src', (lang=='gb'?'images/my_bookmark_gb.png':'images/my_bookmark.png'));
		
		swapHymn(hymn_header);
		
		setCookie('GBBig5', lang);
	}
	
	function convertTXT(txt){
		var lang = getCookie("GBBig5");
		if(lang==null) lang = 'big5';
		
		return convertText(txt, lang);
	}
	
	//----Start Animation----
	function showTitle(gotoTop)
	{
		if(gotoTop)
		{
			$('body').scrollTop(0);
		}
		$('#div_content').hide().trigger( 'updatelayout' );
		$('#div_title').show().trigger( 'updatelayout' );
	}
	
	function showContent()
	{
		if(split_mode && split_mode_validScreen)
		{
			$('#div_content').scrollTop(0);
		}
		else
		{
			if(jQuery.browser.mobile)
			{
				//$('body').scrollTop(50);
				$('body').scrollTop(0);
			}else{
				$('body').scrollTop(0);
			}
		}
		
		if(!split_mode || !split_mode_validScreen)
			$('#div_title').hide().trigger( 'updatelayout' );
			
		$('#div_content').show().trigger( 'updatelayout' );
	}
	//----End Animation----
	
	
	function onGroupClick(isShow)
	{
		$('body').scrollTop(0);
		if($('#div_group').is(':hidden') || isShow==1)
		{
			$('#div_group').show();
			$('#div_data_body').hide();
			
			if(hymn_header == "hymn_c") onGroupSearch('');
		}
		else
		{
			$('#div_group').hide();
			$('#div_data_body').show();
		}
		
	}
	
	function onGroupSearch(txtSearch)
	{
		$('#txt_search').val(txtSearch);
		onGroupClick();
		onSearch(true);
	}

	function onClickReportErr()
	{
		var err_detail = prompt(convertTXT("請填寫問題或建議事項:\n" + number + ". " + title), convertTXT("歌詞錯誤"));
		if(err_detail!=null && err_detail!="")
		{
			try
			{
				$.ajax({
				  type:     "GET",
				  url:      domain_prefix + "report_err.php",
				  data: 	"id=" + hymn_id + "&msg=" + encodeURI(version_type + ' ' + version +  ' : ' + err_detail).replace("&","%26"),
				  dataType: "jsonp",
				  success: function(data){
					alert(convertTXT("感謝您回報問題，我們會盡快檢查及改善。"));
				  },
				  error: function(jqXHR, textStatus , errorThrown ){
					alert(convertTXT("回報未能完成。\n請檢查您的網絡連線是否正常。"));
				  }
				});
			}
			catch (err)
			{
			}
		}
	}

	function clickSetBookmark()
	{
		if(confirm(convertTXT('要加到我的書籤嗎?'))){
			setBookmark(hymn_id);
		}
	}
	
	function onSearchAgainClick()
	{
		if(!jQuery.browser.mobile)
		{
			$('body').scrollTop(0);
		}
		$('#txt_search').val('');
		$('#txt_search').focus();
	}
	
	function onSearch(searchEmpty)
	{
		if(searchEmpty===undefined) searchEmpty=false;
		if(searchEmpty || $('#txt_search').val()!="")
		{
			$('#div_group').hide();
			$('#div_data_body').show();
			
			var i = 0;
			var tmp_id = "";
            var tmp_hymn_header = hymn_header;
			$('#div_title').html('');
			
			//if($('#txt_search').val()!=""){
				if($('#txt_search').val().match(/\d{1,3}[A-Za-z]{0,1}/)){
					var tmp_hymn_data = func_getHymnData();

					$.each( tmp_hymn_data, function( key, value ) {
						if(searchHymnByID(key, $('#txt_search').val(), tmp_hymn_data, false)){
							i+=1;
							if(i==1) tmp_id = key;
						}
					});
				}else if($('#txt_search').val()==''){
					$.each([hymn_header], function( index, value ) {
						var tmp_hymn_data = func_getHymnData(value);
						$.each( tmp_hymn_data, function( key, value ) {
							if(searchHymnByID(key, $('#txt_search').val(), tmp_hymn_data, true)){
								i+=1;
								if(i==1) tmp_id = key;
							}
						});
					});
				}else{
					$.each(['hymn_a','hymn_b','hymn_c'], function( index, value ) {
						var tmp_hymn_data = func_getHymnData(value);
						$.each( tmp_hymn_data, function( key, data_value ) {
							if(searchHymnByID(key, $('#txt_search').val(), tmp_hymn_data, true)){
								i+=1;
                               if(i==1){tmp_id = key; tmp_hymn_header=value;}
							}
						});
					});
				}
				
				$('#div_title').html('<table class="title_list">' + $('#div_title').html() + '</table>');
			//}
			//else{
			//	$('#div_title').html($('#cache_'+hymn_header).html());
			//}
			
			showTitle(true);
			
			loadSetting();
			
			setCookie("search_text", $('#txt_search').val());
			setCookie("selHymn_id", "");
			setCookie("selHymn_yPos", "");
			
			var needSetHistory = true;
			if(arguments.length == 1) needSetHistory = arguments[0];
            
            result_num = i;

			if(split_mode && split_mode_validScreen){
				$('#div_title').scrollTop(0);
                if(hymn_header != tmp_hymn_header){
                    hymn_header = tmp_hymn_header;
                    swapHymn(tmp_hymn_header,false);
                }
				onClickTitle(0, tmp_id, needSetHistory);
			}else{
                if(i==1) {
                    if(hymn_header != tmp_hymn_header){
                        hymn_header = tmp_hymn_header;
                        swapHymn(tmp_hymn_header,false);
                    }
                    onClickTitle(0, tmp_id, needSetHistory);
                }
			}
		}
	}
	
	function onClickTitle(yPos, id)
	{
		var tmp_hymn_data = func_getHymnData();

		hymn_id = id;
		title = tmp_hymn_data[id][0];
		number = tmp_hymn_data[id][1];
		var content = tmp_hymn_data[id][2]; 
		
		$('.cls_btn_back').attr('href','javascript:onClickBack(' + yPos + ');');
		
		$('#div_content_body').html('<table border="0" padding="0" margin="0" width="100%"><tr><td><table border=0 style="margin: 0 auto;"><tr><td style="width:130px;">' + getPrevSongButton(id, yPos) + '</td><td>' + getMIDIButton(id) + '' + getMP3Button(id) + '</td><td style="width:130px;">' + getNextSongButton(id, yPos) + '</td></tr></table><br/><u><b>' + number + '. &nbsp; ' + title + '</b></u></td></tr><tr><td>' + content + '</td></tr></table>');
		
		showContent();


		setCookie("selHymn_id", id);
		setCookie("selHymn_yPos", yPos);
		
		var needSetHistory = true;
		if(arguments.length == 3) needSetHistory = arguments[2];
		if(needSetHistory) setHistory(id);
		
		try
		{
			if(!isAdmin) $.getJSON(domain_prefix + "sel_song.php?id=" + id);
		}
		catch (err)
		{
		}
	}
	
	
	function onClickBack(y_pos)
	{
        if(result_num <=1){
            swapHymn(hymn_header);
        }else{
            showTitle(false);
            setCookie("selHymn_id", "");
            setCookie("selHymn_yPos", "");
		
            $('body').scrollTop(y_pos);
        }
	}
	
	function searchHymnByID(id, search_content, tmp_hymn_data, isSearchAll)
	{

		var title = tmp_hymn_data[id][0];
		var number = tmp_hymn_data[id][1];
		var content = tmp_hymn_data[id][2];
		
		if(checkIsMatch(search_content, title, content, number))
		{
			//---Title---
			if(isSearchAll){
				var tmp_hymn_type = getHymnTypeByUid(id);
				
				$('#div_title').append('<tr class="tr_resultlist" id="tr_resultlist_' + id + '" uid="' + id + '"><td class="title_list_td">  <a href="javascript:#;" onclick="swapHymn(\'' + tmp_hymn_type + '\',false); onClickTitle(getY(this), \'' + id + '\');"><table border="0" padding="0" margin="0" width="100%"><tr><td class="title_list_td_inner">(' + getHymnTypeNameByType(tmp_hymn_type) + ')&nbsp;&nbsp;' + number + '</td><td>' + title + '</td></tr></table></a>  </td></tr>');
			}else{
				$('#div_title').append('<tr class="tr_resultlist" id="tr_resultlist_' + id + '" uid="' + id + '"><td class="title_list_td">  <a href="javascript:#;" onclick="onClickTitle(getY(this), \'' + id + '\');"><table border="0" padding="0" margin="0" width="100%"><tr><td class="title_list_td_inner">' + number + '</td><td>' + title + '</td></tr></table></a>  </td></tr>');
			}
			
			return true;
		}
		else
		{
			return false;
		}
	}
	
	function checkIsMatch(search_content, title, content, number)
	{
		var i = 0;
		var search_content_trim = $.trim(search_content);
		
		if(search_content_trim == "")
		{
			return true;
		}
		else if(search_content_trim.match(/^\d{1,3}\-\d{1,3}$/))
		{
			var tmp_i = 0;
			var first_num = parseInt((search_content_trim.split("-"))[0]);
			var last_num = parseInt((search_content_trim.split("-"))[1]);
			for(tmp_i = first_num; tmp_i<=last_num; tmp_i++)
			{
				if(number == tmp_i || number == padLeft(tmp_i, 3) )
				{
					return true;
				}
				else if (number.match(/\d{1,3}[A-Za-z]{1}/) && number.substr(0,number.length-1)==padLeft(tmp_i, 3))
				{
					return true;
				}
			}
			return false;
		}
		else if(search_content_trim.match(/\d{1,3}[A-Za-z]{1}/))
		{
			if(number == search_content_trim.toLowerCase() || number == padLeft(search_content_trim, 4).toLowerCase() )
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else if(search_content_trim.match(/\d{1,3}/))
		{
			if(number == search_content_trim || number == padLeft(search_content_trim, 3) )
			{
				return true;
			}
			else if (number.match(/\d{1,3}[A-Za-z]{1}/) && number.substr(0,number.length-1)==padLeft(search_content_trim, 3))
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		
		var tmp_search = '';
		var tmpMatch = true;
		var search_arr = search_content_trim.split(' ');
		
		for(i=0;i<search_arr.length;i++)
		{
			tmp_search = $.trim(search_arr[i]);
			var tmp_search_regx = convertSearchRegx(tmp_search);
			if(tmp_search == "")
			{
			}
			else if(number.indexOf(tmp_search) >= 0){
			}
			else if(title.match('(' + tmp_search_regx + ')')){
			}
			else
			{
				content = content.replace(/\./g,"");
				content = content.replace(/\,/g,"");
				content = content.replace(/ /g,"");
				content = content.replace(/，/g,"");
				if(content.match('(' + tmp_search_regx + ')')){
				}
				else{
					tmpMatch = false;
					break;
				}
			}
		}
		return tmpMatch;
	}
	
	//---Other function---
	function setBookmark(id)
	{
		var i;
		var existID = false;
		for(i=1;i<=bookmark_max;i++){
			if(hasValue(getCookie(bookmark_prefix+"header"+i)) && hasValue(getCookie(bookmark_prefix+"id"+i))){
				if(getCookie(bookmark_prefix+"header"+i)==hymn_header && getCookie(bookmark_prefix+"id"+i)==id.replace(hymn_header+"_","")){
					existID = true;
					break;
				}
			}
		}

		if(existID){
			delBookmark(i);
			setBookmark(id);
		}else{
			for(i=bookmark_max-1;i>0;i--){
				if(hasValue(getCookie(bookmark_prefix+"header"+i)) && hasValue(getCookie(bookmark_prefix+"id"+i))){
					setCookie( bookmark_prefix+"header"+(i+1), getCookie(bookmark_prefix+"header"+i) );
					setCookie( bookmark_prefix+"id"+(i+1), getCookie(bookmark_prefix+"id"+i) );
				}
			}
			setCookie( bookmark_prefix+"header1", hymn_header );
			setCookie( bookmark_prefix+"id1", id.replace(hymn_header+"_","") );
		}
	}
	
	function delBookmark(row_num)
	{
		var i;
		for(i=row_num;i<bookmark_max;i++){
			if(hasValue(getCookie(bookmark_prefix+"header"+i)) && hasValue(getCookie(bookmark_prefix+"id"+i))){
				if(hasValue(getCookie(bookmark_prefix+"header"+(i+1))) && hasValue(getCookie(bookmark_prefix+"id"+(i+1)))){
					setCookie( bookmark_prefix+"header"+i, getCookie(bookmark_prefix+"header"+(i+1)) );
					setCookie( bookmark_prefix+"id"+i, getCookie(bookmark_prefix+"id"+(i+1)) );
				}else{
					setCookie( bookmark_prefix+"header"+i, "" );
					setCookie( bookmark_prefix+"id"+i, "" );
				}
			}
		}
		setCookie( bookmark_prefix+"header"+bookmark_max, "" );
		setCookie( bookmark_prefix+"id"+bookmark_max, "" );
	}

	function setHistory(id)
	{
		var i;
		var existID = false;
		for(i=1;i<=history_max;i++){
			if(hasValue(getCookie(history_prefix+"header"+i)) && hasValue(getCookie(history_prefix+"id"+i))){
				if(getCookie(history_prefix+"header"+i)==hymn_header && getCookie(history_prefix+"id"+i)==id.replace(hymn_header+"_","")){
					existID = true;
					break;
				}
			}
		}

		if(existID){
			delHistory(i);
			setHistory(id);
		}else{
			for(i=history_max-1;i>0;i--){
				if(hasValue(getCookie(history_prefix+"header"+i)) && hasValue(getCookie(history_prefix+"id"+i))){
					setCookie( history_prefix+"header"+(i+1), getCookie(history_prefix+"header"+i) );
					setCookie( history_prefix+"id"+(i+1), getCookie(history_prefix+"id"+i) );
				}
			}
			setCookie( history_prefix+"header1", hymn_header );
			setCookie( history_prefix+"id1", id.replace(hymn_header+"_","") );
		}
	}
	
	function delHistory(row_num)
	{
		var i;
		for(i=row_num;i<history_max;i++){
			if(hasValue(getCookie(history_prefix+"header"+i)) && hasValue(getCookie(history_prefix+"id"+i))){
				if(hasValue(getCookie(history_prefix+"header"+(i+1))) && hasValue(getCookie(history_prefix+"id"+(i+1)))){
					setCookie( history_prefix+"header"+i, getCookie(history_prefix+"header"+(i+1)) );
					setCookie( history_prefix+"id"+i, getCookie(history_prefix+"id"+(i+1)) );
				}else{
					setCookie( history_prefix+"header"+i, "" );
					setCookie( history_prefix+"id"+i, "" );
				}
			}
		}
		setCookie( history_prefix+"header"+history_max, "" );
		setCookie( history_prefix+"id"+history_max, "" );
	}
	
	function getPrevSongButton(id, pos)
	{
		var result = '';
		if($('.tr_resultlist').length>0){
			var tmp_hymn_data;
			
			var tmp_hymn_type;
			var prev_song;
			var prev_song_id = '';
			var prev_song_number = '';
			try{
				if($('.tr_resultlist').length==1 && $('#txt_search').val().match(/\d{1,3}[A-Za-z]{0,1}/)){
					tmp_hymn_type = getHymnTypeByUid(id);
					var num = id.replace(tmp_hymn_type + "_", '');
					num = parseInt(num) - 1;
					if(num>0){
						tmp_hymn_data = func_getHymnData(tmp_hymn_type);
						prev_song_id = tmp_hymn_type + "_" + num;
						if(tmp_hymn_data[prev_song_id]==undefined) prev_song_id = prev_song_id + "b";	//for hymn_c special case
						prev_song_number = tmp_hymn_data[prev_song_id][1];
					}
				}else{
					prev_song = $('#tr_resultlist_'+id).prev('.tr_resultlist');
					if(prev_song.attr('uid')!==undefined){
						prev_song_id = prev_song.attr('uid');
						tmp_hymn_type = getHymnTypeByUid(prev_song_id);
						tmp_hymn_data = func_getHymnData(tmp_hymn_type);
						prev_song_number = tmp_hymn_data[prev_song_id][1];
					}
				}
			}catch(ex){
				prev_song_id = "";
			}
			
			if(prev_song_id!="")
				result = '<a href="javascript:#;" onClick="swapHymn(\'' + tmp_hymn_type + '\',false); onClickTitle(' + pos + ', \'' + prev_song_id + '\', false);"><font class="prev_next_btn prev_btn">&nbsp;&nbsp;&nbsp;' + getHymnTypeNameByType(tmp_hymn_type) + prev_song_number + '&nbsp;</font></a>';
		}
		return result;
	}
	
	function getNextSongButton(id, pos)
	{
		var result = '';
		if($('.tr_resultlist').length>0){
			var tmp_hymn_data;
			
			var tmp_hymn_type;
			var prev_song;
			var prev_song_id = '';
			var prev_song_number = '';
			try{
				if($('.tr_resultlist').length==1 && $('#txt_search').val().match(/\d{1,3}[A-Za-z]{0,1}/)){
					tmp_hymn_type = getHymnTypeByUid(id);
					var num = id.replace(tmp_hymn_type + "_", '');
					num = parseInt(num) + 1;
					if(num>0){
						tmp_hymn_data = func_getHymnData(tmp_hymn_type);
						prev_song_id = tmp_hymn_type + "_" + num;
						if(tmp_hymn_data[prev_song_id]==undefined) prev_song_id = prev_song_id + "a";	//for hymn_c special case
						prev_song_number = tmp_hymn_data[prev_song_id][1];
					}
				}else{
					prev_song = $('#tr_resultlist_'+id).next('.tr_resultlist');
					if(prev_song.attr('uid')!==undefined){
						prev_song_id = prev_song.attr('uid');
						tmp_hymn_type = getHymnTypeByUid(prev_song_id);
						tmp_hymn_data = func_getHymnData(tmp_hymn_type);
						prev_song_number = tmp_hymn_data[prev_song_id][1];
					}
				}
			}catch(ex){
				prev_song_id = "";
			}
			
			if(prev_song_id!="")
				result = '<a href="javascript:#;" onClick="swapHymn(\'' + tmp_hymn_type + '\',false); onClickTitle(' + pos + ', \'' + prev_song_id + '\', false);"><font class="prev_next_btn next_btn">&nbsp;' + getHymnTypeNameByType(tmp_hymn_type) + prev_song_number + '&nbsp;&nbsp;&nbsp;</font></a>';
		}
		return result;
	}
	
	function getMIDIButton(id)
	{
		var tmp_hymn_data = func_getHymnData();

		var result = "";
		var url = "";
		var number = tmp_hymn_data[id][1];
		
		if(hymn_header == "hymn_a")
		{
			url = (version_type.toUpperCase() == "WEB"? domain_prefix: "") + 'midi/p' + number + ".mp3";
		}
		else if(hymn_header == "hymn_b")
		{
			url = (version_type.toUpperCase() == "WEB"? domain_prefix: "") + 'midi/w' + number + ".mp3";
		}
		
		if(url!="")
		{
			if(version_type.toUpperCase() == "IOS")
				result = '<div style="display:none;"><audio id="audio_midi" src="' + url + '"></audio></div><a target="_blank" href="javascript:pressAudioBtn(document.getElementById(\'audio_midi\'));"><img alt="MIDI" style="border:none;" width="60" src="images/midi.png" /></a>';
			else
				result = '<a target="_blank" href="' + url + '"><img alt="MIDI" style="border:none;" width="60" src="images/midi.png" /></a>';
		}
		return result;
	}
	
	function getMP3URL(id)
	{
		if(hymn_header == "hymn_a")
		{
			var tmp_hymn_data = func_getHymnData();
			var number = tmp_hymn_data[id][1];
			//number = parseInt(unpadLeft(number));
			//var url_low = Math.floor((number-1)/10) * 10 + 1;
			//var url_top = Math.floor((number-1)/10) * 10 + 10;
			//var url = 'http://www.ssppec-noah.org/Peace%20Psalms%20MP3/' + padLeft(url_low+'', 3) + "-" + padLeft(url_top+'' , 3) + "/" + $('#' + id).attr('number') + ".mp3";
			var url = 'mp3/' + number + ".mp3";
			return url;
		}
	}
	
	function getMP3Button(id)
	{
		var url = getMP3URL(id);
		var result = "";
		if(url!=null && id!='hymn_a_382')
		{
			//result = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="' + url + '"><img alt="MP3" style="border:none;" width="60" src="images/mp3.png" /></a>';
		}
		return result;
	}
	
	function replaceNewLine(myString) {
		var regX = /\r\n|\r|\n/g;
		var replaceString = '<br />';
		return myString.replace(regX, replaceString);	
	}
	
	function padLeft(str, lenght){
		if(str.length >= lenght)
			return str;
		else
			return padLeft("0" +str,lenght);
	}
	
	function unpadLeft(str){
		var new_str = str;
		while(new_str.substr(0,1)=='0')
		{
			new_str = new_str.substr(1);
		}
		return new_str;
	}
	
	function setCookie(c_name,value)
	{
		if(version_type.toUpperCase() == "WEB"){
			var exdays = 730;
			var exdate=new Date();
			exdate.setDate(exdate.getDate() + exdays);
			var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
			document.cookie=c_name + "=" + c_value;
		}else{
			localStorage.setItem(c_name, value);
		}
	}
	
	function getCookie(c_name)
	{
		if(version_type.toUpperCase() == "WEB"){
			var i,x,y,ARRcookies=document.cookie.split(";");
			for (i=0;i<ARRcookies.length;i++)
			{
				x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
				y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
				x=x.replace(/^\s+|\s+$/g,"");
				if (x==c_name){
					return unescape(y);
				}
			}
		}else{
			return localStorage.getItem(c_name);
		}
	}
	
	function getY( oElement )
	{
		var iReturnValue = 0;
		while( oElement != null ) {
		iReturnValue += oElement.offsetTop;
		oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
	
	function get_url_param(name)
	{  
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
		var regexS = "[\\?&]"+name+"=([^&#]*)";  
		var regex = new RegExp( regexS );  
		var results = regex.exec( window.location.href );  
		if( results == null )    return "";  
		else return results[1];
	} 
	
	function hasValue(obj)
	{
		if(obj!=undefined && obj!=""){
			return true;
		}else{
			return false;
		}
	}
	
	function getHymnTypeByUid(id){
		var tmp_hymn_type = "hymn_a";
		if(id.search("hymn_c")!==-1) tmp_hymn_type="hymn_c";
		if(id.search("hymn_b")!==-1) tmp_hymn_type="hymn_b";
		return tmp_hymn_type;
	}
	
	function getHymnTypeNameByType(tmp_hymn_type){
		var prev_song_head_name = convertTXT("平");
		if(tmp_hymn_type=='hymn_c') prev_song_head_name=convertTXT("詩");
		if(tmp_hymn_type=='hymn_b') prev_song_head_name=convertTXT("敬");
		return prev_song_head_name;
	}

	
	function convertSearchRegx(search_txt){
		var result = search_txt;
		for(i=0; i<swapper.length; i++){
			var regex;
			var replace_tag = "";
			for(j=0; j<swapper[i].length; j++){
				regex = new RegExp(''+swapper[i][j]+'', "igm");
				result = result.replace(regex, '‧' + i + '‧');
				replace_tag += (replace_tag==""?"":"|") + swapper[i][j]
			}
			replace_tag = "(" + replace_tag + ")";

			regex = new RegExp('‧'+ i +'‧', "igm");
			result = result.replace(regex, replace_tag);
		}
		return result;
	}




/*=====OTA Update Function=====*/

	function OTAUpdate(){
		try{
			//---For users who just update the App version---
			var OTA_version = getCookie("OTA_version");
			if(OTA_version==null || OTA_version=="") OTA_version = "0.0";
			if(version_num > OTA_version){
				setCookie('OTA_content','');
				setCookie('OTA_refreshDate','');
				setCookie('OTA_version',version_num);
            }
            var OTA_refreshDate = getCookie("OTA_refreshDate");
            if(OTA_refreshDate==null) OTA_refreshDate = "";
                              
			$.ajax({
				url: domain_prefix + "api_getUpdate.php",
				type: "GET",
				contentType: "application/json; charset=utf-8",
				data: { version: version_num, d: OTA_refreshDate }, 
				dataType: "jsonp",
				success: function (data) {
					try{
						if(data.d !== undefined){
							setCookie('OTA_content',JSON.stringify(data));
							setCookie('OTA_refreshDate',data.d);

							refreshOTAContent();
						}
					}catch(ex){
					}
				},
				error: function (jqXHR, textStatus , errorThrown ) { }
			}); 
		}catch(ex){
		}
	}

	function refreshOTAContent(){
		try{
			var OTA_content = getCookie("OTA_content");
			if(OTA_content!=""){
				var data = $.parseJSON(OTA_content);

				$.each(data.data, function(key, value){
				  if(key.indexOf("hymn_a_") >= 0){
					  hymn_a_data[key][0] = value[0];
					  hymn_a_data[key][2] = value[2];
				  }else if(key.indexOf("hymn_b_") >= 0){
					  hymn_b_data[key][0] = value[0];
					  hymn_b_data[key][2] = value[2];
				  }else if(key.indexOf("hymn_c_") >= 0){
					  hymn_c_data[key][0] = value[0];
					  hymn_c_data[key][2] = value[2];
				  }
				});
			}

		}catch(ex){
		}
	}

/*=====OTA Update Function=====*/



/*=====IOS function=====*/

	function pressAudioBtn(objAudio)
	{
		if(objAudio.paused){
			objAudio.play();
		}else{
			objAudio.pause();
			objAudio.currentTime = 0;
		}
	}
	
	if(version_type == "IOS"){
		confirm = function(msg) {
		  var tmpFrame = document.createElement('iframe');
		  tmpFrame.setAttribute('src', 'data:text/plain,');
		  document.documentElement.appendChild(tmpFrame);
		  var conf = window.frames[0].window.confirm(msg);
		  tmpFrame.parentNode.removeChild(tmpFrame);
		  return conf;
		};
		
		prompt = function(msg,val) {
		  var tmpFrame = document.createElement('iframe');
		  tmpFrame.setAttribute('src', 'data:text/plain,');
		  document.documentElement.appendChild(tmpFrame);
		  var conf = window.frames[0].window.prompt(msg,val);
		  tmpFrame.parentNode.removeChild(tmpFrame);
		  return conf;
		};
		
		alert = function(msg) {
		  var tmpFrame = document.createElement('iframe');
		  tmpFrame.setAttribute('src', 'data:text/plain,');
		  document.documentElement.appendChild(tmpFrame);
		  var conf = window.frames[0].window.alert(msg);
		  tmpFrame.parentNode.removeChild(tmpFrame);
		  return conf;
		};
	}

/*=====IOS function=====*/
