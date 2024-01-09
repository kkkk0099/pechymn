import { Platform, StyleSheet, Dimensions } from 'react-native'

export function getTheme(theme){
    if(theme=="red"){
        return ({
            bg_light:{
                backgroundColor: '#FCF2F2',
            },
            bg_light2:{
                backgroundColor: '#FCF2F2',
            },
            bg_dark:{
                backgroundColor: '#c32522',
            },
            bg_dark2:{
                backgroundColor: '#c32522',
            },
            bg_dark3:{
                backgroundColor: '#ad211f',
            },
            text_dark: {
                color: '#981E1B',
            },
            text_dark2: {
                color: '#981E1B',
            },
            text_light:{
                color: '#FAEEEE',
            },
        })
    }
    else if(theme=="yellow"){
        return ({
            bg_light:{
                backgroundColor: '#FFFFDD',
            },
            bg_light2:{
                backgroundColor: '#FFFFDD',
            },
            bg_dark:{
                backgroundColor: '#c8981e',
            },
            bg_dark2:{
                backgroundColor: '#c8981e',
            },
            bg_dark3:{
                backgroundColor: '#b1871b',
            },
            text_dark: {
                color: '#703704',
            },
            text_dark2: {
                color: '#703704',
            },
            text_light:{
                color: '#FAEEEE',
            },
        })
    }
    else if(theme=="purple"){
        return ({
            bg_light:{
                backgroundColor: '#fde9ff',
            },
            bg_light2:{
                backgroundColor: '#fde9ff',
            },
            bg_dark:{
                backgroundColor: '#b300b3',
            },
            bg_dark2:{
                backgroundColor: '#b300b3',
            },
            bg_dark3:{
                backgroundColor: '#990099',
            },
            text_dark: {
                color: '#751a7f',
            },
            text_dark2: {
                color: '#751a7f',
            },
            text_light:{
                color: '#FAEEEE',
            },
        })
    }
    else if(theme=="green"){
        return ({
            bg_light:{
                backgroundColor: '#e2ffd4',
            },
            bg_light2:{
                backgroundColor: '#e2ffd4',
            },
            bg_dark:{
                backgroundColor: '#258e25',
            },
            bg_dark2:{
                backgroundColor: '#258e25',
            },
            bg_dark3:{
                backgroundColor: '#1f7a1f',
            },
            text_dark: {
                color: '#624222',
            },
            text_dark2: {
                color: '#624222',
            },
            text_light:{
                color: '#FFFFFF',
            },
        })
    }
    else if(theme=="white"){
        return ({
            bg_light:{
                backgroundColor: '#f2f2f2',
            },
            bg_light2:{
                backgroundColor: '#f2f2f2',
            },
            bg_dark:{
                backgroundColor: '#404040',
            },
            bg_dark2:{
                backgroundColor: '#404040',
            },
            bg_dark3:{
                backgroundColor: '#333333',
            },
            text_dark: {
                color: '#333333',
            },
            text_dark2: {
                color: '#333333',
            },
            text_light:{
                color: '#FFFFFF',
            },
        })
    }
    else if(theme=="black"){
        return ({
            bg_light:{
                backgroundColor: '#151515',
            },
            bg_light2:{
                backgroundColor: '#404040',
            },
            bg_dark:{
                backgroundColor: '#404040',
            },
            bg_dark2:{
                backgroundColor: '#404040',
            },
            bg_dark3:{
                backgroundColor: '#404040',
            },
            text_dark: {
                color: '#EEEEEE',
            },
            text_dark2: {
                color: '#404040',
            },
            text_light:{
                color: '#EEEEEE',
            },
        })
    }else{  //default Blue
        return ({
            bg_light:{
                backgroundColor: '#f4fbff',
            },
            bg_light2:{
                backgroundColor: '#f4fbff',
            },
            bg_dark:{
                backgroundColor: '#0080ff',
            },
            bg_dark2:{
                backgroundColor: '#0080ff',
            },
            bg_dark3:{
                backgroundColor: '#0073e6',
            },
            text_dark: {
                color: '#0050ff',
            },
            text_dark2: {
                color: '#0050ff',
            },
            text_light:{
                color: '#f4fbff',
            },
        });
    }
}

export function getFontSize(fontSize){
    if(fontSize==2){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 18: 15,
            },
            listing_text:{
                fontSize: Platform.isPad? 18: 15,
            },
            detail_title:{
                fontSize: Platform.isPad? 20: 17,
            },
            detail_content:{
                fontSize: Platform.isPad? 18: 15,
            },
        });
    }
    else if(fontSize==3){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 20: 17,
            },
            listing_text:{
                fontSize: Platform.isPad? 20: 17,
            },
            detail_title:{
                fontSize: Platform.isPad? 22: 19,
            },
            detail_content:{
                fontSize: Platform.isPad? 20: 17,
            },
        });
    }
    else if(fontSize==4){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 22: 19,
            },
            listing_text:{
                fontSize: Platform.isPad? 22: 19,
            },
            detail_title:{
                fontSize: Platform.isPad? 24: 21,
            },
            detail_content:{
                fontSize: Platform.isPad? 22: 19,
            },
        });
    }
    else if(fontSize==5){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 22: 19,
            },
            listing_text:{
                fontSize: Platform.isPad? 24: 21,
            },
            detail_title:{
                fontSize: Platform.isPad? 27: 23,
            },
            detail_content:{
                fontSize: Platform.isPad? 24: 21,
            },
        });
    }
    else if(fontSize==6){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 22: 19,
            },
            listing_text:{
                fontSize: Platform.isPad? 26: 23,
            },
            detail_title:{
                fontSize: Platform.isPad? 28: 25,
            },
            detail_content:{
                fontSize: Platform.isPad? 26: 23,
            },
        });
    }
    else if(fontSize==7){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 22: 19,
            },
            listing_text:{
                fontSize: Platform.isPad? 26: 23,
            },
            detail_title:{
                fontSize: Platform.isPad? 32: 29,
            },
            detail_content:{
                fontSize: Platform.isPad? 30: 27,
            },
        });
    }
    else if(fontSize==8){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 22: 19,
            },
            listing_text:{
                fontSize: Platform.isPad? 30: 27,
            },
            detail_title:{
                fontSize: Platform.isPad? 37: 34,
            },
            detail_content:{
                fontSize: Platform.isPad? 35: 32,
            },
        });
    }
    else if(fontSize==9){
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 22: 19,
            },
            listing_text:{
                fontSize: Platform.isPad? 32: 29,
            },
            detail_title:{
                fontSize: Platform.isPad? 41: 38,
            },
            detail_content:{
                fontSize: Platform.isPad? 39: 36,
            },
        });
    }
    else{
        return ({
            listing_hymntype:{
                fontSize: Platform.isPad? 22: 19,
            },
            listing_text:{
                fontSize: Platform.isPad? 22: 19,
            },
            detail_title:{
                fontSize: Platform.isPad? 24: 21,
            },
            detail_content:{
                fontSize: Platform.isPad? 22: 19,
            },
        });
    }
}


export function getScrollbarColor(theme){
    if(theme=="black"){
        return ({
            color: 'white'
        });
    }
    else{
        return ({
            color: 'black'
        });
    }
}