import React, { Component } from 'react';
import {
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
import api from './api.js';

export default class NewsArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataArticle : props.data,
            refreshing : false,
        };
    }

    componentDidMount() {
        this._onRefresh();
    }

    _onRefresh() {
        this.setState({refreshing : true});

        var url = api.Article + this.state.dataArticle.sid;

    }



    render() {
        return (
            <View style={styles.articleContainer}>
                <View style={{height : 56, flexDirection : 'row', backgroundColor : '#015351', alignItems : 'center', justifyContent:'center'}}>
                    <Image source={{uri : 'title'}} style={{width : 175, height : 35}}></Image>
                    <Image source={require('image!back_white_24dp')} style={{position : 'absolute', width : 35, height : 35, alignSelf : 'center', left : 0, top : 8}}></Image>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        width : 200,
        height : 40,
    },
    articleTitle : {
        flexDirection : 'row',
        backgroundColor : '#015351',
    },
    articleTitleText : {
        color : 'white',
        fontSize : 20,
    },
    toolbar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#015351',
        height: 56,
    },
});