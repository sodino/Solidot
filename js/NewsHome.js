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
import Cheerio from 'cheerio';

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
                renderRow={(rowData)=>{
                    var string = JSON.stringify(rowData);
                    return <Text>{string}</Text>
                }}
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

        var url = 'http://www.solidot.org/';
        var headers = new Headers();
        headers.append('User-Agent', '(Android)');
        // Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
        headers.append('Accept-Encoding', 'deflate');
        headers.append('Accept-Language', 'zh-CN,zh;q=0.8');
        var request = new Request(url, {method :'GET', headers: headers});


        fetch(request)
            .then((response)=>{
                return response.text();
            })
            .then((html)=>{
                this._parseHtml(html);
            })
            .catch((error)=>{
                console.log('onRefresh() error=%s', error);
            }).done(()=>{
                // 取消转圈
                this.setState({
                    refreshing : false
                });
        });
    }

    _parseHtml(html) {
        var datas = [];
        var $ = Cheerio.load(html);
        $('article').each((index, articleItem)=>{
            var dataArticle = {
                title:'',
                description:'',
                tag:'',
                time:'',
                from:'',
                sid:'',
                comment:'',
            };

            var $article = $(articleItem);
            var span = $article.find('span');
            span.each((index, spanItem)=> {
                if (index == 0) {
                    dataArticle.tag = $(spanItem).text();
                } else if (index == 1) {
                    dataArticle.time = $(spanItem).text();
                } else if (index == 2) {
                    dataArticle.from = $(spanItem).text();
                }
            });

            var h2 = $article.find('h2');
            h2.each((index, h2Item) => {
                if (index == 0) {
                    dataArticle.title = $(h2Item).text();
                    dataArticle.sid = $(h2Item).find('a').attr('href').replace('/story?sid=','');
                }
            });

            var div = $article.find('div');
            div.each((index, divItem)=>{
                if (index == 0) {
                    dataArticle.description = $(divItem).text();
                } else if (index == 1) {
                    dataArticle.numComment = $(divItem).find('b').text();
                }
            });

            // console.log(dataArticle);
            datas.push(dataArticle);
        });

        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(datas),
        });
    }
}