import { Platform } from 'react-native'

import { sha512 } from 'react-native-sha512';
const Constant = require('PecHymn_RNProject/src/data/constant');

export function isIOS(){
    return (Platform.OS=="ios");
}

export function numPad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

export function trimNumPad(number){
    number = ToString(number);
    return number.replace(/^0+/, '');
}

export function ToString(input){
    if(input==null || input==undefined){
        return "";
    }else{
        return String(input);
    }
}

export async function getRegHashToken(pref, OS_type, datetime){
    str_to_hash = ToString(pref.user_id) + ToString(pref.user_key) + ToString(pref.version) + ToString(OS_type) + ToString(pref.fontSize) + ToString(pref.theme) + ToString(pref.lang) + ToString(pref.show_c);

    return await sha512(Constant.hash_salt + str_to_hash + datetime);
}

export async function getSelSongHashToken(pref, song_id, datetime){
    str_to_hash = ToString(pref.user_id) + ToString(pref.user_key) + ToString(song_id);

    return await sha512(Constant.hash_salt + str_to_hash + datetime);
}

export function generateKey(size = 50){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var result = '';
    for (var i = size; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;

    /*const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"];
    return [...Array(size)].map(i=>chars[Math.random()*chars.length|0]).join("");*/
}