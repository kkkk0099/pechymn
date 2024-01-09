import React, {Component} from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import {css_errorReportBox} from 'PecHymn_RNProject/src/styles/content_css';

import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';


export default class ErrorReportBox extends React.PureComponent {


    constructor(props) {
        super(props)
        this.props.hideErrorReportBox = this.props.hideErrorReportBox.bind(this);

        this.state = {
            searchText: "",
        };
    }

    componentWillUnmount(){
    }

    onErrorReportSubmit(text){
        this.props.onErrorReportSubmit(text);
    }

    render() {
        return (
        <View style={[css_errorReportBox.container, getTheme(this.props.pref.theme).bg_dark]}>
            <View style={css_errorReportBox.title_container}>
                <Text style={getTheme(this.props.pref.theme).text_light}>({this.props.hymn_num}) {this.props.title}</Text>
            </View>
            <View style={css_errorReportBox.input_container}>
                <TextInput
                    style={css_errorReportBox.textInput}
                    onSubmitEditing={(event) => this.onErrorReportSubmit(event.nativeEvent.text)}
                    autoFocus={true}
                    defaultValue={this.state.searchText}
                    placeholder="請輸入回報內容 (例如:歌詞錯誤)"
                />
                <TouchableOpacity onPress={this.props.hideErrorReportBox} style={css_errorReportBox.btnCancel}>
                <View>
                    <Text style={[css_errorReportBox.btnCancelText, getTheme(this.props.pref.theme).text_light]}>取消</Text>
                </View>
                </TouchableOpacity>
            </View>
        </View>
        );
    }
}