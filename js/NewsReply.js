import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ActivityIndicator,
    ToastAndroid,
} from 'react-native';
import Titlebar from './titlebar/titlebar.js';
import AutoExpandingTextInput from './ui/AutoExpandingTextInput.js';
import api from './api.js';

export default class NewsReply extends Component {
    constructor(props) {
        super(props);
        // this.title = '';
        this.content = '';
        this.state = {
            isReplying : false,
        };
    }

    _onPostReply() {
        if (this.state.isReplying) {
            return;
        }
        // console.log('title=' + this.title + ' content=' + this.content);
        console.log('content=' + this.content);

        if (this.content.length == 0) {
            ToastAndroid.show('评论正文不能同时为空', ToastAndroid.SHORT);
            return;
        }

        this.setState({
            isReplying : true,
        });

        this.content = this.content + "----Android[奇客IT资讯]";

        var body = encodeURIComponent(this.content);

        this._replyArticle.bind(this, body, this.props.article.sid)();

    }

    _parseReplyResonse(response) {

        var txt = response.text();
        console.log('response.text=' + JSON.stringify(response.json()));
        if (response.ok) {
            console.log("Perfect! Your settings are saved.");
        } else if (response.status == 401) {
            console.log("Oops! You are not authorized.");
        }

        this.setState({isReplying : false});
    }

    _replyArticle(replyBody, sid, pid) {
        if (!pid) {
            pid = 0;
        }

        var result = false;
        var msg = '';
        fetch(api.Comment, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                // 'User-Agent' : 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/rrGRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
                'User-Agent' : '(Android)',
            },
            body: 'subject=' + replyBody + '&comment=rt&sid=' + sid + '&pid=' + pid + '&type=story&op=submit',
        }).then((response)=>{
            return response.json();
        }).then((respJson)=>{
            console.log('_replyArticle() code=' + respJson.code + ' data=' + respJson.data + ' msg=' + respJson.msg);
            result = (respJson.code == 10000); // 10000为发布成功
            msg = JSON.stringify(respJson);
        }).catch((error) => {
                console.log('_replyArticle() error=%s', error);
                ToastAndroid.show('联网失败...', ToastAndroid.SHORT);
            }
        )
        .finally(()=>{
                this.setState({
                    isReplying : false,
                });

                if (!result){
                    ToastAndroid.show('发布失败' + '\n' + msg, ToastAndroid.SHORT);
                } else {
                    this.props.eventEmitter.emit('replyArticle', {
                        result : true,
                        sid : this.props.article.sid,
                    });
                    this.props.navigator.pop();
                }
            });
    }

    _showIndicator(isReplying) {
        if (isReplying === true) {
            return (
                <ActivityIndicator size="large"
                    color='black'
                    style={{margin : 10}}
                ></ActivityIndicator>
            );
        } else {
            return null;
        }
    }

    render() {

        var color = '#333333';
        if (this.state.isReplying === true) {
            color = 'gray';
        }

        return (
            <View style={{flex : 1, flexDirection : 'column', backgroundColor : 'white'}}>
                <Titlebar navigator={this.props.navigator}
                          isNeedBack={true}
                          rightText="发布"
                          onRightPress={this._onPostReply.bind(this)}
                />
                {this._showIndicator(this.state.isReplying)}
                <Text style={{color : color, fontSize: 20, marginLeft : 5}}>评论正文</Text>
                <AutoExpandingTextInput
                    editable={!this.state.isReplying}
                    style={{marginLeft : 5, marginRight : 5, }}
                    onChangeText={(value) => {this.content = value;}}
                />
            </View>
        );
    }
}