import React, {Component} from 'react';
import {ActivityIndicator, View, StatusBar, Text} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

const Constant = require('PecHymn_RNProject/src/data/constant');

import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_common} from 'PecHymn_RNProject/src/styles/common_css';

import {initDB, OTA_highlight, OTA_hymn, api_regUser, api_sel_song} from 'PecHymn_RNProject/src/lib/DBHelper';

import {HymnType2Name} from 'PecHymn_RNProject/src/lib/Translate';

import Listing from 'PecHymn_RNProject/src/navigation/listing/Listing';
import Detail from 'PecHymn_RNProject/src/navigation/detail/Detail';



export default class App extends React.Component {


  constructor(props) {
    super(props);

    StatusBar.setBarStyle('light-content', true);

    this.state = {
      isLoading: true,
      theme: "",
    };

    let that = this;

    initDB().then(
      (response)=>{
        
        StatusBar.setBackgroundColor(getTheme(response.initPref.theme).bg_dark.backgroundColor);
        
        that.setState({
          theme: response.initPref.theme,
        },()=>{

          OTA_highlight(response.initPref.highlight_version).then(()=>{

            OTA_hymn(response.initPref.OTA_version).then(()=>{

              api_regUser(response.initPref).then(()=>{

                that.endLoading(that);

              }).catch(err => { that.endLoading(that); });


            }).catch(err => { that.endLoading(that); });
  
          }).catch(err => { that.endLoading(that); });

        });
        
      }
    ).catch(err => {});
  }

  endLoading(that){
    that.setState({
      isLoading: false,
    })
  }

  render() {
    //return <View><Text selectable={true}>1: {this.state.resp}</Text></View>
    if(this.state.isLoading && this.state.theme!=""){
      return <View style={[css_common.loading, getTheme(this.state.theme).bg_light]}><ActivityIndicator size="small" color={getTheme(this.state.theme).bg_dark.backgroundColor} /></View>
    }else if(this.state.isLoading){
      return <View></View>
    }


    const AppNavigator = createStackNavigator(
      {
        Listing: {screen: Listing, params:{initTheme: this.state.theme}},
        Detail: Detail,
      },
      {
        initialRouteName: "Listing"
      },
      { headerMode: 'screen' }
    );
    const NavContainer = createAppContainer(AppNavigator);

    return (
      <NavContainer navigation={this.props.navigation}></NavContainer>
    );
  }

}

