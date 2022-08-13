const puppeteer = require("puppeteer");
const pdfkit = require('pdfkit');
// const jsPDF = require('jspdf');
const fs = require('fs');
const link = 'https://www.youtube.com/playlist?list=PL8DT0g-N37gDf3Al3idn7RKDFe2YtFg6m';
let cTab;

(async function(){
    try {
        
        let browserOpen = puppeteer.launch({

            headless:false,
            defaultViewport:null,
            args:['--start-maximized']
        })
        let browserInstance = await browserOpen;
        let allTabsArr = await browserInstance.pages();
        cTab = allTabsArr[0];
        await cTab.goto(link); // 1.0 reached the page
        await cTab.waitForSelector('h1[id="title"]');
        let name = await cTab.evaluate(function(select){return document.querySelector(select).innerText},'h1[id="title"]'); // 2.0 got the name
        
        let allData = await cTab.evaluate(getData,'#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer'); //2.1 got the videos-count and total views as strings
        console.log(name, allData.noOfVideos, allData.noOfViews);  //this gets me strings of data

        // now to scrap everything we need to scroll till the end..for that we need to find total no of videos and videos shown on one page to get an idea of no of scrolls
        
        // task 3.0 - finding the total no of videos from total videos string
        let totalVideos = allData.noOfVideos.split(" ")[0];
        console.log(totalVideos);
        //task 3.1 - to find videos on this page via saperate fun
        let currVideos = await getCVideosLength();
        // console.log(currVideos);

        while(totalVideos-currVideos >10){
            await scrollToBottom();
            currVideos = await getCVideosLength();
        }

        let finalList = await getStats();
        // console.log(finalList);
        let pdfDoc = new pdfkit;
        pdfDoc.pipe(fs.createWriteStream('play2.pdf'));
        pdfDoc.text(JSON.stringify(finalList));
        pdf.end();

        // let doc = new jsPDF();
        // doc.text(JSON.stringify(finalList));
        // doc.save('play.pdf');
        // console.log(JSON.stringify(finalList));

    } catch (error) {
        
    }
})()

// 2.2 A fun/c to get the toal views and videos strings 
function getData(selector){
    let allEle = document.querySelectorAll(selector);
    let noOfVideos = allEle[0].innerText;
    let noOfViews = allEle[1].innerText;

    return{
        noOfVideos,
        noOfViews
    }
}

//3.1.1 fun to get no of current page videos
async function getCVideosLength(){
    let len = await cTab.evaluate(getLength,'#index-container.style-scope.ytd-playlist-video-renderer');
    return len; 
}
function getLength(idxselect){
    let thumbnailEle = document.querySelectorAll(idxselect);
    return thumbnailEle.length;
}

//3.2 scroll fun/n
async function scrollToBottom(){
    await cTab.evaluate(goToBottom);
    function goToBottom(){
        window.scrollBy(0,window.innerHeight);
    }
}

// 3.3 get the stats of each video - name & duration
async function getStats(){
    let list = await cTab.evaluate(getNameAndDuration,'a[id="video-title"]','span[id="text"].style-scope.ytd-thumbnail-overlay-time-status-renderer');
    return list;
}

function getNameAndDuration(nameSelector,durationSelector){
    let videoEle = document.querySelectorAll(nameSelector);
    let durationEle = document.querySelectorAll(durationSelector);

    let currList = [];

    for(let i=0;i<videoEle.length;i++){
        let title = videoEle[i].innerText;
        let duration = durationEle[i].innerText;
        currList.push({title,duration});
    }
    return currList;
}