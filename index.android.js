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
                return(<NewsHome navigator={navigator}/>
                );
            case 'article' :
                return (<NewsArticle navigator={navigator}
                                     data={route.data}
                />);
            case 'reply' :
                return (
                    <NewsReply navigator={navigator}
                           article={route.article}/>
                );
            case 'web' :
                return (
                    <View style={{flex : 1}}>
                        <ToolbarAndroid style={[styles.toolbar]}
                                        title={route.title}
                                        titleColor="white"
                                        navIcon={{uri: 'back_white_24dp', isStatic : true}}
                                        onIconClicked={navigator.pop}
                        ></ToolbarAndroid>
                        <WebView source={{uri : route.url}}
                                 javaScriptEnabled={true}/>
                    </View>
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
