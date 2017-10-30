var express = require("express");
var utility = require("utility");
var cheerio = require('cheerio');
var superagent = require('superagent');
var app = express();

app.get('/', function (req, res, next) {
  superagent.get('http://www.jseea.cn/')
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#newcenter_con1').find('ul').find('li').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: $element.find('a').text()
        });
      });
      res.send(items);
    });
});

app.listen("3000",function(){
  console.log("start node ");
});
