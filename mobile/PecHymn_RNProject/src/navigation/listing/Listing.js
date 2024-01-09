import React, {Component} from 'react';
import {ActivityIndicator, Text, View, FlatList, TouchableOpacity, Image, StatusBar, Platform, Animated} from 'react-native';

import { NavigationActions } from 'react-navigation';
import Modal from "react-native-modal";
import RNPickerSelect from 'react-native-picker-select';
import Orientation from 'react-native-orientation-locker';
const Device = require('react-native-device-detection');

const Constant = require('PecHymn_RNProject/src/data/constant');

import {getTheme, getFontSize, getScrollbarColor} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_common, css_listing, css_searchBox, css_hymnTypeSel_picker} from 'PecHymn_RNProject/src/styles/common_css';
import {css_hymn_listing} from 'PecHymn_RNProject/src/styles/content_css';

import {searchHymn, getPreference, updatePreference, getHighlight, getBookmark} from 'PecHymn_RNProject/src/lib/DBHelper';
import {ConvertText} from 'PecHymn_RNProject/src/lib/ConvertText';
import {HymnType2Name} from 'PecHymn_RNProject/src/lib/Translate';

import Toolbar from 'PecHymn_RNProject/src/components/toolbar';
import SearchBox from 'PecHymn_RNProject/src/components/searchBox';
import SettingTab from 'PecHymn_RNProject/src/navigation/setting/SettingTab';


export default class Listing extends React.Component {
  selRange = {
    "hymn_a_data" : Constant.hymnFilter.hymn_a_data[0].value, 
    "hymn_b_data": Constant.hymnFilter.hymn_b_data[0].value, 
    "hymn_c_data":Constant.hymnFilter.hymn_c_data[0].value
  };

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    var hymnType = "hymn_a_data";

    this.onChangeHymnType = this.onChangeHymnType.bind(this);
    this.onChangeHymnRange = this.onChangeHymnRange.bind(this);
    this.onSearchCancel = this.onSearchCancel.bind(this);


    //this.initRange(hymnType);
    
    this.state = {
      isLoading: true,
      pref: null,
      highlight_hot: null,
      highlight_cool: null,
      bookmarkList: null,
      search_result: [],
      selHymnType: hymnType,
      isSettingVisible: false,
      isSearchBoxVisible: false,
      searchText: "",
      orientation: Orientation.getInitialOrientation(),
      fadeAnimation : new Animated.Value(1),
    };



    Orientation.getOrientation((orientation)=>{
      this.setState({
        orientation: orientation,
      });
    });
  }

  componentDidMount() {
    this.initDataFromDB(this, true);
    Orientation.unlockAllOrientations();
    //Orientation.lockToPortrait();
 
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({
      orientation: orientation,
    });
  }


  async initDataFromDB(Class_Listing, needGetHymnTitle){
    getPreference().then(pref =>{
        getHighlight().then(highlight =>{
          getBookmark().then(bookmark =>{

            var highlight_hot = [];
            var highlight_cool = [];
            for(let i=0;i<highlight.length;i++){
              if(highlight[i].type=='hot'){
                highlight_hot.push(highlight[i].hymn_code);
              }else if(highlight[i].type=='cool'){
                highlight_cool.push(highlight[i].hymn_code);
              }
            }

            var bookmarkList = [];
            for(let i=0;i<bookmark.length;i++){
              bookmarkList.push(bookmark[i].code);
            }

            
            StatusBar.setBackgroundColor(getTheme(pref.theme).bg_dark.backgroundColor);

            Class_Listing.setState({
              isLoading: false,
              pref: pref,
              highlight_hot: highlight_hot,
              highlight_cool: highlight_cool,
              bookmarkList: bookmarkList,
            }, ()=>{
              if(needGetHymnTitle) Class_Listing.getHymnTitle(pref.sel_hymntyype, "", Class_Listing.selRange[pref.sel_hymntyype]);
            });
        })
      })
    })
  }

  refreshDataFromDB(Class_Listing){
    Class_Listing.initDataFromDB(Class_Listing, false);
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
  isBookmark(hymn_code){
    if(this.state.bookmarkList.indexOf(hymn_code)>=0){
      return true;
    }else{
      return false;
    }
  }


  setPreference = (pref) => {
    var selHymnType = this.state.selHymnType;
    if(pref.show_c!="1" && selHymnType=="hymn_c_data"){
      pref.sel_hymntyype = "hymn_a_data";
      selHymnType = "hymn_a_data";
    }

    StatusBar.setBackgroundColor(getTheme(pref.theme).bg_dark.backgroundColor);

    this.onChangeHymnType(selHymnType);
    this.setState({
      pref: pref,
      selHymnType: selHymnType,
    });
  }

  async getHymnTitle(hymnType, searchText, range){

    if(hymnType=="" && searchText==""){
      hymnType = this.state.selHymnType;
    }

    //tmp_search_result = await searchHymn("hymn_a_data", "他'是", [1,50]);
    tmp_search_result = await searchHymn(hymnType, searchText, (range==""?null: range.split(",")), null, this.state.pref.show_c);


    this.setState(previousState => ({
      selHymnType: (searchText==""?hymnType:previousState.selHymnType),
      search_result: tmp_search_result,
      tabDefault: 0,
      searchText: searchText,
    }));

  }

  /*getInitRange(hymnType){
    return Constant.hymnFilter[hymnType][0].value;
  }*/

  onChangeHymnType = (hymnType : string) => {
    Animated.timing(this.state.fadeAnimation, {
      toValue : 0,
      duration : 200
    }).start(()=>{
      updatePreference("sel_hymntyype", hymnType).then((result) => {
            try{
              this.getHymnTitle(hymnType, "", this.selRange[hymnType]).then( ()=>{

                this._flatList.scrollToIndex({animated: false, viewOffset:65, index:0});

                Animated.timing(this.state.fadeAnimation,{
                  toValue : 1,
                  duration : 400
                }).start();
              });

            }catch(ex){}
          }
      );
    })
  }


  onSearchCancel(){
    try{
      this.getHymnTitle(this.state.selHymnType, "", this.selRange[this.state.selHymnType]);
      this._flatList.scrollToIndex({animated: false, viewOffset:65, index:0});
    }catch(ex){}
  }

  
  showSetting = (tabDefault: double) => {
    if(tabDefault==null) tabDefault=0;
    this.setState({ isSettingVisible: true, tabDefault: tabDefault });
  }
  hideSetting = () => {
    this.setState({ isSettingVisible: false });
  }

  showSearchBox = () => {
    this.setState({ isSearchBoxVisible: true });
  }
  hideSearchBox = () => {
    this.setState({ isSearchBoxVisible: false });
  }

  searchText(Class_Listing, serachText) {
    Class_Listing.onSearchText(serachText);
  }

  onSearchText = (serachText) => {
    try{
      if(serachText=="") return;
      this.getHymnTitle("", serachText, "");
      this.setState({ searchText: serachText, isSearchBoxVisible: false });
      this._flatList.scrollToIndex({animated: false, viewOffset:65, index:0});
    }catch(ex){}
  }

  onChangeHymnRange= (hymnType, itemValue) => {
    try{
      var range = "";
      if(itemValue!= null && itemValue!="" && itemValue!="all") range=itemValue;

      this.getHymnTitle("", "", range);
      this.selRange[hymnType] = itemValue;
      this._flatList.scrollToIndex({animated: false, viewOffset:65, index:0});
    }catch(ex){}
  }




  _renderFlatItem = ({item}) => (
    <MyListItem 
      navigation={this.props.navigation}
      search_result={this.state.search_result}
      pref={this.state.pref}
      isHighlight_hot={this.isHighlight_Hot(item.code)}
      isHighlight_cool={this.isHighlight_Cool(item.code)}
      isBookmark={this.isBookmark(item.code)}
      refreshDataFromDB={this.refreshDataFromDB}
      searchText={this.searchText}
      Class_Listing={this}

      type={item.type}
      code={item.code}
      name={item.name}
      hymn_num={item.hymn_num}
    />
  );

  render() {
    const animatedStyle ={
      opacity : this.state.fadeAnimation
    }

    if(this.state.isLoading){
      return <View style={[css_common.loading, getTheme(this.props.navigation.getParam("initTheme")).bg_light]}><ActivityIndicator size="small" color={getTheme(this.props.navigation.getParam("initTheme")).bg_dark.backgroundColor} /></View>;
    }

    var tmp_flatlist = (
      <FlatList
        ref={(list) => this._flatList = list}
        data={this.state.search_result}
        renderItem={this._renderFlatItem}
        horizontal={false}
        ListHeaderComponent={()=> {return (<View style={css_hymn_listing.header_space}></View>);}}
        ListFooterComponent={()=> {return (<View style={css_hymn_listing.footer_space}></View>);}}
        ItemSeparatorComponent={()=> {return (<View style={[css_hymn_listing.listItem_space, getTheme(this.state.pref.theme).bg_dark]}></View>);}}
        keyExtractor={(item, index) => index.toString()}
        style={[css_hymn_listing.flatlist]}
        indicatorStyle={getScrollbarColor(this.state.pref.theme).color}
      />);

    if(this.state.search_result.length==0 && this.state.searchText!=""){
      tmp_flatlist = 
      (
        <Text style={getTheme(this.state.pref.theme).text_dark}>找不到符合的詩歌。</Text>
      );
    }

    listing_style = css_listing.container_portrait;
    hymnHeaderBar_container_style = css_listing.hymnHeaderBar_container_portrait;
    hymnHeaderBar_container_style_padding = {};
    flatlist_style = {};
    if(this.state.orientation === 'LANDSCAPE-LEFT' || this.state.orientation === 'LANDSCAPE-RIGHT'){
      listing_style = css_listing.container_landscape;
      hymnHeaderBar_container_style = css_listing.hymnHeaderBar_container_landscape;
      hymnHeaderBar_container_style_padding = css_listing.hymnHeaderBar_container_style_padding;
      flatlist_style = css_common.iphonex_landscape_padding;

      if(Device.isTablet){
        StatusBar.setHidden(false);
      }
      else{
        StatusBar.setHidden(true);
      }
    }
    else{
      StatusBar.setHidden(false);
    }

    return (
      <View style={[css_listing.container, listing_style, getTheme(this.state.pref.theme).bg_light]}>
        <Modal isVisible={this.state.isSearchBoxVisible} animationIn='slideInDown' animationOut='slideOutUp'
        style={css_searchBox.modal}
          onBackButtonPress={this.hideSearchBox} onBackdropPress={this.hideSearchBox}>
          <SearchBox orientation={this.state.orientation} pref={this.state.pref} onSearchText={this.onSearchText} hideSearchBox={this.hideSearchBox} serachText={this.state.serachText} ></SearchBox>
        </Modal>
        <Animated.View style={[css_hymn_listing.container, flatlist_style, animatedStyle]} >
          {tmp_flatlist}
        </Animated.View>

        <View style={[css_listing.hymnHeaderBar_container, hymnHeaderBar_container_style]}>
          <View style={(this.state.searchText==""?{display:'none'}:css_listing.hymnSearchWording_container)}>
            <View style={[css_listing.hymnSearchWording_container2,getTheme(this.state.pref.theme).bg_dark3]}>
              <Text style={[css_listing.hymnSearchWording_title, getTheme(this.state.pref.theme).text_light]}>搜尋：</Text>
              <Text style={[css_listing.hymnSearchWording_text, getTheme(this.state.pref.theme).text_light]}>
                {(this.state.searchText.length>Constant.searchWording_char_limit?this.state.searchText.substring(0,Constant.searchWording_char_limit)+"...":this.state.searchText)}
              </Text>
              <TouchableOpacity style={css_listing.hymnSearchWording_cancel} onPress={() => this.onSearchCancel()} >
                <Image source={require('PecHymn_RNProject/src/assets/images/btn_cancel.png')}  style={css_listing.hymnSearchWording_cancel_img} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={(this.state.searchText==""?css_listing.hymnTypeSel_container: {display:'none'})}>
            
            <View style={[this.state.selHymnType=="hymn_a_data"?[css_listing.hymnTypeSel_container2,getTheme(this.state.pref.theme).bg_dark3, hymnHeaderBar_container_style_padding]:{display:"none"}]}>
              <RNPickerSelect
                  placeholder={{}}
                  items={Constant.hymnFilter["hymn_a_data"]}
                  onValueChange={(value) => {
                    this.onChangeHymnRange("hymn_a_data", value);
                  }}
                  style={{...css_hymnTypeSel_picker}}
                  useNativeAndroidPickerStyle={false}
                  hideIcon={true}
              />
              <Text style={[css_listing.hymnTypeSel_ddl_icon, getTheme(this.state.pref.theme).text_light]}>▼</Text>
            </View>
            <View style={[this.state.selHymnType=="hymn_b_data"?[css_listing.hymnTypeSel_container2,getTheme(this.state.pref.theme).bg_dark3, hymnHeaderBar_container_style_padding]:{display:"none"}]}>
              <RNPickerSelect
                  placeholder={{}}
                  items={Constant.hymnFilter["hymn_b_data"]}
                  onValueChange={(value) => {
                    this.onChangeHymnRange("hymn_b_data", value);
                  }}
                  style={{...css_hymnTypeSel_picker}}
                  useNativeAndroidPickerStyle={false}
                  hideIcon={true}
              />
              <Text style={[css_listing.hymnTypeSel_ddl_icon, getTheme(this.state.pref.theme).text_light]}>▼</Text>
              </View>
            <View style={[this.state.selHymnType=="hymn_c_data"?[css_listing.hymnTypeSel_container2,getTheme(this.state.pref.theme).bg_dark3, hymnHeaderBar_container_style_padding]:{display:"none"}]}>
              <RNPickerSelect
                  placeholder={{}}
                  items={Constant.hymnFilter["hymn_c_data"]}
                  onValueChange={(value) => {
                    this.onChangeHymnRange("hymn_c_data", value);
                  }}
                  style={{...css_hymnTypeSel_picker}}
                  useNativeAndroidPickerStyle={false}
                  hideIcon={true}
              />
              <Text style={[css_listing.hymnTypeSel_ddl_icon, getTheme(this.state.pref.theme).text_light]}>▼</Text>
            </View>
          </View>
        </View>
        <Modal animationIn='fadeIn' animationOut='fadeOut'
          isVisible={this.state.isSettingVisible} onBackButtonPress={this.hideSetting} onBackdropPress={this.hideSetting}>
          <SettingTab pref={this.state.pref} navigation={this.props.navigation} hideSetting={this.hideSetting} tabDefault={this.state.tabDefault} 
            setPreference={this.setPreference} refreshDataFromDB={this.refreshDataFromDB} Class_Listing={this}
          >
          </SettingTab>
        </Modal>
        <View style={css_listing.btn_search_view}>
          <TouchableOpacity style={[css_listing.btn_search, getTheme(this.state.pref.theme).bg_dark3]} onPress={() => this.showSearchBox()} >
            <Image source={require('PecHymn_RNProject/src/assets/images/btn_search.png')}  style={css_listing.btn_search_img} />
          </TouchableOpacity>
        </View>
        <Toolbar pref={this.state.pref} onChangeHymnType={this.onChangeHymnType} showSetting={this.showSetting} 
          showSearchBox={this.showSearchBox} hideSearchBox={this.hideSearchBox} orientation={this.state.orientation}>
        </Toolbar>
      </View>
    );
  }

}



class MyListItem extends React.PureComponent {

  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this);
  }

  _onPress = () => {
    this.props.navigation.navigate('Detail', {
      pref : this.props.pref,
      search_result : this.props.search_result,
      code: this.props.code,
      refreshDataFromDB: this.props.refreshDataFromDB,
      searchText: this.props.searchText,
      Class_Listing: this.props.Class_Listing,
    });
  };

  getFilteredIcon(){
    if(this.props.isBookmark){
        return (
          <View style={[css_hymn_listing.listItem_bookmark_3]}>
            <Image source={require('PecHymn_RNProject/src/assets/images/btn_myfav_on.png')}  style={css_hymn_listing.listItem_img_3} />
          </View>
        )
    }
    else if(this.props.isHighlight_hot){
        return (
          <Image source={require('PecHymn_RNProject/src/assets/images/ico_fire_hot_bg.png')}  style={css_hymn_listing.listItem_img_3} />
        )
    }
    else if(this.props.isHighlight_cool){
      return (
        <Image source={require('PecHymn_RNProject/src/assets/images/ico_fire_cool_bg.png')}  style={css_hymn_listing.listItem_img_3} />
      )
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={[css_hymn_listing.listItem]} onPress={this._onPress}>
          <View style={[css_hymn_listing.listItem_1]}>
            <Text style={[css_hymn_listing.listItem_text_1, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).listing_hymntype]}>{HymnType2Name(this.props.type)}{this.props.hymn_num}</Text>
          </View>
          <View style={[css_hymn_listing.listItem_2]}>
            <Text style={[css_hymn_listing.listItem_text_2, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).listing_text]}>
            {this.props.pref.lang=="SC"?ConvertText(this.props.name, 'gb'):this.props.name}
            </Text>
          </View>
          <View style={[css_hymn_listing.listItem_3]}>
            {this.getFilteredIcon()}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}