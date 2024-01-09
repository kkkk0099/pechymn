import React, {Component} from 'react';
import { Alert, TouchableOpacity, View, StyleSheet, Button, Dimensions, Text, Image } from 'react-native';

import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_common, css_toolbar} from 'PecHymn_RNProject/src/styles/common_css';

export default class Toolbar extends React.Component {


  constructor(props) {
    super(props)

    this.props.onChangeHymnType = this.props.onChangeHymnType.bind(this);
    this.props.showSetting = this.props.showSetting.bind(this);
    this.props.showSearchBox = this.props.showSearchBox.bind(this);
    this.props.hideSearchBox = this.props.hideSearchBox.bind(this);

    if(this.props.pref.show_c=="0" && this.props.pref.sel_hymntyype=="hymn_c_data"){
      this.props.pref.sel_hymntyype="hymn_a_data";
    }

    this.state = {
        selHymnType: this.props.pref.sel_hymntyype,
    };

  }

  componentWillUnmount(){
  }

  onHymnBtnPress(hymnType){
    this.setState({
        selHymnType: hymnType,
    });

    this.props.onChangeHymnType(hymnType);
  }

  getHymnBtnStyle(type,section){
    if(type=="hymn_c_data"){
      if(this.props.pref.show_c=="0"){
        return {display: 'none'};
      }

      if(section=="text"){
        return this.state.selHymnType==type?[css_toolbar.hymn_btn_txt_active,getTheme(this.props.pref.theme).text_dark2]:css_toolbar.hymn_btn_txt;
      }else{
        return [css_toolbar.hymn_btn, (this.state.selHymnType==type?css_toolbar.hymn_btn_active:null)];
      }
    }else{
      if(section=="text"){
        return this.state.selHymnType==type?[css_toolbar.hymn_btn_txt_active,getTheme(this.props.pref.theme).text_dark2]:css_toolbar.hymn_btn_txt;
      }else{
        return [css_toolbar.hymn_btn, (this.state.selHymnType==type?css_toolbar.hymn_btn_active:null)];
      }
    }
  }

  render() {
    toolbar_style = css_toolbar.toolbar_portrait;
    if(this.props.orientation === 'LANDSCAPE-LEFT' || this.props.orientation === 'LANDSCAPE-RIGHT'){
      toolbar_style = css_toolbar.toolbar_landscape;
    }

    return (
      <View style={[css_toolbar.toolbar, toolbar_style, getTheme(this.props.pref.theme).bg_dark]}>
        <TouchableOpacity
          style={this.getHymnBtnStyle("hymn_a_data", "")}
          onPress={() => this.onHymnBtnPress('hymn_a_data')}
        >
          <Text style={this.getHymnBtnStyle("hymn_a_data", "text")}>平</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={this.getHymnBtnStyle("hymn_b_data", "")}
          onPress={() => this.onHymnBtnPress('hymn_b_data')}
          >
          <Text style={this.getHymnBtnStyle("hymn_b_data", "text")}>敬</Text>
          </TouchableOpacity>
        <TouchableOpacity
          style={this.getHymnBtnStyle("hymn_c_data", "")}
          onPress={() => this.onHymnBtnPress('hymn_c_data')}
          >
          <Text style={this.getHymnBtnStyle("hymn_c_data", "text")}>詩</Text>
          </TouchableOpacity>
        <View style={css_toolbar.toolbar_space}><Text> </Text></View>
        <TouchableOpacity
          style={css_toolbar.btn_myfav}
          onPress={() => this.props.showSetting(0)}
          >
          <Image source={require('PecHymn_RNProject/src/assets/images/btn_myfav_on.png')}  style={css_toolbar.btn_myfav_img} />
        </TouchableOpacity>
        <TouchableOpacity
          style={css_toolbar.btn_history}
          onPress={() => this.props.showSetting(1)}
          >
          <Image source={require('PecHymn_RNProject/src/assets/images/btn_history.png')}  style={css_toolbar.btn_history_img} />
        </TouchableOpacity>
        <TouchableOpacity
          style={css_toolbar.btn_setting}
          onPress={() => this.props.showSetting(2)}
          >
          <Image source={require('PecHymn_RNProject/src/assets/images/btn_setting.png')}  style={css_toolbar.btn_setting_img} />
        </TouchableOpacity>
      </View>
    );
  }
}