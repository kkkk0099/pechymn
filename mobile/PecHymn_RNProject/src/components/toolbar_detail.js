import React, {Component} from 'react';
import { Alert, TouchableOpacity, View, StyleSheet, Button, Dimensions, Text, Image } from 'react-native';

import {getHymnDetail} from 'PecHymn_RNProject/src/lib/DBHelper';


import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_common} from 'PecHymn_RNProject/src/styles/common_css';
import {css_toolbar_detail} from 'PecHymn_RNProject/src/styles/content_css';

export default class Toolbar_Detail extends React.Component {


  constructor(props) {
    super(props)

    this.props.goBack = this.props.goBack.bind(this);
    this.changeLang = this.changeLang.bind(this);


    this.state = {
      isLoading: true,
      hymn_code: this.props.hymn_code,
      lang: this.props.lang,
    };

    this.updateHymnDetail();
  }

  async updateHymnDetail(){
    let that = this;
    getHymnDetail(this.props.hymn_code).then(
      function(tmp_hymn_detail){
        var tmp_lang = that.props.lang;

        if(that.state.lang=="EN" && tmp_hymn_detail.content_en==""){
          tmp_lang = that.props.pref.lang;
        }


        that.setState({
          isLoading: false,
          hymn_detail: tmp_hymn_detail,
          lang: tmp_lang,
        });

        that.props.changeLang(tmp_lang);
      }
    )
  }

  enableEN(){
    if(!this.state.isLoading && this.state.hymn_detail.content_en!=""){
      return true;
    }else{
      return false;
    }
  }

  changeLang(lang){
    if(lang!="EN" ) this.props.pref.lang = lang;
    
    this.setState(
      {
        lang: lang,
      }, 
      ()=>{
        this.props.changeLang(lang);
      }
    );
  }
  
  render() {
    var toolbar_style=css_toolbar_detail.toolbar_portrait;
    if(this.props.orientation === 'LANDSCAPE-LEFT' || this.props.orientation === 'LANDSCAPE-RIGHT'){
      toolbar_style=css_toolbar_detail.toolbar_landscape;
    }

    return (
      <View style={[css_toolbar_detail.toolbar, toolbar_style, getTheme(this.props.pref.theme).bg_dark]}>
        <TouchableOpacity 
           style={css_toolbar_detail.back_btn}
          onPress={() => this.props.goBack()}
        >
          <Image source={require('PecHymn_RNProject/src/assets/images/btn_back_txt.png')}  style={css_toolbar_detail.back_btn_img} />
        </TouchableOpacity>

        <View style={css_toolbar_detail.toolbar_space}></View>
        <View style={css_toolbar_detail.container_lang}>
          <TouchableOpacity 
            style={this.state.lang=="TC"?[css_toolbar_detail.lang_btn_active]: css_toolbar_detail.lang_btn }
            onPress={() => this.changeLang("TC")}
          >
            <Text style={this.state.lang=="TC"?[css_toolbar_detail.lang_btn_txt, getTheme(this.props.pref.theme).text_dark2]: [css_toolbar_detail.lang_btn_txt, getTheme(this.props.pref.theme).text_light]}>繁</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={this.state.lang=="SC"?[css_toolbar_detail.lang_btn_active]: css_toolbar_detail.lang_btn }
            onPress={() => this.changeLang("SC")}
          >
            <Text style={this.state.lang=="SC"?[css_toolbar_detail.lang_btn_txt, getTheme(this.props.pref.theme).text_dark2]: [css_toolbar_detail.lang_btn_txt, getTheme(this.props.pref.theme).text_light]}>簡</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={this.enableEN()? (this.state.lang=="EN"?[css_toolbar_detail.lang_btn_active]: css_toolbar_detail.lang_btn) :css_toolbar_detail.lang_btn_disabled}
            onPress={() => this.changeLang("EN")}
            disabled={!this.enableEN()}
          >
            <Text style={this.state.lang=="EN"?[css_toolbar_detail.lang_btn_txt, getTheme(this.props.pref.theme).text_dark2]: [css_toolbar_detail.lang_btn_txt, getTheme(this.props.pref.theme).text_light]}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}