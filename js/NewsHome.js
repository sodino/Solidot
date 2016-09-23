import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
} from 'react-native';

export default class NewsHome extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            dataSource : ds.cloneWithRows(['row 1', 'row 2']),
            refreshing : false,
        };
    }

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData)=><Text>{rowData}</Text>}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                    />
                }
            />

        );
    }

    _onRefresh() {
        this.setState({refreshing : true});
        setTimeout(()=>{
            console.log('_onRefresh.setTimeout()...start');
                this.setState({
                    refreshing : false
                });
        } ,2000);
        console.log('_onRefresh...start');
    }
}