import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
} from 'react-native';
import Titlebar from './titlebar/titlebar.js';
import AutoExpandingTextInput from './ui/AutoExpandingTextInput.js';

export default class NewsReply extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', backgroundColor : 'white'}}>
                <Titlebar navigator={this.props.navigator}
                          isNeedBack={true}
                          rightText="发布"
                          onRightPress={this._onPostReply}
                />
                <Text style={{color : '#333333', fontSize: 20, marginLeft : 5, marginRight : 5}}>标题</Text>
                <TextInput style={{marginLeft : 5, marginRight : 5, }}/>
                <Text style={{color : '#333333', fontSize: 20, marginLeft : 5}}>评论正文</Text>
                <AutoExpandingTextInput style={{marginLeft : 5, marginRight : 5, }}/>
            </View>
        );
    }
}