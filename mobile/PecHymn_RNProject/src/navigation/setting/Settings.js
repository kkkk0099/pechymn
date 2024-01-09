import React, {Component} from 'react';
import {Alert, Platform, ScrollView, Text, View, Linking, Slider, TouchableOpacity, Switch, Image} from 'react-native';

const Constant = require('PecHymn_RNProject/src/data/constant');

import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_setting, css_setting_settings} from 'PecHymn_RNProject/src/styles/setting_css';

import {getPreference, updatePreference} from 'PecHymn_RNProject/src/lib/DBHelper';
import {ToString} from 'PecHymn_RNProject/src/lib/commonFunc';



export default class Settings extends React.Component {
    

    constructor(props) {
      super(props);

      this.onChangeTheme = this.onChangeTheme.bind(this);
      this.onChangeFontSize = this.onChangeFontSize.bind(this);
      this.onChangeShowC = this.onChangeShowC.bind(this);
      this.gotoWebsite = this.gotoWebsite.bind(this);
      this.props.setPreference = this.props.setPreference.bind(this);
      


    }

    async onChangeTheme(theme){
        updatePreference("theme", theme).then((result) => {
                this.props.pref.theme = theme;
                this.props.setPreference(this.props.pref);
            }
        );
    }

    async onChangeFontSize(fontSize){
        updatePreference("fontSize", fontSize).then((result) => {
                this.props.pref.fontSize = fontSize;
                this.props.setPreference(this.props.pref);
            }
        );
    }

    async onChangeShowC(show_c){
        var showC_val = show_c? "1": "0";
        updatePreference("show_c", showC_val).then((result) => {
                this.props.pref.show_c = showC_val;
                this.props.setPreference(this.props.pref);
            }
        );
    }

    gotoWebsite = () => {
        Linking.canOpenURL(Constant.domain_prefix).then(supported => {
            if (supported) {
                Linking.openURL(Constant.domain_prefix);
            } else {
            }
        });
    };

    versionToDisplayDate(version){
        version = String(version);
        var display_date = version;

        if(version.length==14){
            display_date = version.substring(0,4) + "." + version.substring(4,6) + "." + version.substring(6,8);
        }

        return display_date;
    }

    render() {
        return (
            <ScrollView contentContainerStyle={[css_setting_settings.container, getTheme(this.props.pref.theme).bg_light2]} >
                <View style={[css_setting_settings.region, {height: 290}]}>
                    <View style={css_setting_settings.row_space}></View>
                    <View style={[css_setting_settings.row, {flex: 3}]}>
                        <View style={css_setting_settings.col_key} >
                            <Text style={css_setting_settings.col_key_txt}>主題</Text>
                        </View>
                        <View style={{flex:2, flexDirection:'column'}}>
                            <View style={[css_setting_settings.col_value, {justifyContent:'space-around', flexWrap:'wrap'}]}>
                                <TouchableOpacity style={[css_setting_settings.btn_theme, {backgroundColor:'#ffbf00'}]} onPress={() => this.onChangeTheme('yellow')}>
                                    <Text style={[css_setting_settings.col_value_txt, css_setting_settings.btn_theme_txt]}>黃</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[css_setting_settings.btn_theme, {backgroundColor:'#0080ff'}]} onPress={() => this.onChangeTheme('blue')}>
                                    <Text style={[css_setting_settings.col_value_txt, css_setting_settings.btn_theme_txt]}>藍</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[css_setting_settings.btn_theme, {backgroundColor:'#e60000'}]} onPress={() => this.onChangeTheme('red')}>
                                    <Text style={[css_setting_settings.col_value_txt, css_setting_settings.btn_theme_txt]}>紅</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[css_setting_settings.col_value, {justifyContent:'space-around', flexWrap:'wrap', paddingTop: 20}]}>
                                <TouchableOpacity style={[css_setting_settings.btn_theme, {backgroundColor:'#d5d5d5'}]} onPress={() => this.onChangeTheme('white')}>
                                    <Text style={[css_setting_settings.col_value_txt, css_setting_settings.btn_theme_txt, {color: '#000000'}]}>白</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[css_setting_settings.btn_theme, {backgroundColor:'#2eb82e'}]} onPress={() => this.onChangeTheme('green')}>
                                    <Text style={[css_setting_settings.col_value_txt, css_setting_settings.btn_theme_txt]}>綠</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[css_setting_settings.btn_theme, {backgroundColor:'#9933ff'}]} onPress={() => this.onChangeTheme('purple')}>
                                    <Text style={[css_setting_settings.col_value_txt, css_setting_settings.btn_theme_txt]}>紫</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[css_setting_settings.col_value, {justifyContent:'space-around', flexWrap:'wrap', paddingTop: 20}]}>
                                <TouchableOpacity style={[css_setting_settings.btn_theme, {backgroundColor:'#333333'}]} onPress={() => this.onChangeTheme('black')}>
                                    <Text style={[css_setting_settings.col_value_txt, css_setting_settings.btn_theme_txt]}>黑</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={css_setting_settings.row_space}></View>
                    <View style={[css_setting_settings.row]}>
                        <View style={css_setting_settings.col_key} >
                            <Text style={css_setting_settings.col_key_txt}>字型</Text>
                        </View>
                        <View style={css_setting_settings.col_value}>
                            <Text style={css_setting_settings.col_key_txt}>小</Text>
                            <Slider
                            style={{flex: 1, width: "100%"}}
                                maximumValue={9}
                                minimumValue={2}
                                step={1}
                                value={parseFloat(this.props.pref.fontSize)}
                                onValueChange={value => this.onChangeFontSize(value.toString())}
                            />
                            <Text style={css_setting_settings.col_key_txt}>大</Text>
                        </View>
                    </View>
                    <View style={css_setting_settings.row_space}></View>
                    <View style={css_setting_settings.row}>
                        <View style={css_setting_settings.col_key} >
                            <Text style={css_setting_settings.col_key_txt}>詩歌集</Text>
                        </View>
                        <View style={css_setting_settings.col_value}>
                            <Switch
                                onValueChange = {this.onChangeShowC}
                                value = {this.props.pref.show_c=="1"?true:false}/>
                        </View>
                    </View>
                    <View style={css_setting_settings.row_space}></View>
                </View>
                <View style={[css_setting_settings.region, {height: 150}]}>
                    <View style={css_setting_settings.row_space}></View>
                    <View style={css_setting_settings.row}>
                        <View style={css_setting_settings.col_key} >
                            <Text style={css_setting_settings.col_key_txt}>程式版本</Text>
                        </View>
                        <View style={css_setting_settings.col_value}>
                            <Text style={css_setting_settings.col_value_txt}>{ToString(this.props.pref.version)}{(ToString(this.props.pref.version).length==1?".0":(ToString(this.props.pref.version).length==3?"0":""))}</Text>
                        </View>
                    </View>
                    <View style={css_setting_settings.row_space}></View>
                    <View style={css_setting_settings.row}>
                        <View style={css_setting_settings.col_key} >
                            <Text style={css_setting_settings.col_key_txt}>歌詞版本</Text>
                        </View>
                        <View style={css_setting_settings.col_value}>
                            <Text style={css_setting_settings.col_value_txt}>{this.versionToDisplayDate(this.props.pref.OTA_version)}</Text>
                        </View>
                    </View>
                    <View style={css_setting_settings.row_space}></View>
                    <View style={css_setting_settings.row}>
                        <View style={css_setting_settings.col_key} >
                            <Text style={css_setting_settings.col_key_txt}>熱門列表版本</Text>
                        </View>
                        <View style={css_setting_settings.col_value}>
                            <Text style={css_setting_settings.col_value_txt}>{this.versionToDisplayDate(this.props.pref.highlight_version)}</Text>
                        </View>
                    </View>
                    <View style={css_setting_settings.row_space}></View>
                </View>
                <View style={[css_setting_settings.region, {height: 50}]}>
                    <View style={css_setting_settings.row_space}></View>
                    <View style={[css_setting_settings.row, {paddingRight:0}]}>
                        <View style={[css_setting_settings.col_value, css_setting_settings.one_row]}>
                            <TouchableOpacity onPress={() => this.gotoWebsite()} style={{width:'100%', flexDirection:'row', }}>
                                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={[css_setting_settings.col_key_txt]}>網址</Text>
                                    <Text style={[css_setting_settings.col_value_txt, {paddingRight: 10}]}>{Constant.domain_prefix}</Text>
                                </View>
                                <View style={{width: 20, alignSelf:'flex-end'}}>
                                    <Text style={[css_setting_settings.arrow, {color: '#AAAAAA'}]}>＞</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={css_setting_settings.row_space}></View>
                </View>
                <View style={[{height:70}]}></View>
            </ScrollView>
        );
      }
}