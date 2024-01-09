import {Platform, Dimensions} from 'react-native';

import { openDatabase, deleteDatabase } from 'react-native-sqlite-storage';

import Moment from 'moment';

const Constant = require('PecHymn_RNProject/src/data/constant');

import {numPad, trimNumPad, ToString, getRegHashToken, getSelSongHashToken, generateKey} from 'PecHymn_RNProject/src/lib/commonFunc';


var db = openDatabase({ name: "pechymn.sqlite" , createFromLocation: "~pechymn.sqlite" });
var db_pref = openDatabase({ name: "pechymn_pref.sqlite" , createFromLocation: "~pechymn_pref.sqlite" });


//---------------Internal functions---------------------------
function fixSQL(i){
  return i.replace(/\'\'/g, "'").replace(/\'/g, "''");
}

function sql_content_replace(field_name){
  return " REPLACE(REPLACE(REPLACE(REPLACE(" + field_name + ", ',' , ''), '.', ''), '，', ''), '　', '') ";
}

function search_char_swap(tmp_search){
  var result = "";
  result = tmp_search.trim();

  if(tmp_search!=""){
    for (let char_swapper of Constant.chars_swapper) {
      if(tmp_search.indexOf(char_swapper[0]) >-1){
        result = tmp_search.replace(new RegExp(char_swapper[0], 'g'), char_swapper[1]);
      }else if(tmp_search.indexOf(char_swapper[1]) >-1){
        result = tmp_search.replace(new RegExp(char_swapper[1], 'g'), char_swapper[0]);
      }
    }
  }

  return result;
}

//---------------Internal functions---------------------------



//---------------Initialization---------------------------

class DB_pechymn{
  //db = null;

  constructor() {
    this.delDB_success = this.delDB_success.bind(this);
    this.delDB_fail = this.delDB_fail.bind(this);
    this.openDB = this.openDB.bind(this);
    deleteDatabase({ name: "pechymn.sqlite"}, this.delDB_success, this.delDB_fail);
  }


  delDB_success() {
    console.log("Success del DB");
    this.openDB();
  }
  delDB_fail() {
    console.log("error del DB");
    this.openDB();
  }

  openDB(){
    console.log("Open DB");
    db = openDatabase({ name: "pechymn.sqlite" , createFromLocation: "~pechymn.sqlite" });
  }

  getDB(){
    return db;
  }
}


export async function initDB(){

  return await new Promise((resolve, reject) => {

    db_pref.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM preference",
        [],
        (tx, results) => {
  
          var len = results.rows.length;
          var initPref = {};

          for(let i=0; i<len; i++){
            initPref[results.rows.item(i).key] = results.rows.item(i).value;
          }
  
          if(initPref.version < Constant.version){
            var myDB = new DB_pechymn();
            //db = myDB.getDB();
  
            tx.executeSql(
              "UPDATE preference SET value='" + fixSQL(Constant.version) + "' WHERE key='version'",
              [],
              (tx, results) => {
                initPref.version = Constant.version;
                resolve({initPref});
              }
            );
          }else{
            resolve({initPref});
          }

        }, 
        (e) => {
          reject(e);
        }
      );
    });

  })
}




export async function api_regUser(pref){

  datetime = Moment().format("YYYYMMDDHHmmss");

  OS_type = Platform.OS + "," + Platform.Version + (Platform.isPad?",isPad":"");

  if(ToString(pref.user_id)=="") pref.user_id = "";
  if(ToString(pref.user_key)=="") pref.user_key = generateKey();

  token = await getRegHashToken(pref, OS_type, datetime);

  
  if(token=="") return false;

  
  return await new Promise((resolve, reject) => {

      var params = {
          format: 'v2',
          user_id: ToString(pref.user_id),
          user_key: ToString(pref.user_key),
          token: token,
          datetime: datetime,
          version: ToString(pref.version),
          OS_type: OS_type,
          pref_fontsize: ToString(pref.fontSize),
          pref_theme: ToString(pref.theme),
          pref_lang: ToString(pref.lang),
          pref_showc: ToString(pref.show_c),
      };
      
      var formData = new FormData();
      
      for (var k in params) {
          formData.append(k, params[k]);
      }

      
      var timeout = setTimeout(function() { reject(); }, Constant.http_fetch_timeout);

      fetch(Constant.domain_prefix + "api_regUser.php", {
          method: 'POST',
          headers: new Headers({
              'Content-Type': 'multipart/form-data',
          }),
          body: formData,
      })
      .then((response) => {
        clearTimeout(timeout);
        return response.text();
      })
      .then((response) => {
          resp_json = JSON.parse(response);

          if(resp_json.status=="1" && ToString(resp_json.id)!=""){

              updatePreference("user_id", ToString(resp_json.id)).then(() => {

                var user_key = (ToString(resp_json.user_key)==""? pref.user_key: resp_json.user_key);
                updatePreference("user_key", ToString(user_key)).then(() => {
                    resolve();
                }).catch((error) => {reject();});

              }).catch((error) => {reject();});

          }
          else if(resp_json.status=="1"){
              resolve();
          }
          else{
              reject();
          }
          
      })
      .catch((error) => {
          reject();
      });

  });


}


export async function api_sel_song(pref, song_id){
  datetime = Moment().format("YYYYMMDDHHmmss");

  if(ToString(pref.user_id)=="" || ToString(pref.user_key)=="" || ToString(song_id)=="") return false;

  token = await getSelSongHashToken(pref, song_id, datetime);

  
  if(token=="") return false;


  return await new Promise((resolve, reject) => {

    var params = {
        format: 'v2',
        user_id: ToString(pref.user_id),
        token: token,
        datetime: datetime,
        song_id: song_id,
    };
    
    var formData = new FormData();
    
    for (var k in params) {
        formData.append(k, params[k]);
    }

    fetch(Constant.domain_prefix + "api_sel_song_m.php", {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'multipart/form-data',
        }),
        body: formData,
    })
    .then((response) => {
        return response.text();
    })
    .then((response) => {
      //reject(response + " , " + token);
        resp_json = JSON.parse(response);

        if(resp_json.status=="1"){
          resolve();
        }
        else{
          reject();
        }
        
    })
    .catch((error) => {
        reject();
    });

});
}


export async function OTA_highlight(highlight_version){
  
  return await new Promise((resolve, reject) => {

    var timeout = setTimeout(function() { reject(); }, Constant.http_fetch_timeout);

    fetch(Constant.domain_prefix + "api_getHighlight.php?format=v2&d=" + highlight_version)
    .then((response) => {
      clearTimeout(timeout);
      return response.text();
    })
    .then((responseText) => {
      var jsonObj = JSON.parse(responseText);
      var d = jsonObj.d;
      var highlight = jsonObj.list;

      if(d==null || d==""){
        resolve(true);
      }else{
        db_pref.transaction(
          tx => {
  
            tx.executeSql("DELETE FROM highlight");
  
            for(let i=0;i<highlight.length;i++){
              tx.executeSql("INSERT INTO highlight (type, hymn_code, rank) VALUES ('" + fixSQL(highlight[i][0]) + "', '" + fixSQL(highlight[i][1]) + "', null)");
            }

            tx.executeSql("UPDATE preference SET value='" + fixSQL(d) + "' WHERE key='highlight_version'");
  

            resolve(true);
  
          }, 
          null,
          null
        )
      }

    })
    .catch((error) => {
      reject();
    });

  })

}



export async function OTA_hymn(OTA_version){
  
  return await new Promise((resolve, reject) => {
    
    
    var timeout = setTimeout(function() { reject(); }, Constant.http_fetch_timeout);

    fetch(Constant.domain_prefix + "api_getUpdate.php?format=v2&d=" + OTA_version + "&version=" + Constant.version)
    .then((response) => {
      clearTimeout(timeout);
      return response.text();
    })
    .then((responseText) => {
      var jsonObj = JSON.parse(responseText);
      var d = jsonObj.d;
      var hymn = jsonObj.data;

      if(d==null || d==""){
        resolve(true);
      }else{
        db.transaction(
          tx => {
  
            hymn_keys = Object.keys(hymn);
            for(let i=0; i<hymn_keys.length; i++){
              var key = hymn_keys[i];
              tx.executeSql("UPDATE hymn SET name='" + fixSQL(hymn[key][0]) + "', content='" + fixSQL(hymn[key][2]) + "', name_en='" + fixSQL(hymn[key][3]) + "', content_en='" + fixSQL(hymn[key][4]) + "' WHERE code='" + fixSQL(key) + "'");
            }


            db_pref.transaction(
              tx_pref => {
                tx_pref.executeSql("UPDATE preference SET value='" + fixSQL(d) + "' WHERE key='OTA_version'");
                resolve(true);
            },null,null);
  
          }, 
          null,
          null
        )
      }

    })
    .catch((error) => {
      reject();
    });

  })

}







//-----------------------------Hymn functions----------------------------------------------------------


export function searchHymn(hymntype, search_string, hymn_range, code_arr, show_c) {

  search_string = search_string.trim();

  var search_sql = "";
  var sel_fields = "type, code, hymn_num, name";

  if(search_string.match(/\d{1,3}[A-Za-z]{0,1}/)){
    var num=trimNumPad(search_string);

    search_sql = "SELECT " + sel_fields + " FROM hymn WHERE hymn_num IN (" + 
                  "'" + num + "', '" + numPad(num,3) + "', '" + numPad(num,4) + "', '" + numPad(num,3) + "a', '" + numPad(num,3) + "b') " 
                + (hymntype==""?"":" AND type='" + hymntype + "'");
  }
  else if(hymntype!="" && hymn_range!=null && hymn_range.length==2){
    search_sql = "SELECT " + sel_fields + " FROM hymn WHERE type='" + hymntype + "' AND hymn_num>='" + hymn_range[0] + "' AND hymn_num<='" + hymn_range[1] + "'";
  }
  else if(search_string==""){
    search_sql = "SELECT " + sel_fields + " FROM hymn " + (hymntype==""?"":"WHERE type='" + hymntype + "'");
  }
  else{
    var search_arr = search_string.split(' ');

    var sql_param = "";

    for (let tmp_search of search_arr) {
      tmp_search = tmp_search.trim();
      if(tmp_search!=""){

        var char_swap = search_char_swap(tmp_search);
        if(sql_param!="") sql_param += " AND ";
        sql_param += "(";
        sql_param += " name LIKE '%" + fixSQL(tmp_search) + "%' OR name_en LIKE '%" + fixSQL(tmp_search) + "%' OR " + sql_content_replace("content") + " LIKE '%" + fixSQL(tmp_search) + "%' OR " + sql_content_replace("content_en") + " LIKE '%" + fixSQL(tmp_search) + "%' ";
      
        if(char_swap!=""){
          sql_param += " OR name LIKE '%" + fixSQL(char_swap) + "%' OR name_en LIKE '%" + fixSQL(char_swap) + "%' OR " + sql_content_replace("content") + " LIKE '%" + fixSQL(char_swap) + "%' OR " + sql_content_replace("content_en") + " LIKE '%" + fixSQL(char_swap) + "%' ";
        }
        sql_param += ")";

      }
    }
    search_sql = "SELECT " + sel_fields + " FROM hymn " + (sql_param==""?"":" WHERE " + sql_param);
  }

  if(code_arr!=null){
    var code_arrayString = "";
    for(let i=0; i<code_arr.length; i++){
      code_arrayString += (code_arrayString==""?"":",") + "'" + code_arr[i] + "'";
    }
    search_sql = "SELECT " + sel_fields + " FROM hymn WHERE code IN (" + code_arrayString + ")";
  }

  if(show_c=="0"){
    if(search_sql.indexOf("WHERE")>0){
      search_sql += " AND ";
    }else{
      search_sql += " WHERE ";
    }
    
    search_sql += " type != 'hymn_c_data' ";
  }
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          search_sql,
          [],
          (tx, results) => {
    
            var len = results.rows.length;
            response = [];
            if (len > 0) {
              
              if(code_arr!=null){
                for(let j=0; j<code_arr.length; j++){
                  for(let i=0; i<len; i++){
                    if(code_arr[j] == results.rows.item(i).code){
                      type = results.rows.item(i).type;
                      code = results.rows.item(i).code;
                      hymn_num = trimNumPad(results.rows.item(i).hymn_num);
                      name = results.rows.item(i).name;
      
                      tmp = {type, code, hymn_num, name};
                      response.push(tmp);
                      break;
                    }
                  }
                }
              }else{
                for(let i=0; i<len; i++){
                  type = results.rows.item(i).type;
                  code = results.rows.item(i).code;
                  hymn_num = trimNumPad(results.rows.item(i).hymn_num);
                  name = results.rows.item(i).name;
  
                  tmp = {type, code, hymn_num, name};
                  response.push(tmp);
                }
              }
              
            } else {
            }
            resolve(response);
          }
        );
      }, null, null);
  });
}


export function getHymnDetail(code) {


  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "SELECT * FROM hymn WHERE code='" + fixSQL(code) + "'",
          [],
          (tx, results) => {
    
            var len = results.rows.length;
            response = [];
            if (len > 0) {
              type = results.rows.item(0).type;
              code = results.rows.item(0).code;
              hymn_num = results.rows.item(0).hymn_num;
              name = results.rows.item(0).name;
              name_en = results.rows.item(0).name_en;
              content = results.rows.item(0).content;
              content_en = results.rows.item(0).content_en;
              resolve({type, code, hymn_num, name, name_en, content, content_en});
              
            } else {
            }
          }
        );
      }, null, null);
  });

}


export function getBookmark(code) {
  var sql = "SELECT * FROM bookmark ";
  if(code != null && code != ""){
    sql += " WHERE hymn_code='" + fixSQL(code) + "'";
  }
  sql += " ORDER BY crt_datetime DESC";
  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql(
          sql,
          [],
          (tx, results) => {
            var len = results.rows.length;
            var code_arr = [];
            response = [];
            if (len > 0) {
              for(let i=0; i<len; i++){
                code_arr.push(results.rows.item(i).hymn_code);
              }
            }
            resolve(searchHymn("","","",code_arr));
          }
        );
      }, null, null);
  });

}

export function addBookmark(code) {
  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql("DELETE FROM bookmark WHERE hymn_code='" + fixSQL(code) + "'");
        tx.executeSql("INSERT INTO bookmark (hymn_code, crt_datetime) VALUES ('" + fixSQL(code) + "', CURRENT_TIMESTAMP)");
        tx.executeSql("DELETE FROM bookmark WHERE hymn_code NOT IN (SELECT hymn_code FROM bookmark ORDER BY crt_datetime DESC LIMIT " + Constant.myfav_limit + ")");
        resolve(true);
      }, null, null);
  });

}

export function delBookmark(code) {
  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql("DELETE FROM bookmark WHERE hymn_code='" + fixSQL(code) + "'");
        resolve(true);
      }, null, null);
  });

}

export function getHistory(code) {
  var sql = "SELECT * FROM history ";
  if(code != null && code != ""){
    sql += " WHERE hymn_code='" + fixSQL(code) + "'";
  }
  sql += " ORDER BY crt_datetime DESC";

  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql(
          sql,
          [],
          (tx, results) => {
    
            var len = results.rows.length;
            var code_arr = [];
            response = [];
            if (len > 0) {
              for(let i=0; i<len; i++){
                code_arr.push(results.rows.item(i).hymn_code);
              }
              
            }
            resolve(searchHymn("","","",code_arr));
          }
        );
      }, null, null);
  });

}

export function addHistory(code) {
  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql("DELETE FROM history WHERE hymn_code='" + fixSQL(code) + "'");
        tx.executeSql("INSERT INTO history (hymn_code, crt_datetime) VALUES ('" + fixSQL(code) + "', CURRENT_TIMESTAMP)");
        tx.executeSql("DELETE FROM history WHERE hymn_code NOT IN (SELECT hymn_code FROM history ORDER BY crt_datetime DESC LIMIT " + Constant.history_limit + ")");
        resolve(true);
      }, null, null);
  });

}

export function delHistory(code) {
  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql("DELETE FROM history WHERE hymn_code='" + fixSQL(code) + "'");
        resolve(true);
      }, null, null);
  });

}



export function getHighlight(code) {
  var sql = "SELECT * FROM highlight ";
  if(code != null && code != ""){
    sql += " WHERE hymn_code='" + fixSQL(code) + "'";
  }
  sql += " ORDER BY rank";

  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql(
          sql,
          [],
          (tx, results) => {
    
            var len = results.rows.length;
            var code_arr = [];
            response = [];
            if (len > 0) {
              for(let i=0; i<len; i++){
                type = results.rows.item(i).type;
                hymn_code = results.rows.item(i).hymn_code;
                rank = results.rows.item(i).rank;

                response.push({type, hymn_code, rank});
              }
              
            }
            resolve(response);
          }
        );
      }, null, null);
  });

}



export function getPreference(key) {
  var sql = "SELECT * FROM preference ";
  if(key != null && key != ""){
    sql += " WHERE key='" + fixSQL(key) + "'";
  }

  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql(
          sql,
          [],
          (tx, results) => {
    
            var len = results.rows.length;
            response = [];
            if (len > 0) {

              result_obj = {};

              for(let i=0; i<len; i++){
                key = results.rows.item(i).key;
                value = results.rows.item(i).value;

                result_obj[key] = value;

              }
              resolve(result_obj);
            }
          }
        );
      }, null, null);
  });

}

export function updatePreference(key, value) {
  return new Promise((resolve, reject) => {
    db_pref.transaction(
      tx => {
        tx.executeSql("UPDATE preference set value='" + fixSQL(value) + "' WHERE key='" + fixSQL(key) + "'");
        resolve(true);
      }, null, null);
  });
}