import React, { Component } from 'react';
import {
    TextInput,
} from 'react-native';

export default class AutoExpandingTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            height: 0,
        };
    }
    render() {
        return (
            <TextInput
                {...this.props}
                multiline={true}
                onContentSizeChange={(event) => {
                    this.setState({height: event.nativeEvent.contentSize.height});
                }}
                onChangeText={(text) => {
                    this.setState({text});
                    this.props.onChangeText(text);
                }}
                style={[this.props.style, {height: Math.max(120, this.state.height)}]}
                value={this.state.text}
            />
        );
    }
}