import React, { Component } from 'react';
import {
    Image,
    Dimensions,
} from 'react-native';

export default class ActualImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width : 48,
            height : 48,
        }
    }

    componentDidMount() {
        Image.getSize(this.props.source.uri, (imgWidth, imgHeight)=> {
            var {width, height}=Dimensions.get('window');
            var maxWidth = width - 8 * 2;
            var finalWidth = imgWidth;
            var finalHeight = imgHeight;
            if (maxWidth < imgWidth) {
                finalWidth = maxWidth;
                finalHeight = imgHeight * finalWidth / imgWidth;
            }

            this.setState({
                width : finalWidth,
                height : finalHeight,
            })
        });
    }

    render() {
        var width = this.state.width;
        var height = this.state.height;
        return (
            <Image style={{width : width, height : height}}
                   resizeMode={Image.resizeMode.center}
                   source={this.props.source}></Image>
        );
    }
}