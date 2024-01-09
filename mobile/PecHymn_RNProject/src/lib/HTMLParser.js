export function HTMLParser(htmlStr) {    
  if(htmlStr==undefined) return "";
  var resultStr = htmlStr;
  resultStr = resultStr.replace(new RegExp('<br>', 'g'), "\n");
  resultStr = resultStr.replace(new RegExp('<br/>', 'g'), "\n");
  resultStr = resultStr.replace(new RegExp('<br />', 'g'), "\n");
  resultStr = resultStr.replace(new RegExp('&#34;', 'g'), '"');
  return resultStr;  
}

