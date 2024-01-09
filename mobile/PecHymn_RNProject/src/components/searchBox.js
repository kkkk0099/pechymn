import React, {Component} from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_common, css_searchBox} from 'PecHymn_RNProject/src/styles/common_css';



export default class SearchBox extends React.PureComponent {


    constructor(props) {
        super(props)
        this.props.hideSearchBox = this.props.hideSearchBox.bind(this);

        this.state = {
            searchText: this.props.sreachText,
        };
    }

    componentWillUnmount(){
    }

    onSearchText(text){
        this.setState({
            searchText: text,
        });
        this.props.onSearchText(text);
    }

    render() {
        searchBox_style = css_searchBox.container_portrait;
        if(this.props.orientation === 'LANDSCAPE-LEFT' || this.props.orientation === 'LANDSCAPE-RIGHT'){
            searchBox_style = css_searchBox.container_landscape;
        }

        return (
        <View style={[css_searchBox.container, searchBox_style, getTheme(this.props.pref.theme).bg_dark]}>
            <TextInput
                style={css_searchBox.textInput}
                onSubmitEditing={(event) => this.onSearchText(event.nativeEvent.text)}
                autoFocus={true}
                defaultValue={this.state.searchText}
                placeholder="曲目 / 歌詞搜尋 🔍"
            />
            <TouchableOpacity onPress={this.props.hideSearchBox} style={css_searchBox.btnCancel}>
              <View>
                <Text style={[css_searchBox.btnCancelText, getTheme(this.props.pref.theme).text_light]}>取消</Text>
              </View>
            </TouchableOpacity>
        </View>
        );
    }
}