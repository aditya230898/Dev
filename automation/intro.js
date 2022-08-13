const puppeteer = require("puppeteer");

// console.log("before");
// let browserOpenPromise = puppeteer.launch({headless:false});
// browserOpenPromise.then(function(browser){
//     console.log("browser opened");
// })
// console.log("after");

//try to use const if possible
let page;
let browserOpenPromise = puppeteer.launch({
    headless:false,
    slowMo: true,
    defaultViewport:null,
    args:["--start-maximized"]
});
browserOpenPromise.then(function(browser){
    const pagesArrPromise = browser.pages();    //currently opened tabs
    return pagesArrPromise;
}).then(function(browserPages){
    page = browserPages[0];
    let gotoPromise = page.goto("https://www.google.com/");
    return gotoPromise;
}).then(function(){
    // console.log("reached google page");
    //waiting for the element to appear on the page//
    let elementWaitPromise = page.waitForSelector("input[type='text']",{visible:true});
    return elementWaitPromise;
}).then(function(){
    //type on any element on that page via selector
    let keysWillBePressed = page.type("input[type='text']","pepcoding");
    return keysWillBePressed;
}).then(function(){
    //page.keyboard to type special characters
    let enterWillBePressed = page.keyboard.press("Enter");
    return enterWillBePressed;
}).then(function(){
    let elementWaitPromise = page.waitForSelector(".LC20lb.MBeuO.DKV0Md",{visible:true});
    return elementWaitPromise;
}).then(function(){
    //mouse
    let keysWillBePressed = page.click(".LC20lb.MBeuO.DKV0Md");
    return keysWillBePressed;
})
.catch(function(err){
    console.log(err);
})
