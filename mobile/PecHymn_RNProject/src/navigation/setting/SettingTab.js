import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Dimensions, Image, Animated} from 'react-native';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const Constant = require('PecHymn_RNProject/src/data/constant');

import {ConvertText} from 'PecHymn_RNProject/src/lib/ConvertText';

import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_setting} from 'PecHymn_RNProject/src/styles/setting_css';

import MyFav from 'PecHymn_RNProject/src/navigation/setting/MyFav';
import History from 'PecHymn_RNProject/src/navigation/setting/History';
import Settings from 'PecHymn_RNProject/src/navigation/setting/Settings';


export default class SettingTab extends React.Component {
  
  constructor(props) {
    super(props);
    this.props.hideSetting = this.props.hideSetting.bind(this);
    this.props.setPreference = this.props.setPreference.bind(this);

    this.state = {
      index: this.props.tabDefault,
      routes: [
        {key: "SettingBookmark", title: "我的最愛", icon: "btn_myfav_on.png"},
        {key: "SettingHistory", title:"瀏覽記錄", icon: "btn_history.png"},
        {key: "SettingSettings", title: "設定", icon: "btn_setting.png"},
      ],
    };
  }

  
  onHideSettingPress(){
    this.props.hideSetting();
  }
  

  renderScene = ({ route }) => {
    switch (route.key) {
      case "SettingBookmark":
        return <View style={[css_setting.container]}><MyFav pref={this.props.pref} navigation={this.props.navigation} hideSetting={this.props.hideSetting} refreshDataFromDB={this.props.refreshDataFromDB} Class_Listing={this.props.Class_Listing} /></View>;
      case "SettingHistory":
      return <View style={[css_setting.container]}><History pref={this.props.pref} navigation={this.props.navigation} hideSetting={this.props.hideSetting} refreshDataFromDB={this.props.refreshDataFromDB} Class_Listing={this.props.Class_Listing} /></View>;
        case "SettingSettings":
        return <View style={[css_setting.container]}><Settings pref={this.props.pref} hideSetting={this.props.hideSetting} setPreference={this.props.setPreference} refreshDataFromDB={this.props.refreshDataFromDB} Class_Listing={this.props.Class_Listing} /></View>;
      default:
        return null;
    }
  };

  _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={css_setting.tabBar_container}>
        {props.navigationState.routes.map((route, i) => {

          var themeBG = getTheme(this.props.pref.theme).bg_dark.backgroundColor;
          var oriBG = css_setting.tabItem_container.backgroundColor;
          
          const backgroundColor = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(
              inputIndex => (inputIndex === i ? themeBG : oriBG)
            ),
          });

          var img_src = null;
          if(i==0)
            img_src = <Image style={css_setting.tabItem_img} source={require('PecHymn_RNProject/src/assets/images/btn_myfav_on.png')} />;
          else if(i==1)
            img_src = <Image style={css_setting.tabItem_img} source={require('PecHymn_RNProject/src/assets/images/btn_history.png')} />;
          else if(i==2)
            img_src = <Image style={css_setting.tabItem_img} source={require('PecHymn_RNProject/src/assets/images/btn_setting.png')} />;



          return (
            <TouchableOpacity style={css_setting.tabItem} key={route.key} onPress={() => this.setState({ index: i })} activeOpacity={0.75}>
              <Animated.View style={[css_setting.tabItem_container, {backgroundColor}]}>
                <View style={css_setting.tabItem_img_container}>
                  {img_src}
                </View>
                <Text style={[css_setting.tabItem_text, getTheme(this.props.pref.theme).text_light]}>{route.title}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
          
        })}
        <TouchableOpacity style={css_setting.closeItem} onPress={() => this.onHideSettingPress()} activeOpacity={0.75}>
          <Image source={require('PecHymn_RNProject/src/assets/images/btn_close.png')}  style={css_setting.closeItem_img} />
        </TouchableOpacity>
      </View>
    );
  };
    
  render() {
    return (
      <TabView 
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={index => this.setState({ index })}
        swipeVelocityThreshold={2400}
      />
    );
  }

}