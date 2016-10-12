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
    DatePickerAndroid,
    ToastAndroid,
} from 'react-native';
import Cheerio from 'cheerio';
import api from './api.js';
import Titlebar from './titlebar/titlebar.js';

export default class NewsHome extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged:this._listRowHasChanged,
        });
        // this.yOffset = 0;

        this.state = {
            dataSource : ds.cloneWithRows([]),
            refreshing : false,
        };

        this.props.eventEmitter.addListener('updateReplyCount', (data)=>{
            // console.log('Home updateReplyCount() sid=' + data.sid + ' comment=' + data.comment);
            this.state.dataSource._dataBlob.s1.some((item, index, array)=> {
                // console.log('index=' + index + ' sid=' + item.sid); // if (data.sid == item.sid) {
                if (data.sid == item.sid) {
                    if (data.comment != item.comment) {
                        // 不相等时才需要更新
                        array[index] = {
                            ...array[index],
                            comment : data.comment,
                            changed : true,  // 标识需要更新本行
                        };
                        // console.log('index=' + index + ' sid=' + item.sid + ' new comment=' + item.comment);
                        this.setState({
                            dataSource : this.state.dataSource.cloneWithRows(array),
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            });
        });

        this.nowDate = new Date();// 后续会从服务器的headers中获取
        this.dateArticlePool = {}; // 存储各个日期的文章
        this.currentArticleDate = {
            year : 0,
            month : 0,
            day : 0,
        };
    }

    _listRowHasChanged(prevRowData, nextRowData) {
        var changed = false;

        if (prevRowData !== nextRowData) {
            changed = true;
        }
        if (prevRowData.changed) {
            changed = true;
            prevRowData.changed = false; // 恢复为初始状态
        }

        console.log('_listRowHasChanged() r1.sid=' + prevRowData.sid + ' comment=' + prevRowData.comment + ' r2.sid=' + nextRowData.sid + ' comment=' + nextRowData.comment + " changed=" + changed);
        return changed;
    }

    componentWillUnmount () {
        this.props.eventEmitter.removeListener('updateReplyCount');
    }

    _clickRow(rowData) {
        // 启动NArticle
        this.props.navigator.push({
            id : 'article',
            data : rowData,
        });
    }

    _renderArticleRow(rowData) {
        return (
            <TouchableHighlight onPress={()=>{this._clickRow(rowData)}}
                                underlayColor="rgb(210, 230, 255)">
                <View style={styles.articleContainer}>
                    <View style={styles.container}>
                        <View style={[styles.articleTag, {borderColor : '#015351', borderRadius : 5, borderWidth : 5, justifyContent:'center', alignItems:'center'}]}>
                            <Text style={[styles.articleTag, {color : 'white', marginTop : -4}]}>
                                {rowData.tag}
                            </Text>
                        </View>
                        <View style={[styles.articleTime, {borderColor : '#3a92d9', borderRadius : 5, borderWidth : 5, justifyContent:'center', alignItems:'center'}]}>
                            <Text style={[styles.articleTime, {color : 'white', marginTop : -4}]}>
                                {rowData.time}
                            </Text>
                        </View>
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
                        {this._renderComment(rowData.comment)}
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    _choiceOtherDate = async () => {
        // var k1 = '2015';
        // var k2 = '0505';
        // var k = k1 + k2;
        //
        // nowDate[k] = k;
        // console.log('---------------' + nowDate[k]);

        var options = {
            minDate : new Date(2006, 10, 21),  // 最早的文章地址
            maxDate : this.nowDate,
            date : new Date(this.currentArticleDate.year, this.currentArticleDate.month, this.currentArticleDate.day),
        };
        try {
            var {action, year, month, day} = await DatePickerAndroid.open(options);
            month = month + 1;
            console.log('_choiceOtherDate() action=' + action + ' year=' + year + ' month=' + month + ' day=' + day);

            if (action == DatePickerAndroid.dateSetAction) {
                if (year === this.currentArticleDate.year
                    && month === this.currentArticleDate.month
                    && day === this.currentArticleDate.day
                ) {
                    ToastAndroid.show('当前已是' + year + '-' + month + '-' + day + '的文章', ToastAndroid.SHORT);
                } else {
                    var selectedDate = new Date(year, month, day);
                    var selectedDateStr = '' + year + '' + (month < 10?('0' + month) : month) + (day < 10 ? ('0' + day) : day);
                    this._onRefresh({
                        string : selectedDateStr,
                        year : year,
                        month : month,
                        day : day,
                    })
                }
            } else {
                // do nothing
            }
        } catch ({code, message}) {
            console.log('_choiceOtherDate() error. code=' + code + " msg=" + message);
        }
    };

    _renderOtherDate() {
        return (
            <TouchableHighlight onPress={this._choiceOtherDate}
                                underlayColor="rgb(210, 230, 255)"
                                style={{marginLeft: 5, marginRight: 5, borderRadius : 5, alignItems : 'center'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', margin : 10}}>往日的文章</Text>
            </TouchableHighlight>
        );
    }

    _renderRow(rowData) {
        if (rowData.otherDate) {
            return this._renderOtherDate();
        } else {
            return this._renderArticleRow(rowData);
        }
    }

    _renderComment(comment) {
        let strComment = '';
        if (comment != 0){
            strComment = comment + "条评论";
            return (
                <Text>{strComment}</Text>
            );
        } else {
            return null;
        }
    }

    // _onScroll(event) {
    //     this.yOffset = event.nativeEvent.contentOffset.y;
    // }

    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column'}}>
                <Titlebar navigator={this.props.navigator}
                          isNeedBack={false}
                />
                <ListView ref={component => this.listView = component}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    enableEmptySections={true}
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

    _onRefresh(reqDate) {
        this.setState({refreshing : true});

        var url;

        if (!reqDate) {
            url = api.Solidot;
        } else {
            url = api.Date + reqDate.string;
        }
        var headers = new Headers();
        headers.append('User-Agent', '(Android)');
        // Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
        headers.append('Accept-Encoding', 'deflate');
        headers.append('Accept-Language', 'zh-CN,zh;q=0.8');
        var request = new Request(url, {method :'GET', headers: headers});


        fetch(request)
            .then((response)=>{
                var strDate = response.headers.get('date');
                this.nowDate = new Date(strDate);
                if (!reqDate) {
                    // 获取当前真实日期信息
                    this.currentArticleDate = {
                        year : this.nowDate.getFullYear(),
                        month : this.nowDate.getMonth() + 1,
                        day : this.nowDate.getDate(),
                    }
                } else {
                    this.currentArticleDate = reqDate;
                }
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

        datas.push({otherDate : true});


        if (this.listView) {
            // scrollTo要在setState()之前才有效果。
            this.listView.scrollTo({x : 0, y : 0, animated : false});
        }

        // if (this.yOffset == 0) {
            this.setState({
                dataSource : this.state.dataSource.cloneWithRows(datas),
            });
        // }
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
        marginLeft : 5,
        marginRight : 5,
    },
    articleTime : {
        backgroundColor : '#3a92d9',
        marginLeft : 5,
        marginRight : 5,
    },
    toolbar: {
        backgroundColor: '#015351',
        height: 56,
    },
});