'use strict'

var http = require('http');
var iconv = require('iconv-lite');
var Cheerio = require('cheerio');

var url = 'http://www.solidot.org/';

var options = {
  hostname: 'www.solidot.org',
  port: 80,
  path: '/comments/ajax',
  method: 'POST',
  headers: {
    'User-Agent': '(Android))',
  }
};


http.post(options, function(res) {
   var arrBuf = [];
   var bufLength = 0;
   res.on('data', function(chunk) {
       arrBuf.push(chunk);
       bufLength += chunk.length;
   }).on('end', function(){
       var chunkAll = Buffer.concat(arrBuf, bufLength);
       var html = iconv.decode(chunkAll, 'utf-8');
       //console.log(html);
       
       var test = {tKey : 'key', tValue : 'value'};
       
       var article = {
           content : '',
           viewCount : 0,
           imgs : [],
           aHrefs : [],
           comments : [],
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
           
           let preContent = _cutContent(article.content, seekTo, str);
           
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
       
        
        // 处理评论
        // 判断是否有评论
        
        var $replyUL = $('ul.reply_ul');
        if ($replyUL.length == 1) {
            // 存在评论区
            console.log('exist comment');
            var arrReply = [];
            _parseReplyUL($, $replyUL, arrReply);
            
            console.log('---- -----');
            console.log(JSON.stringify(arrReply));
        } else {
            console.log('no comment');
        }
        
        
       
       //console.log(JSON.stringify(article));
       console.log('--------');
   })
});

function _parseReplyUL($, $reply, arrReply) {
    $reply.children().each((index, item_li) => {
        let $li = $(item_li);
        let li_id = $li.attr('id').replace('tree_', '');  
        console.log('index=%s comment_id=%s', index, li_id);
        $li.children().each((index, item) => {
            let $item = $(item);
            if ($item.is('p')) {
                _parseReply_p($, $item, li_id, arrReply);                
            } else {
                _parseReplyNested($, $item, li_id, arrReply);
            }
        });
    });
}

function _parseReplyNested($, $item, id, arrReply) {
    if ($item.is('div')) {
        let replyNested = {};
        let title = $item.find('h5').text();
        let content = $item.find('div.p_text').text().replace(/(\r|\n)/g, '').trim();
        let user = '';
        let time = '';
        
        $item.find('div.talk_time').find('span').each((index, item)=>{
            let $span = $(item);
            let tmp = $span.text().replace(/(\r|\n)/g, '').trim();
            if (index == 0) {
                user = tmp;
            } else if (index == 1) {
                time = tmp.replace('发表于', '');
            }
        });
        
        console.log('title=[%s] content=[%s] usr=[%s] time=[%s]', title, content, user, time);
        replyNested.id = id;
        replyNested.title = title;
        replyNested.content = content;
        replyNested.user = user;
        replyNested.time = time;
        arrReply.push(replyNested);
    } else if ($item.is('ul')) {
        var idx = Math.max(0, arrReply.length -1);
        if (!arrReply[idx].nested) {
            // 不存在，就生成一个
            arrReply[idx].nested = [];
        }
        _parseReplyUL($, $item, arrReply[idx].nested);
    }
}

function _parseReply_p($, $item, id, arrReply) {
    // 单条评论
    let content = '';
    let user = '';
    let time = '';
    $item.children().each((index, item) => {
        let tmp = $(item).text().replace(/(\ |\t|\n|\r)/g, '');
        if (index == 0) {
            content = tmp;
        } else if (index == 1) {
            user = tmp;
        } else if (index == 2) {
            time = tmp;
        }
    });
    console.log('content=[%s] user=[%s] time=[%s]', content, user, time);
    let comment_item = {id : id, user : user, time : time, content : content};
    arrReply.push(comment_item);
}


function _cutContent(content, seekTo, keyEnd) {
    var idxKey = content.indexOf(keyEnd, seekTo);
    var preContent = content.substr(seekTo, idxKey - seekTo);
    console.log('seekTo=%s idxKey=%s pre=[%s] key=[%s]', seekTo, idxKey, preContent, keyEnd);
    return preContent;
}