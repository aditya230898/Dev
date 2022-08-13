const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/ball-by-ball-commentary";
const request = require("request");
const cheerio = require("cheerio");
// console.log("before");
request(url,cb);
function cb(err, response,html){
    if(err){
        console.log(err);
    }else{
        extratHTML(html);
    }
}
function extratHTML(html){
    let $ = cheerio.load(html);
    let eleArr = $(".ci-html-content");
    let text = $(eleArr[40]).text();
    let htmlData = $(eleArr[40]).html();
    console.log("text data : ", text);
    console.log("html data : ", htmlData);
}
