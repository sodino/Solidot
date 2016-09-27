import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    TouchableHighlight,
    ToolbarAndroid,
} from 'react-native';
import Cheerio from 'cheerio';

export default class NewsHome extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            dataSource : ds.cloneWithRows([]),
            refreshing : false,
        };
    }

    _renderRow(rowData) {
        return (
            <TouchableHighlight onPress={()=>{}}
                                underlayColor="rgb(210, 230, 255)">
                <View style={styles.articleContainer}>
                    <View style={styles.container}>
                        <Text style={styles.articleTag}>
                            {rowData.articleTag}
                        </Text>
                        <Text style={styles.articleTime}>
                            {rowData.articleTime}
                        </Text>
                    </View>
                    <Text style={styles.articleTitle}>
                        {rowData.title}
                    </Text>
                    <Text style={styles.articleDescription}>
                        {rowData.description}
                    </Text>
                    <View style={styles.articleEndContainer}>
                        <Text>
                            来自
                            <Text style={{fontWeight : 'bold', fontSize : 15}}>
                                {rowData.from}
                            </Text>
                        </Text>
                        <Text>
                            {rowData.comment}条评论
                        </Text>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column'}}>
                <ToolbarAndroid
                    logo={require('image!title')}
                    style={[styles.toolbar]}/>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                />
            </View>

        );
    }

    componentDidMount() {
        this._onRefresh();
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
                    dataArticle.articleTag = $(spanItem).text();
                } else if (index == 1) {
                    dataArticle.articleTime = $(spanItem).text();
                } else if (index == 2) {
                    dataArticle.from = $(spanItem).text().replace('来自', ''); // '来自'两个字不要了，后续自己添加上
                }
            });

            var h2 = $article.find('h2');
            h2.each((index, h2Item) => {
                if (index == 0) {
                    dataArticle.title = $(h2Item).text().replace(/(\r|\n)/g, '');
                    dataArticle.sid = $(h2Item).find('a').attr('href').replace('/story?sid=','');
                }
            });

            var div = $article.find('div');
            div.each((index, divItem)=>{
                if (index == 0) {
                    dataArticle.description = $(divItem).text().replace(/(\r|\n)/g, '');
                } else if (index == 1) {
                    dataArticle.comment = $(divItem).find('b').text();
                    if ('' === dataArticle.comment) {
                        dataArticle.comment = '0';
                    }
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

const styles = StyleSheet.create({
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#015351',
    },
    articleContainer : {
        flex : 1,
        flexDirection : 'column',
        flexWrap : 'wrap'
    },
    articleEndContainer : {
        flex : 1,
        flexDirection : 'row',
        flexWrap : 'wrap',
        justifyContent : 'space-between',
        padding : 5,
    },
    articleTitle : {
        color : '#48535b',
        fontSize : 20,
        paddingTop : 2.5,
        paddingBottom : 2.5,
        paddingLeft : 5,
        paddingRight : 5,
    },
    articleDescription : {
        color : '#48535b',
        fontSize : 15,
        paddingTop : 2.5,
        paddingBottom : 2.5,
        paddingLeft : 5,
        paddingRight : 5,
    },
    container: {
        flex: 1,  // 自由拉伸
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding : 5,
    },
    articleTag : {
        backgroundColor : '#015351',
        color : 'white',
        marginLeft : 5,
        marginRight : 5,
    },
    articleTime : {
        backgroundColor : '#3a92d9',
        color : 'white',
        marginLeft : 5,
        marginRight : 5,
    },
    toolbar: {
        backgroundColor: '#015351',
        height: 36,
    },
});