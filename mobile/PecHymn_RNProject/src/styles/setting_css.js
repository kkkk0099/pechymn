import { StyleSheet, Dimensions } from 'react-native'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'

import {isIOS} from 'PecHymn_RNProject/src/lib/commonFunc';
  
const css_setting = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tabBar_container:{
    height: isIOS()? 70: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItem:{
    flex: 1,
    height: 50,
    marginTop: isIOS()? 20: null,
  },
  tabItem_container:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929',
  },
  tabItem_img_container:{
    width: 30,
    height: 30,
  },
  tabItem_img:{
    flex: 1,
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  tabItem_text:{
    fontSize: 13,
  },
  closeItem:{
    width: 45,
    backgroundColor: '#292929',
    marginTop: isIOS()? 20: null,
  },
  closeItem_img:{
    flex: 1,
    width: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
})

const css_setting_myfav = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatlist:{
      width: "100%",
    },
    footer_space:{
      height: 75,
    },
    listItem_space:{
      height: 1,
      width: "96%",
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      opacity: 0.3,
    },
    listItem_container:{
      //width: Dimensions.get('window').width - 50,
      width: "100%",
    },
    listItem:{
      flex: 1,
      width: "100%",
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 14,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
    },
    listItem_1:{
      width: 60,
    },
    listItem_2:{
      flex: 1,
      alignItems: 'center',
    },
    listItem_3:{
      width: 20,
    },
    listItem_text_1:{
      fontSize: 16,
      fontWeight: 'bold',
    },
    listItem_text_2:{
      fontSize: 18,
      fontWeight: 'bold',
    },
})

const css_setting_myhistory = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatlist:{
      width: "100%",
    },
    footer_space:{
      height: 75,
    },
    listItem_space:{
      height: 1,
      width: "96%",
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      opacity: 0.3,
    },
    listItem_container:{
      //width: Dimensions.get('window').width - 50,
      width: "100%",
    },
    listItem:{
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listItem_1:{
      width: 60,
    },
    listItem_2:{
      flex: 1,
      alignItems: 'center',
    },
    listItem_3:{
      width: 20,
    },
    listItem_text_1:{
      fontSize: 16,
      fontWeight: 'bold',
    },
    listItem_text_2:{
      fontSize: 18,
      fontWeight: 'bold',
    },
})


const css_setting_settings = StyleSheet.create({
    container: {
      height: isIOS()? (Dimensions.get('window').height-80) : (Dimensions.get('window').height),
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    region:{
      width: "100%",
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      marginTop: 10,
    },
    row:{
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
    },
    row_noflex:{
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
    },
    col_key:{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    col_value:{
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    col_key_txt:{
      fontSize: 16,
    },
    col_value_txt:{
      fontSize: 15,
      color: '#555555'
    },
    row_space:{
      width: "100%",
      height: 1,
      backgroundColor: '#BBBBBB',
    },
    one_row:{
      flex: 1,
      flexDirection: 'row',
    },
    arrow:{
      width: 20,
      alignSelf: 'flex-end',
    },
    btn_theme:{
      width: 35,
      height: 35,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_theme_txt:{
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white'
    },
    btn_theme_space:{
      width: 10,
    },
})

export { css_setting, css_setting_myfav, css_setting_myhistory, css_setting_settings } 