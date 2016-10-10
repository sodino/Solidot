import React, { Component } from 'react';
import {
    Image,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
} from 'react-native';

export default class Titlebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    _newBackIcon(isNeedBack) {
        if (!isNeedBack) {
            return null;
        } else {
            return (
                <TouchableWithoutFeedback onPress={this.props.navigator.pop}>
                    <Image source={require('image!back_white_24dp')}
                           style={{width: 35, height: 35, alignSelf: 'center', position: 'absolute', left: 5, top: 10}}
                    ></Image>
                </TouchableWithoutFeedback>
            );
        }
    }

    _newSolidotLogo() {
        return (
            <Image source={{uri : 'title'}} style={{width : 175, height : 35}}></Image>
        );
    }

    _newRightText(text) {
        if (!text) {
            return null;
        }
        if (text == '') {
            return null;
        }

        var left = Dimensions.get('window').width - 5 - 50;

        return (
            <TouchableHighlight onPress={this.props.onRightPress}
                                underlayColor="rgb(210, 230, 255)"
                                style={{marginLeft: 5, marginRight: 5, borderRadius: 5, alignItems: 'center',
                                        position : 'absolute', left : left, top : 15}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color : 'white'}}>{text}</Text>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={{height : 56, flexDirection : 'row', backgroundColor : '#015351', alignItems : 'center', justifyContent:'center'}}>
                {this._newBackIcon(this.props.isNeedBack)}
                {this._newRightText(this.props.rightText)}
                {this._newSolidotLogo()}
            </View>
        );
    }
}