import React, {Component} from 'react';
import { View, AppState, TouchableOpacity, Text, Image } from 'react-native';

import { isTablet } from 'react-native-device-detection'
import VolumeControl, {VolumeControlEvents} from "react-native-volume-control";

import {getTheme} from 'PecHymn_RNProject/src/styles/theme_css';
import {css_common, css_musicBox} from 'PecHymn_RNProject/src/styles/common_css';

import {numPad} from 'PecHymn_RNProject/src/lib/commonFunc';

SoundPlayer = null;


export default class MusicBox extends React.Component {

    myTimer = null;


    constructor(props) {
        super(props)
        this.playSong = this.playSong.bind(this);
        this.replaySong = this.replaySong.bind(this);
        this.stopSong = this.stopSong.bind(this);
        this.loopSong = this.loopSong.bind(this);

        SoundPlayer = this.props.SoundPlayer;

        this.state = {
            fileName: "",
            isValid: 0,
            play_status: 0,
            loop: true,
            appState: AppState.currentState,
            duration: "0:00",
            currentTime: "0:00",
            volume: 0
        };
    }

    async componentDidMount() {
        /*SoundPlayer.onFinishedPlaying((success: boolean) => { // success is true when the sound is played
            console.log('finished playing', success);
            if(this.state.loop){
                SoundPlayer.playSoundFile(fileName, 'mp3');
            }
        });
        SoundPlayer.onFinishedLoading(async (success: boolean) => {
            if(!success){
                this.setState({
                    isValid: 0,
                    fileName: "",
                });
            }
        });*/

        AppState.addEventListener('change', this._handleAppStateChange);

        this.myTimer = setInterval(()=>{
            if(this.state.isValid==1 && this.state.fileName!="" && this.state.play_status==1){
                this.getInfo();
            }
        }, 1000);

        this.setState({
            volume: await VolumeControl.getVolume()
        });
       
          // Add and store event listener
        this.volEvent = VolumeControlEvents.addListener(
            "VolumeChanged",
            this.volumeEvent
        );
    }
    
    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
        SoundPlayer.unmount();
        clearInterval(this.myTimer);
        if(this.volEvent!=undefined) this.volEvent.remove();
    }

    volumeEvent = event => {
        this.setState({ volume: event.volume });
    };

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        }else{
            if(this.state.play_status==1){
                this.stopSong();
            }
        }
        this.setState({appState: nextAppState});
    };

    updateFileName(){
        var fileName = "";
        if(this.props.type=="hymn_a_data"){
            fileName = "p" + numPad(this.props.hymn_num, 3);
        }else if(this.props.type=="hymn_b_data"){
            fileName = "w" + numPad(this.props.hymn_num, 3);
        }

        if(fileName!=""){
            SoundPlayer.loadSoundFile(fileName, 'mp3');

            this.getInfo();
            
            //SoundPlayer.stop();
            this.setState({
                isValid: 1,
                fileName: fileName,
            });
        }
    }

    playSong(){
        try {
            if(this.state.play_status==0){
                SoundPlayer.play();
                if(this.state.volume<0.1){
                    VolumeControl.change(0.3);
                }
                this.setState({
                    play_status: 1,
                });
            }else{
                SoundPlayer.pause();
                this.setState({
                    play_status: 0,
                });
            }
        } catch (e) {
        }
    }

    replaySong(){
        try {
            SoundPlayer.playSoundFile(this.state.fileName, 'mp3');
            this.setState({
                play_status: 1,
            });
        } catch (e) {
        }
    }

    stopSong() {
      try {
        SoundPlayer.stop();
        SoundPlayer.loadSoundFile(this.state.fileName, 'mp3');
        this.getInfo();
        this.setState({
          play_status: 0,
        });
      } catch (e) {
      }
    }

    loopSong() {
        try {
            this.setState(prevState => ({
                loop: !prevState.loop
            }));
            
        } catch (e) {
        }
    }

    getInfo() {
        try {
            
            SoundPlayer.getInfo().then((info)=>{
                if(info.duration!=null && info.currentTime!=null){
                    var duration = Math.ceil(info.duration);
                    var currentTime = Math.ceil(info.currentTime);

                    var duration_m = Math.floor(duration / 60);
                    var duration_s = Math.floor(duration % 60);
                    var currentTime_m = Math.floor(currentTime / 60);
                    var currentTime_s = Math.floor(currentTime % 60);

                    duration_s = numPad(duration_s, 2);
                    currentTime_s = numPad(currentTime_s, 2);


                    this.setState({
                        duration: duration_m + ":" + duration_s,
                        currentTime: currentTime_m + ":" + currentTime_s,
                    });

                }
            })
        
        } catch (e) {
            console.log('There is no song playing', e)
        }
    }

    render() {

        if(this.props.type==null){
            return null;
        }
        if(this.props.type=="hymn_c_data"){
            return null;
        }

        if(this.props.musicBoxEnable && this.state.isValid==0){
            this.updateFileName();
        }else if(!this.props.musicBoxEnable){
            this.state.isValid=0;
            this.state.play_status=0;
            SoundPlayer.unmount();
        }

        var button_style = this.state.isValid==1?css_musicBox.btn_common_img:[css_musicBox.btn_common_img, css_musicBox.btn_common_img_invalid];

        var view_style={};
        if(this.props.orientation === 'LANDSCAPE-LEFT' || this.props.orientation === 'LANDSCAPE-RIGHT'){
          if(!isTablet) view_style={display: 'none'};
        }

        return (
        <View style={[css_musicBox.container, getTheme(this.props.pref.theme).bg_dark2, view_style]}>
            <View style={css_musicBox.container2}>
                <TouchableOpacity  style={css_musicBox.btn_common} onPress={this.replaySong}>
                    <Image source={require('PecHymn_RNProject/src/assets/images/music_replay_on.png')}  style={button_style} />
                </TouchableOpacity>
                <TouchableOpacity  style={css_musicBox.btn_common} onPress={this.playSong}>
                    <Image source={require('PecHymn_RNProject/src/assets/images/music_play.png')}  style={this.state.play_status==0? button_style : css_musicBox.btn_common_img_inactive} />
                    <Image source={require('PecHymn_RNProject/src/assets/images/music_pause.png')}  style={this.state.play_status==0?css_musicBox.btn_common_img_inactive : button_style} />
                </TouchableOpacity>
                <TouchableOpacity  style={css_musicBox.btn_common} onPress={this.stopSong}>
                    <Image source={require('PecHymn_RNProject/src/assets/images/music_stop.png')}  style={button_style} />
                </TouchableOpacity>
                <View style={[css_musicBox.timer_container]}>
                    <Text numberOfLines={1} style={css_musicBox.timer}>{this.state.currentTime} / {this.state.duration}</Text>
                </View>
            </View>
        </View>
        );
    }
}