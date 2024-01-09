import React, {Component} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, Alert, Animated} from 'react-native';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Modal from "react-native-modal";
import {Clipboard} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import {NativeViewGestureHandler, PinchGestureHandler, State} from 'react-native-gesture-handler';

const Constant = require('PecHymn_RNProject/src/data/constant');

import {getHymnDetail, getBookmark, addBookmark, delBookmark, addHistory, getHighlight, updatePreference, api_sel_song} from 'PecHymn_RNProject/src/lib/DBHelper';
import {HTMLParser} from 'PecHymn_RNProject/src/lib/HTMLParser';
import {ConvertText} from 'PecHymn_RNProject/src/lib/ConvertText';
import {HymnType2Name} from 'PecHymn_RNProject/src/lib/Translate';
import {ToString} from 'PecHymn_RNProject/src/lib/commonFunc';

import Toolbar_Detail from 'PecHymn_RNProject/src/components/toolbar_detail';
import MusicBox from 'PecHymn_RNProject/src/components/musicBox';
import SearchBox from 'PecHymn_RNProject/src/components/searchBox';
import ErrorReportBox from 'PecHymn_RNProject/src/components/errorReportBox';


import {css_common, css_searchBox} from 'PecHymn_RNProject/src/styles/common_css';
import {getTheme, getFontSize, getScrollbarColor} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_hymn_detail} from 'PecHymn_RNProject/src/styles/content_css';

import SoundPlayer from 'react-native-sound-player'

export default class Detail_TabView extends React.Component {
  
  static navigationOptions = {
    header: null,
  };
  
  constructor(props) {
    super(props);
    pref = this.props.navigation.getParam("pref");

    this.indexChangeEvent = this.indexChangeEvent.bind(this);

    var tmp_route = [];
    var default_index = 0;
    for (let search_result of this.props.navigation.getParam("search_result")) {
      if(search_result.code==this.props.navigation.getParam("code")) default_index=tmp_route.length;
      tmp_route.push({key:search_result.code});
    }

    this.setHistoryTimer(default_index);
    this.state = {
      isLoading: true,
      pref: pref,
      index: default_index,
      routes: tmp_route,
      lang: pref.lang,
      enableTimer: false,
      orientation: Orientation.getInitialOrientation(),
      isSearchBoxVisible: false,
      serachText: "",
    };

    this.initDataFromDB();
    
    Orientation.getOrientation((orientation)=>{
      this.setState({
        orientation: orientation,
      });
    });
  }

  componentWillMount() {
    let that = this;

    this.didBlurSubscription = this.props.navigation.addListener('willBlur', () => {
      
      that.state.enableTimer = false;

      try{
        SoundPlayer.stop();
        SoundPlayer.unmount();
      }catch(ex){}

      //Orientation.lockToPortrait();
      that.props.navigation.state.params.refreshDataFromDB(that.props.navigation.state.params.Class_Listing);

      if(this.state.searchText != undefined && this.state.searchText!=""){
        that.props.navigation.state.params.searchText(that.props.navigation.state.params.Class_Listing, this.state.searchText);
      }
    })
  }
  
  componentDidMount() {
    Orientation.unlockAllOrientations();
 
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({
      orientation: orientation,
      isSearchBoxVisible: false,
    });
  }


  async initDataFromDB(){
    
    getHighlight().then(highlight =>{

      var highlight_hot = [];
      var highlight_cool = [];
      for(let i=0;i<highlight.length;i++){
        if(highlight[i].type=='hot'){
          highlight_hot.push(highlight[i].hymn_code);
        }else if(highlight[i].type=='cool'){
          highlight_cool.push(highlight[i].hymn_code);
        }
      }

      this.setState({
        isLoading: false,
        enableTimer: true,
        highlight_hot: highlight_hot,
        highlight_cool: highlight_cool,
      });
    })
  }

  isHighlight_Hot(hymn_code){
    if(this.state.highlight_hot.indexOf(hymn_code)>=0){
      return true;
    }else{
      return false;
    }
  }
  isHighlight_Cool(hymn_code){
    if(this.state.highlight_cool.indexOf(hymn_code)>=0){
      return true;
    }else{
      return false;
    }
  }

  showSearchBox = () => {
    this.setState({ isSearchBoxVisible: true });
  }
  hideSearchBox = () => {
    this.setState({ isSearchBoxVisible: false });
  }
  onSearchText = (serachText) => {
    try{
      let that = this;
      if(serachText=="") return;
      this.setState({ searchText: serachText, isSearchBoxVisible: false },()=>{
        that.goBack();
      });
    }catch(ex){}
  }

  changeLang = (lang: string) => {
    if(lang=="TC" || lang=="SC"){
      updatePreference("lang", lang).then(result => {
        this.setState({
          lang: lang,
        });
      })
    }else{
      this.setState({
        lang: lang,
      });
    }
  }

  goBack = () => {

    /*this.setState({
      enableTimer: false,
    },()=>{
      this.props.navigation.state.params.refreshDataFromDB(this.props.navigation.state.params.Class_Listing);
      this.props.navigation.goBack();
    });*/
      this.props.navigation.goBack();
  }
  
  renderScene = ({ route }) => {
    var index_diff = Math.abs(this.state.index - this.state.routes.indexOf(route));
    if (index_diff > 1) {
      return <View style={[css_common.loading, getTheme(this.state.pref.theme).bg_light]}><ActivityIndicator size="small" color={getTheme(this.state.pref.theme).bg_dark.backgroundColor} /></View>;
    }

    var view_style={};
    if(this.state.orientation === 'LANDSCAPE-LEFT' || this.state.orientation === 'LANDSCAPE-RIGHT'){
      view_style={display: 'none'};
    }

    switch (route.key) {
      default:
        var btn_search_style = css_hymn_detail.btn_search_view_music;
        if(route.key.indexOf('hymn_c')==0){
          btn_search_style = css_hymn_detail.btn_search_view_nomusic;
        }
        return(
          <View>
            <Modal isVisible={this.state.isSearchBoxVisible} animationIn='slideInDown' animationOut='slideOutUp'
            style={css_searchBox.modal}
              onBackButtonPress={this.hideSearchBox} onBackdropPress={this.hideSearchBox}>
              <SearchBox orientation={this.state.orientation} pref={this.state.pref} onSearchText={this.onSearchText} hideSearchBox={this.hideSearchBox} serachText={this.state.serachText} ></SearchBox>
            </Modal>
            <Detail pref={this.state.pref} code={this.state.routes[this.state.routes.indexOf(route)].key} lang={this.state.lang}
              isHighlight_Hot={this.isHighlight_Hot(this.state.routes[this.state.routes.indexOf(route)].key)}
              isHighlight_Cool={this.isHighlight_Cool(this.state.routes[this.state.routes.indexOf(route)].key)}
              musicBoxEnable={index_diff==0?true:false} SoundPlayer={SoundPlayer}
              orientation={this.state.orientation}
             />
             <View style={[css_hymn_detail.btn_search_view, btn_search_style, view_style]}>
               <TouchableOpacity style={[css_hymn_detail.btn_search, getTheme(this.state.pref.theme).bg_dark3, view_style]} onPress={() => this.showSearchBox()} >
                 <Image source={require('PecHymn_RNProject/src/assets/images/btn_search.png')}  style={[css_hymn_detail.btn_search_img, view_style]} />
               </TouchableOpacity>
             </View>
          </View>
        );
    }
  };


  renderTabBar =  (props) => {
    var view_style={};
    if(this.state.orientation === 'LANDSCAPE-LEFT' || this.state.orientation === 'LANDSCAPE-RIGHT'){
      //view_style={display: 'none'};
    }

    return (
      <View style={view_style}>
        {props.navigationState.routes.map((route, i) => {

          if (Math.abs(this.state.index - i) >= 1) {
            return null;
          }

          return (
            <Toolbar_Detail orientation={this.state.orientation} key={i} pref={this.state.pref} goBack={this.goBack} hymn_code={route.key} changeLang={this.changeLang} lang={this.state.lang} />
          );

        })}
      </View>
    );
  }

  indexChangeEvent(index) {
    this.setHistoryTimer(index);
    this.setState({ index });
  }

  setHistoryTimer(index){
    let that = this;
    setTimeout(async function(){
      if(that.state.enableTimer && index==that.state.index){
        addHistory(that.state.routes[index].key).then(async ()=>{
          await api_sel_song(that.state.pref, that.state.routes[index].key);
        });
      }
    }, Constant.history_set_timeout);
  }
 
  render() {
    if(this.state.isLoading){
      return (<View style={[css_common.loading, getTheme(this.state.pref.theme).bg_light]}><ActivityIndicator size="small" color={getTheme(this.state.pref.theme).bg_dark.backgroundColor} /></View>);
    }

    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        onIndexChange={this.indexChangeEvent}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
      />
      //renderTabBar={()=> {return null;}}
    );
  }
}


class Detail extends React.Component {
  inchRef = React.createRef();
  rotationRef = React.createRef();

  _scale = 1;
  _lastScale = 1;
  
  _onPinchGestureEvent = event => {
    let speed_var = 1.5; //1:normal, < quick , > slow
    let delta = 0;
    let delta_scale = event.nativeEvent.scale - this._scale;

    this._scale = event.nativeEvent.scale;


    if(delta_scale>=0){
      delta = delta_scale / 6 * (Constant.detail_fontsize_max - Constant.detail_fontsize_min) / speed_var;
    }else{
      if(this._scale>1){
        delta = delta_scale / 4 * (Constant.detail_fontsize_max - Constant.detail_fontsize_min) / speed_var;
      }else{
        delta = delta_scale / 1 * (Constant.detail_fontsize_max - Constant.detail_fontsize_min) / speed_var;
      }
    }

    let result_fontsize = this.state.fontSize + delta;

    if(result_fontsize > Constant.detail_fontsize_max) result_fontsize = Constant.detail_fontsize_max;
    if(result_fontsize < Constant.detail_fontsize_min) result_fontsize = Constant.detail_fontsize_min;

    //console.log("this._scale:" + this._scale + " , delta_scale:" + delta_scale + " , delta:" + delta + " , result_fontsize:" + result_fontsize);

    this.setState({
      fontSize: result_fontsize,
    })

  };

  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._scale = 1;
      //console.log("done");
    }
  };

  constructor(props) {
    super(props);
    
    this.onBookmark = this.onBookmark.bind(this);
    this.showErrorReportBbox = this.showErrorReportBbox.bind(this);
    this.hideErrorReportBox = this.hideErrorReportBox.bind(this);
    

    this.state = {
      hymn_detail: [],
      isBookmark: false,
      isErrorReportVisible: false,
      fontSize: getFontSize(this.props.pref.fontSize).detail_content.fontSize,
    };

    this.getHymnDetail();
    this.getBookmarkStatus();
  }

  async getHymnDetail(){
    tmp_hymn_detail = await getHymnDetail(this.props.code);

    this.setState({
      hymn_detail: tmp_hymn_detail,
    });

  }
  setClipboardContent = (msg) => {
    Clipboard.setString(msg);
    };


  async getBookmarkStatus(){
    var isBookmark = false;
    tmp_bookmark = await getBookmark(this.props.code);

    if(tmp_bookmark != null && tmp_bookmark.length > 0){
      isBookmark = true;
    }

    this.setState({
      isBookmark: isBookmark,
    });
  }



  async onBookmark(){
    console.log(this.props.code + " " + (this.state.isBookmark?"Yes":"No"));
    if(this.state.isBookmark){
      this.setState({
        isBookmark: false,
      }, async () => { await delBookmark(this.props.code)});
    }else{
      this.setState({
        isBookmark: true,
      }, async () => { await addBookmark(this.props.code)});
    }
  }


  showErrorReportBbox = () => {
    this.setState({ isErrorReportVisible: true });
  }
  hideErrorReportBox = () => {
    this.setState({ isErrorReportVisible: false });
  }
  onErrorReportSubmit = (inputText) => {
    if(inputText=="") return;


    try
    {
      var queryURL = Constant.domain_prefix + "report_err.php";

      queryURL += "?id=" + this.props.code + "&msg=" + encodeURI(Platform.OS + ' ' + Constant.version +  ' : ' + inputText).replace("&","%26"),

      fetch(queryURL)
      .then((response) => {
        Alert.alert(
          '提交成功',
          "感謝您回報問題，我們會盡快檢查及改善。",
          [
            {text: '完成', onPress: () => this.hideErrorReportBox()},
          ],
          {cancelable: false},
        );
      })
      .catch((error) => {
        console.log("error: " + error);
        Alert.alert("回報未能完成。 請檢查您的網絡連線是否正常。")
      })
    }
    catch (err)
    {
      Alert.alert("回報未能完成。 請檢查您的網絡連線是否正常。")
    }

    this.setState({ isSearchBoxVisible: false });
  }

  render() {
    var name = "";
    var content = "";

    if(this.props.lang=="EN" && this.state.hymn_detail.content_en != null  && this.state.hymn_detail.content_en != ""){
      content = this.state.hymn_detail.content_en;
      if(this.state.hymn_detail.name_en != null  && this.state.hymn_detail.name_en != ""){
        name = this.state.hymn_detail.name_en;
      }else{
        name = this.state.hymn_detail.name;
      }
    }else if(this.props.lang=="SC"){
      name = ConvertText(this.state.hymn_detail.name, "gb");
      content = ConvertText(this.state.hymn_detail.content, "gb");
    }else{
      name = this.state.hymn_detail.name;
      content = this.state.hymn_detail.content;
    }

    var selectable_title;
    var selectable_content;
    var title = ToString(HymnType2Name(this.state.hymn_detail.type)) + ToString(this.state.hymn_detail.hymn_num) + "   " + ToString(name);
    if(Platform.OS=="ios"){
      selectable_title = (
        <AutoGrowingTextInput 
          style={[css_hymn_detail.title_txt, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).detail_title]} 
          value={title} scrollEnabled={false} editable={false}
        />
      );

      selectable_content = (
        <AutoGrowingTextInput 
          style={[css_hymn_detail.content_txt, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).detail_content, {fontSize: this.state.fontSize}]} 
          value={HTMLParser(content)} scrollEnabled={false} editable={false}
        />
      );
    }else{
      selectable_title = (
        <Text 
        selectable={true}
        style={[css_hymn_detail.title_txt, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).detail_title]} >
          {title} 
        </Text>
      );

      selectable_content = (
        <Text 
        selectable={true}
        style={[css_hymn_detail.content_txt, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).detail_content, {fontSize: this.state.fontSize}]} >
          {HTMLParser(content)} 
        </Text>
      );
    }

    var content_style={};
    var hymnHighlight_container2 = {};
    var bookmark_container2 = {};
    var btnErrorreport_container = {};
    if(this.props.orientation === 'LANDSCAPE-LEFT' || this.props.orientation === 'LANDSCAPE-RIGHT'){
      content_style=css_hymn_detail.content_portrait;
      hymnHighlight_container2 = css_hymn_detail.hymnHighlight_container2_landscape;
      bookmark_container2 = css_hymn_detail.bookmark_container2_landscape;
      btnErrorreport_container = css_hymn_detail.btnErrorreport_container_landscape;
    }

    return (
      <View style={[css_hymn_detail.container, getTheme(this.props.pref.theme).bg_light]}>

        <PinchGestureHandler
          ref={this.pinchRef}
          simultaneousHandlers={this.rotationRef}
          onGestureEvent={this._onPinchGestureEvent}
          onHandlerStateChange={this._onPinchHandlerStateChange}>

          <NativeViewGestureHandler>
            <ScrollView style={css_hymn_detail.lyrics_container} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={true} indicatorStyle={getScrollbarColor(this.props.pref.theme).color}>
              
            <View style={css_hymn_detail.hymnHeaderBar_container}>
                <View style={(!this.props.isHighlight_Hot && !this.props.isHighlight_Cool? {display:'none'}: css_hymn_detail.hymnHighlight_container)}>
                  <View style={(this.props.isHighlight_Hot?[css_hymn_detail.hymnHighlight_container2,getTheme(this.props.pref.theme).bg_dark3,hymnHighlight_container2]: {display:'none'})}>
                    <View style={[css_hymn_detail.hymnHighlight_img_container]}>
                      <Image source={require('PecHymn_RNProject/src/assets/images/ico_fire_hot_bg.png')}  style={css_hymn_detail.hymnHighlight_img} />
                    </View>
                    <Text style={[css_hymn_detail.hymnHighlight_text, getTheme(this.props.pref.theme).text_light]}>熱門詩歌</Text>
                  </View>
                  <View style={(this.props.isHighlight_Cool? [css_hymn_detail.hymnHighlight_container2,getTheme(this.props.pref.theme).bg_dark3,hymnHighlight_container2] : {display:'none'})}>
                    <View style={[css_hymn_detail.hymnHighlight_img_container]}>
                      <Image source={require('PecHymn_RNProject/src/assets/images/ico_fire_cool_bg.png')}  style={css_hymn_detail.hymnHighlight_img} />
                    </View>
                    <Text style={[css_hymn_detail.hymnHighlight_text, getTheme(this.props.pref.theme).text_light]}>冷門推薦</Text>
                  </View>
                </View>

                <View style={css_hymn_detail.bookmark_container}>
                  <View style={[css_hymn_detail.bookmark_container2,getTheme(this.props.pref.theme).bg_dark3, bookmark_container2]}>
                    <TouchableOpacity style={css_hymn_detail.bookmark_btn} onPress={this.onBookmark} >
                      <View>
                        <Image source={require('PecHymn_RNProject/src/assets/images/btn_myfav_off.png')}  style={this.state.isBookmark? css_hymn_detail.btn_inactive: css_hymn_detail.bookmark_btn_img} />
                        <Image source={require('PecHymn_RNProject/src/assets/images/btn_myfav_on2.png')}  style={this.state.isBookmark? css_hymn_detail.bookmark_btn_img: css_hymn_detail.btn_inactive} />
                      </View>
                      <Text style={[css_hymn_detail.hymnHBookmark_text, getTheme(this.props.pref.theme).text_light]}>我的最愛</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={css_hymn_detail.lyrics_container2}>
                <View style={css_hymn_detail.title}>
                  {selectable_title}
                </View>
                <View style={[css_hymn_detail.detail_space, getTheme(this.props.pref.theme).bg_dark]}></View>
                <View style={[css_hymn_detail.content, content_style]}>
                  {selectable_content}
                </View>
              </View>
              <View style={[css_hymn_detail.btnErrorreport_container, btnErrorreport_container]}>
                <TouchableOpacity style={[css_hymn_detail.btnErrorreport_container2, getTheme(this.props.pref.theme).bg_dark3]} onPress={this.showErrorReportBbox} >
                  <View>
                    <Image source={require('PecHymn_RNProject/src/assets/images/btn_error_report.png')}  style={css_hymn_detail.btnErrorreport_img} />
                  </View>
                  <Text style={[css_hymn_detail.btnErrorreport_text, getTheme(this.props.pref.theme).text_light]}>錯誤回報</Text>
                </TouchableOpacity>
              </View>
              <View style={css_hymn_detail.lyrics_bottom_space}>
              </View>

            </ScrollView>
          </NativeViewGestureHandler>
          
        </PinchGestureHandler>

        
        <Modal isVisible={this.state.isErrorReportVisible} animationIn='fadeIn' animationOut='fadeOut' avoidKeyboard={true}
        style={css_hymn_detail.modal}
          onBackButtonPress={this.hideErrorReportBox} onBackdropPress={this.hideErrorReportBox}>
          <ErrorReportBox pref={this.props.pref} onErrorReportSubmit={this.onErrorReportSubmit} hideErrorReportBox={this.hideErrorReportBox} code={this.props.code} hymn_num={this.state.hymn_detail.hymn_num} title={name} />
        </Modal>
        <MusicBox orientation={this.props.orientation} pref={this.props.pref} type={this.state.hymn_detail.type} hymn_num={this.state.hymn_detail.hymn_num} musicBoxEnable={this.props.musicBoxEnable} SoundPlayer={this.props.SoundPlayer} />
      </View>
    );
  }

}
