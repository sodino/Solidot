'use strict'

var http = require('http');
var iconv = require('iconv-lite');
var Cheerio = require('cheerio');

var url = 'http://www.solidot.org/';

var options = {
  hostname: 'www.solidot.org',
  port: 80,
  path: '/story?sid=49839',
  method: 'GET',
  headers: {
    'User-Agent': '(Android))',
  }
};
http.get(options, function(res) {
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
       

       
       //console.log(JSON.stringify(article));
       console.log('--------');
   })
});


function _cutContent(content, seekTo, keyEnd) {
    var idxKey = content.indexOf(keyEnd, seekTo);
    var preContent = content.substr(seekTo, idxKey - seekTo);
    console.log('seekTo=%s idxKey=%s pre=[%s] key=[%s]', seekTo, idxKey, preContent, keyEnd);
    return preContent;
}