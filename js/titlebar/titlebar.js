import React, { Component } from 'react';
import {
    Image,
    View,
    TouchableWithoutFeedback,
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


    render() {
        return (
            <View style={{height : 56, flexDirection : 'row', backgroundColor : '#015351', alignItems : 'center', justifyContent:'center'}}>
                {this._newBackIcon(this.props.isNeedBack)}
                {this._newSolidotLogo()}
            </View>
        );
    }
}