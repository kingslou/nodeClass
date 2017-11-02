var express = require("express");
var utility = require("utility");
var cheerio = require('cheerio');
var superagent = require('superagent');
var eventproxy = require('eventproxy');
var url = require('url');
var app = express();
//抓取的网页地址
var codeUrl = 'http://www.jseea.cn/';

app.get('/', function (req, res, next) {
  superagent.get(codeUrl)
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#newcenter_con1').find('ul').find('li').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: $element.find('a').text(),
          //通过resolve可以解析出完整的url
          herf:url.resolve(codeUrl,$element.find('a').attr('href'))
        });
      });
      res.send(items);
      var ep = new eventproxy();
      ep.after('contenthtml',items.length,function(res){
        //开始行动
        console.log("调用"+res.length);
        res = res.map(function(seq){
          var url = seq[0];
          var text = seq[1];
          var $ = cheerio.load(text);
          return ({
            title:$('#title').find('a').text()
          });
        });
        console.log(res);
      });

      items.forEach(function(item){
        superagent.get(item.herf).end(function(err,stres){
          ep.emit("contenthtml",[item.herf,stres.text]);
        });
      })

    });
});

app.listen("3000",function(){
  console.log("start node ");
});
