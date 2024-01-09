import { Platform, StyleSheet, Dimensions } from 'react-native'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import { isTablet } from 'react-native-device-detection'

import {isIOS} from 'PecHymn_RNProject/src/lib/commonFunc';
  
const css_hymn_listing = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
    paddingTop: 10,
  },
  flatlist:{
    width: "100%",
  },
  header_space:{
    height: 65,
  },
  footer_space:{
    height: 85,
  },
  listItem_space:{
    height: 1,
    width: "96%",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    opacity: 0.3,
  },
  listItem:{
    flex: 1,
    flexDirection: 'row',
    //width: Dimensions.get('window').width,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem_1:{
    width: Platform.isPad? 90: 60,
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
    color: '#0030ff',
  },
  listItem_text_2:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0030ff',
  },
  listItem_img_3:{
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 23,
    height: 23,
  },
  listItem_bookmark_3:{
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0,
    borderRadius: 30,
    width: 23,
    height: 23,
    backgroundColor: '#ffc500'
  }
})



const css_toolbar_detail = StyleSheet.create({
  toolbar:{
    justifyContent: "space-between",
    flexDirection: 'row',
    left: 0,
    top: 0,
    backgroundColor: '#0080ff',
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  toolbar_portrait:{
    height: isIOS()? (isIphoneX()? 90: 80):60,
    paddingTop: isIOS()? (isIphoneX()? 25: 15):0,
  },
  toolbar_landscape:{
    height: isTablet? 80 :60,
    paddingTop: isTablet? 15 :0,
  },
  toolbar_space:{
    flexGrow: 1,
  },
  back_btn:{
    flex: 1,
    width: 80,
    height: "100%",
    marginTop: 7,
    paddingLeft: 5,
    opacity: 1,
    alignItems: 'center',
  },
  back_btn_img:{
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    width: 68,
  },
  container_lang:{
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: 'row',
  },
  lang_btn:{
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginHorizontal: 5,
    opacity: 1,
  },
  lang_btn_active:{
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginHorizontal: 5,
    opacity: 1,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
  },
  lang_btn_disabled:{
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginHorizontal: 5,
    opacity: 0.3,
    display: 'none',
  },
  lang_btn_txt:{
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },
})


const css_hymn_detail = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  btn_search_view:{
    flex: 1,
    position: 'absolute',
    right: 0,
    bottom: isIOS()? (isIphoneX()? 65:55) :50,
    height: 80,
    width: 80,
  },
  btn_search_view_music:{
    bottom: isIOS()? (isIphoneX()? 65:55) :50,
  },
  btn_search_view_nomusic:{
    bottom: isIOS()? (isIphoneX()? 30:20) :15,
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
  lyrics_container:{
    flex: 1,
    flexDirection: 'column',
    height: "100%",
    /*paddingTop: 70,
    paddingBottom: isIOS()? (isIphoneX()? 80:70) : 60,*/
  },
  lyrics_container2:{
    flex: 1,
    paddingTop: 10,
    height: "100%",
    justifyContent: 'space-around',
  },
  title:{
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
  },
  title_txt:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0030ff',
  },
  content:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 7,
  },
  content_portrait:{
    paddingHorizontal: 25,
  },
  content_txt:{
    fontSize: 17,
    textAlign: 'center',
    color: '#0030ff',
  },
  detail_space:{
    height: 1,
    marginTop: 10,
    width: "90%",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    opacity: 0.3,
  },
  btnErrorreport_container:{
    width: 150,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  btnErrorreport_container2:{
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 45,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnErrorreport_container_landscape:{
    paddingLeft: 35,
  },
  btnErrorreport_text:{
    fontSize: 14,
    paddingLeft: 5,
  },
  btnErrorreport_img:{
    resizeMode: 'contain',
    width: 15,
    height: 15,
  },
  lyrics_bottom_space:{
    height: 150,
  },
  modal:{
  },
  hymnHeaderBar_container:{
    width: "100%",
    height: 40,
    /*position: 'absolute',*/
    left: 0,
    paddingTop: 60,
    flexDirection: 'row',
  },
  hymnHighlight_container:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  hymnHighlight_container2:{
    flexDirection:'row',
    alignSelf: 'flex-start',
    borderWidth: 0,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 10,
    height: 40,
    
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
  hymnHighlight_container2_landscape:{
    paddingLeft: 35,
  },
  hymnHighlight_text:{
    fontSize: 16,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 20,
  },
  hymnHighlight_img_container:{
    width: 20,
    marginVertical: 8,
    borderWidth: 0,
    borderRadius: 40,
  },
  hymnHighlight_img:{
    resizeMode: 'contain',
    width: 23,
    height: 23,
  },
  bookmark_container:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  bookmark_container2:{
    flexDirection:'row',
    alignSelf: 'flex-end',
    backgroundColor: '#f4fbff',
    borderWidth: 0,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    paddingLeft: 10,
    height: 40,
    
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
  bookmark_container2_landscape:{
    paddingRight: 35,
  },
  btn_inactive:{
    display: 'none',
  },
  bookmark_btn:{
    flexDirection:'row',
    width: 110,
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmark_btn_img:{
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 45,
  },
  hymnHBookmark_text:{
    fontSize: 16,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 20,
  },
})


const css_errorReportBox = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width:"100%", 
    height: 100, 
    backgroundColor: 'white',
  },
  title_container:{
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input_container:{
    flex: 1,
    flexDirection: 'row',
    height: 20,
  },
  textInput: {
    flex: 1,
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
    color: '#0070dd',
  }
})

export { css_hymn_listing, css_toolbar_detail, css_hymn_detail, css_errorReportBox } 