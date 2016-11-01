import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ToastAndroid,
    ScrollView,
} from 'react-native';
import Titlebar from './titlebar/titlebar.js';
import StartWebBrowser from './native/StartWebBrowser.js';
import AppInfo from './native/AppInfo.js';

export default class DevInfo extends Component {
    constructor(props) {
        super(props);
    }

    _jumpToWeb(href) {
        StartWebBrowser.start(href);
    }

    render() {

        var name = AppInfo.getVersionName();
        var code = AppInfo.getVersionCode();
        console.log('version name=' + name + " code=" + code);

        var href = 'http://sodino.com/about';
        return(
            <View style={{flex : 1, flexDirection : 'column', backgroundColor : 'white',}}>
                <Titlebar navigator={this.props.navigator}
                          isNeedBack={true}/>
                <Text style={{fontSize: 20, fontWeight: 'bold',textAlign: 'center', margin : 5}}>关于</Text>
                <Text style={{margin : 5, textAlign : 'left'}}>
                    {this._getAboutText(0)}
                    <Text style={{textDecorationLine: 'line-through'}}>帐号登录</Text>
                    <Text style={{fontStyle: 'italic',textDecorationLine: 'none'}}>(沟通中...)</Text>
                    {this._getAboutText(1)}
                    <Text style={{textDecorationLine : 'underline', color : 'blue'}} onPress={this._jumpToWeb.bind(this, href)}>{href}</Text>

                    {this._getAboutText(2)}
                </Text>
            </View>
        );
    }

    _getAboutText(index) {
        switch (index) {
            case 0:
                return ('\t\t本应用为个人开发者抓取solidot的网站内容再排版布局而成，并非solidot官方应用。\n\n\t\t目前支持的功能：\n\t\t\t● 首页信息流\n\t\t\t● 往日的文章\n\t\t\t● 文章详情\n\t\t\t● 评论文章(匿名)\n\t\t\t● ');
            case 1:
                return ('\n\n\t\t个人开发者\t：\tsodino\n\t\t开发者信息\t：\t');
            case 2:{
                return ('\n\n\t\t当前版本\t\t：\t' + AppInfo.getVersionName() + '(' + AppInfo.getVersionCode()+ ')');
            }
        }
    }
}
