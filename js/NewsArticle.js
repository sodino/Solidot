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
    TouchableWithoutFeedback,
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
        // TouchableWithoutFeedback没有width height backgroundColor等属性，真难用
        // onPress直接赋值为navigator.pop，也可以写个函数执行()=>{pop}
        return (
            <View style={styles.articleContainer}>
                <View style={{height : 56, flexDirection : 'row', backgroundColor : '#015351', alignItems : 'center', justifyContent:'center'}}>
                    <TouchableWithoutFeedback onPress={this.props.navigator.pop}>
                        <Image source={require('image!back_white_24dp')}
                               style={{width : 35, height : 35, alignSelf : 'center', position : 'absolute', left : 5, top : 10}}
                        ></Image>
                    </TouchableWithoutFeedback>
                    <Image source={{uri : 'title'}} style={{width : 175, height : 35}}></Image>
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