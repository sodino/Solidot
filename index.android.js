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
    StatusBar
} from 'react-native';
import NewsHome from './js/NewsHome.js';

class Solidot extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='#015851'/>
                <ToolbarAndroid
                    logo={require('image!title')}
                    style={[styles.toolbar]}
                />
                <NewsHome/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#015851',
        height: 36,
    },
});

AppRegistry.registerComponent('Solidot', () => Solidot);
