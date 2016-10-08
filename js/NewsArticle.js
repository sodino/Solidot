import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    RefreshControl,
    ScrollView,
} from 'react-native';
import api from './api.js';
import Cheerio from 'cheerio';
import ActualImage from './ActualImage.js';

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

    _parseHtml(html) {
        var $ = Cheerio.load(html);
        var article = {
            ...this.state.dataArticle,
            content : '',
            viewCount : 0,
            imgs : [],
            aHrefs : [],
        };

        var $ = Cheerio.load(html);
        var $article = $('article');
        $article.find('span').remove();
        $article.find('h2').remove();
        $article.find('br').remove();
        $article.find('p').each((index, item_p)=>{
            let p_str = $(item_p).text();
            if (!p_str) {
                p_str = '';
            }
            if (p_str.startsWith('本文已被查看')) {
                let viewCount = p_str.replace('本文已被查看','').replace('次','').trim();
                article.viewCount = viewCount;
                //console.log('viewCount=%d', viewCount);
                $(item_p).remove(); // 清空'本文已被查看 n 次'
            }
        });

        $article.find('img').each((index, item_img)=>{
            let $item_img = $(item_img);
            let src = $item_img.attr('src');
            article.imgs.push({img : src});
            //console.log('index=%s src=%s', index, src);
        });

        article.content = $article.text().replace(/(\r|\n)/g, '').trim();
        var seekTo = 0;
        $article.find('a').each((index, item_a)=>{
            let $item_a = $(item_a);
            let str = $item_a.text();
            let href = $item_a.attr('href');

            let preContent = this._cutContent(article.content, seekTo, str);

            seekTo = seekTo + preContent.length + str.length;
            article.aHrefs.push({txt : preContent});
            article.aHrefs.push({txt : str, href : href});
            //console.log('index=%s str=%s href=%s', index, str, href);
        });

        if (seekTo < article.content.length) {
            let endContent = article.content.substr(seekTo);
            console.log('end=[%s]', endContent);
            article.aHrefs.push({txt : endContent});
        }

        this.setState({
            dataArticle:article,
            refreshing : false,// 取消转圈
        });
        // console.log(JSON.stringify(article));
    }

    _onRefresh() {
        this.setState({refreshing: true});

        var url = api.Article + this.state.dataArticle.sid;
        //var url = api.Article + '49839';

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
                console.log('NewsAritcle::_onRefresh() error=%s', error);
            }).done();
    }

    _cutContent(content, seekTo, keyEnd) {
        var idxKey = content.indexOf(keyEnd, seekTo);
        var preContent = content.substr(seekTo, idxKey - seekTo);
        // console.log('seekTo=%s idxKey=%s pre=[%s] key=[%s]', seekTo, idxKey, preContent, keyEnd);
        return preContent;
    }

    _assembleArticleContent(article) {
        var arrTxt = [];
        if (!article.content) {
            // 还没有获取到内容
            arrTxt.push(this._newText(article.description));
        } else {
            var content = article.content;
            var aHrefs = article.aHrefs;
            var seekTo = 0;

            aHrefs.forEach((href, index, aHrefs) => {
                var txt = href.txt;
                var href = href.href;

                arrTxt.push(this._newText(txt, href));
            });
        }

        return (
            <Text key={arrTxt} style={{flex : 1, justifyContent : 'flex-start', margin : 8}}>
                {arrTxt}
            </Text>
        );
    }

    _newText(strText, href) {
        if (!href) {
            // 普通文本
            return (<Text key={strText}>{strText}</Text>);
        } else {
            // 带超链接的文本，需要处理点击事件
            return (<Text style={{textDecorationLine: 'underline'}}
                        key={strText}
                        onPress={()=>{
                            this._jumpToWeb(href);
                        }}>
                            {strText}
                        </Text>);
        }
    }

    _jumpToWeb(href) {
        this.props.navigator.push({
            id: 'web',
            url: href,
            title: 'Referer URL',
        });
    }

    _assembleArticleImage(article) {
        if (!article.imgs) {
            return null;
        }
        if (article.imgs.length == 0) {
            return null;
        }

        var images = [];
        article.imgs.forEach((objImg, index, imgs) => {
            images.push(
              <ActualImage key={objImg} source={{uri : objImg.img}}/>
            );
        });

        return (<View style={{justifyContent:'center', alignItems:'center', margin : 8}}>{images}</View>);
    }

    render() {
        var imgContainer = this._assembleArticleImage(this.state.dataArticle);
        var txtContainer = this._assembleArticleContent(this.state.dataArticle);

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
                <ScrollView style={{flex : 1}}
                            refreshControl={
                                <RefreshControl refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}/>
                            }>
                    {imgContainer}
                    {txtContainer}
                </ScrollView>
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