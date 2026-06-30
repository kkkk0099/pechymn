<p align="center">
	<h1 align="center">
		平安詩集/敬拜頌歌
	</h1>
	<br>
	網頁, 手機應用程式(React Native) 及 中/英歌詞的公開資源數據
</p>


## Statistic
/statistic : 平安詩集/敬拜頌歌的使用數據(數據至2023年)


## Lyrics
/lyrics : 中英文版歌詞 (JSON格式)
- hymn_a_lyrics.json : 平安詩集
- hymn_b_lyrics.json : 敬拜頌歌
- hymn_c_lyrics.json : 詩歌集


## Website
/website-v3 : 新版平安詩集靜態網站源始碼，使用 Astro 建構，可直接部署為靜態網站

Astro 版本: 6.x

- public/data : 預先生成的歌詞與索引 JSON
- src/pages : 網站頁面模板
- scripts/deploy-azure.sh : Azure Blob 靜態網站部署腳本



/website : 舊版平安詩集網頁版源始碼(v2)，包含後台php

PHP 版本: 5.x

- index.html : 主頁
- api_xxxxxx.php : 用於手機程式的接口
- db.php : mysql 連接文件
- DB資料更新管理頁面 : script_export.php, script_import.php, update_hymn.php, view_err.php


## Mobile App (React Native)
/mobile : 平安詩集手機應用程式版源始碼

React Native 版本: 0.57.8
