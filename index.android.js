/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ToolbarAndroid,
    BackAndroid,
    StatusBar,
    WebView,
    Navigator,
} from 'react-native';
import NewsHome from './js/NewsHome.js';
import NewsArticle from './js/NewsArticle.js';
import NewsReply from './js/NewsReply.js';
import DevInfo from './js/DevInfo.js';
import EventEmitter from 'EventEmitter';


var _navigator;

BackAndroid.addEventListener('hardwareBackPress', ()=> {
    if (!_navigator) {
        // _navigator未初始化
        return true;
    }
    if (_navigator.getCurrentRoutes().length === 1) {
        return false;
    } else {
        _navigator.pop();
        return true;
    }
});

class Solidot extends Component {
    constructor(props) {
        super(props);
        this.eventEmitter = new EventEmitter();
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='#015851'/>
                <Navigator
                    style={styles.container}
                    initialRoute={{id: 'Solidot'}}
                    renderScene={this.navigatorRenderScene.bind(this)}
                />
            </View>
        );
    }

    navigatorRenderScene(route, navigator) {
        _navigator = navigator;
        switch(route.id) {
            case 'Solidot' :
                return(<NewsHome navigator={navigator}
                                 eventEmitter={this.eventEmitter}
                    />
                );
            case 'article' :
                return (<NewsArticle navigator={navigator}
                                     data={route.data}
                                     eventEmitter={this.eventEmitter}
                />);
            case 'reply' :
                return (
                    <NewsReply navigator={navigator}
                           article={route.article}
                           eventEmitter={this.eventEmitter}
                    />
                );
            case 'devInfo' :
                return (
                    <DevInfo navigator={navigator}/>
                );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#015351',
        height: 36,
    },
});

AppRegistry.registerComponent('Solidot', () => Solidot);
