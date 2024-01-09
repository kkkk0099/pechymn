import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput, Image} from 'react-native';

const Constant = require('PecHymn_RNProject/src/data/constant');

import {getTheme, getFontSize, getScrollbarColor} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_setting, css_setting_myfav} from 'PecHymn_RNProject/src/styles/setting_css';

import {getBookmark} from 'PecHymn_RNProject/src/lib/DBHelper';
import {HymnType2Name} from 'PecHymn_RNProject/src/lib/Translate';
import {ConvertText} from 'PecHymn_RNProject/src/lib/ConvertText';



export default class MyFav extends React.Component {

    tmp_theme = "";
    tmp_fontSize = "";

    constructor(props) {
      super(props);

      this.state = {
        search_result: [],
      };

      this.getMyFav();
    }

    async getMyFav(){

        tmp_search_result = await getBookmark();


        this.setState(previousState => ({
            search_result: tmp_search_result,
        }));

    }

    _renderFlatItem = ({item}) => (
        <MyListItem 
          pref={this.props.pref}
          navigation={this.props.navigation}
          search_result={this.state.search_result}
          hideSetting={this.props.hideSetting}
          refreshDataFromDB={this.props.refreshDataFromDB}
          Class_Listing={this.props.Class_Listing}
    
          type={item.type}
          code={item.code}
          name={item.name}
          hymn_num={item.hymn_num}
        />
      );


    render() {
      if(this.state.search_result.length==0){
        return (
          <View style={[css_setting_myfav.container, getTheme(this.props.pref.theme).bg_light]} >
              <Text style={getTheme(this.props.pref.theme).text_dark}>快點把詩歌加到「我的最愛」吧!</Text>
          </View>
        )
      }

      if(this.tmp_theme!=this.props.pref.theme || this.tmp_fontSize!=this.props.pref.fontSize){
        this.tmp_theme = this.props.pref.theme;
        this.tmp_fontSize = this.props.pref.fontSize;
        this.getMyFav();
      }

        return (
            <View style={[css_setting_myfav.container, getTheme(this.props.pref.theme).bg_light]} >
                <FlatList
                ref={(list) => this._flatList = list}
                data={this.state.search_result}
                renderItem={this._renderFlatItem}
                horizontal={false}
                ListFooterComponent={()=> {return (<View style={css_setting_myfav.footer_space}></View>);}}
                ItemSeparatorComponent={()=> {return (<View style={[css_setting_myfav.listItem_space, getTheme(this.props.pref.theme).bg_dark]}></View>);}}
                keyExtractor={(item, index) => index.toString()}
                style={[css_setting_myfav.flatlist]}
                indicatorStyle={getScrollbarColor(this.props.pref.theme).color}
                />
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
        this.props.hideSetting();
        this.props.navigation.navigate('Detail', {
          pref : this.props.pref,
          search_result : this.props.search_result,
          code: this.props.code,
          refreshDataFromDB: this.props.refreshDataFromDB,
          Class_Listing: this.props.Class_Listing,
        });
    };
  
    render() {
      return (
        <View style={[css_setting_myfav.listItem_container]}>
          <TouchableOpacity style={[css_setting_myfav.listItem]} onPress={this._onPress}>
            <View style={[css_setting_myfav.listItem_1]}>
              <Text style={[css_setting_myfav.listItem_text_1, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).listing_hymntype]}>{HymnType2Name(this.props.type)}{this.props.hymn_num}</Text>
            </View>
            <View style={[css_setting_myfav.listItem_2]}>
              <Text style={[css_setting_myfav.listItem_text_2, getTheme(this.props.pref.theme).text_dark, getFontSize(this.props.pref.fontSize).listing_text]}>
              {this.props.pref.lang=="SC"?ConvertText(this.props.name, 'gb'):this.props.name}
              </Text>
            </View>
            <View style={[css_setting_myfav.listItem_3]}>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }