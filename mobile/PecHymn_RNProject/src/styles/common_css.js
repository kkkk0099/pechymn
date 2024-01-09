import { StyleSheet, Dimensions } from 'react-native'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import { isTablet } from 'react-native-device-detection'

import {isIOS} from 'PecHymn_RNProject/src/lib/commonFunc';
  
const css_common = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4fbff',
  },
  loading:{
    flex: 1,
    width: "100%",
    alignSelf: 'center',
    justifyContent: 'center',
  },
  iphonex_landscape_padding:{
    paddingLeft: 35,
    paddingRight: 35,
  }
})

const css_listing = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4fbff',
    width: "100%",
    height: "100%",
  },
  container_portrait:{
    paddingTop: isIOS()? (isIphoneX()? 80:70):50,
  },
  container_landscape:{
    paddingTop: isTablet? 70: 50,
  },
  btn_search_view:{
    flex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 80,
    width: 80,
  },
  btn_search:{
    flex: 1,
    marginBottom: 25,
    marginRight: 25,
    borderRadius: 100,

    // shadow
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
  btn_search_img: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: "100%",
  },
  hymnHeaderBar_container:{
    width: "100%",
    height: 40,
    marginTop: 15,
    marginBottom: 20,
    position: 'absolute',
    left: 0,
  },
  hymnHeaderBar_container_portrait:{
    top: isIOS()? (isIphoneX()? 90:80) :60,
  },
  hymnHeaderBar_container_landscape:{
    top: isIOS()? 71:60,
  },
  hymnHeaderBar_container_style_padding:{
    paddingRight: 30,
    paddingLeft: 15,
  },
  hymnTypeSel_container:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  hymnTypeSel_container2:{
    flexDirection:'row',
    alignSelf: 'flex-end',
    backgroundColor: '#f4fbff',
    borderWidth: 0,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    paddingLeft: 10,
    
    // shadow
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  hymnTypeSel_ddl_icon:{
    alignSelf: 'center',
    paddingRight: 10,
  },
  hymnSearchWording_container:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  hymnSearchWording_container2:{
    flexDirection:'row',
    alignSelf: 'flex-start',
    borderWidth: 0,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 10,
    
    // shadow
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  hymnSearchWording_title:{
    fontSize: 20,
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  hymnSearchWording_text:{
    fontSize: 16,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingRight: 20,
  },
  hymnSearchWording_cancel:{
    paddingVertical: 5,
    paddingRight: 15,
    width: 40,
  },
  hymnSearchWording_cancel_img:{
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: "100%",
  },
})

const css_hymnTypeSel_picker = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 8,
    color: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
  },
});


const css_toolbar = StyleSheet.create({
  toolbar:{
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 1,
    backgroundColor: '#0080ff',
    width: "100%",
    paddingLeft: 9,
    paddingRight: 9,
  },
  toolbar_portrait:{
    height: isIOS()? (isIphoneX()? 90:80) :60,
    paddingTop: isIOS()? (isIphoneX()? 30: 20) :0,
  },
  toolbar_landscape:{
    height: isTablet? 80 :60,
    paddingTop: isTablet? 20 :0,
  },
  toolbar_space:{
    flexGrow: 1,
  },
  
  hymn_btn: {
    width: 40,
    marginVertical: 10,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    opacity: 1,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hymn_btn_active: {
    backgroundColor: '#FFFFFF',
  },
  hymn_btn_txt: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },
  hymn_btn_txt_active: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },

  btn_myfav: {
    width: 50,
    padding: 5,
    opacity: 1,
  },
  btn_myfav_img: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 45,
  },
  btn_history: {
    width: 50,
    padding: 5,
    opacity: 1,
  },
  btn_history_img: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 45,
  },
  btn_setting: {
    width: 50,
    padding: 5,
    opacity: 1,
  },
  btn_setting_img: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 45,
  },
})


const css_searchBox = StyleSheet.create({
  modal:{
    margin: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    width:"100%", 
    position: 'absolute', 
    top:0,
    backgroundColor: 'white',
    paddingLeft: 5,
  },
  container_portrait:{
    height: isIOS()? (isIphoneX()? 90: 80) :60, 
    paddingTop: isIOS()? (isIphoneX()? 30: 20) :0,
  },
  container_landscape:{
    height: isIOS()? 70:60, 
    paddingTop: isIOS()? 10:0,
  },
  textInput: {
    flex: 10,
    alignSelf: 'stretch',
    borderColor: 'gray', 
    borderWidth: 1, 
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
  },
  btnCancel:{
    width: 50,
    alignSelf: 'stretch',
    padding: 10,
    margin: 10,
    paddingLeft: 0,
    marginLeft: 0,
  },
  btnCancelText:{
    
  }
})

const css_musicBox = StyleSheet.create({
  container: {
    width:"100%", 
    height: isIOS()? (isIphoneX()? 70: 60): 50, 

    // shadow
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: -1,
      width: -1,
    },
  },
  container2: {
    flexDirection: 'row',
    width:"100%", 
    height: 50, 
    justifyContent: 'center',
  },
  btn_common:{
    width: 50,
    paddingHorizontal: 10,
    opacity: 1,
  },
  btn_common_img_inactive:{
    display: 'none',
  },
  btn_common_img_invalid:{
    opacity: 0.6,
  },
  btn_common_img:{
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    width: 28,
    opacity: 1,
  },
  btn_common_img_off:{
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    width: 28,
    opacity: 0.5,
  },
  timer_container:{
    width: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timer:{
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 17,
    textAlign: 'right',
  },
  timer_l:{
    width: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 17,
    textAlign: 'right',
  },
  timer_r:{
    width: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 17,
    textAlign: 'left',
  },
  timer_split:{
    width: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff',
  }
})


export { css_common, css_listing, css_hymnTypeSel_picker, css_toolbar, css_searchBox, css_musicBox } 