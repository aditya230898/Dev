const puppeteer = require("puppeteer");

const codesObj = require('./codes'); 
const promise = require("promise");
const loginLink = 'https://www.hackerrank.com/auth/login';
const email = 'xaboci1178@galotv.com';
const password = 'xaboci1178@galotv.com';

let page;

let browserOpenPromise = puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:['--start-maximized']
}).then(function(browserObj){
    let browserPagePromise = browserObj.newPage();
    return browserPagePromise;
}).then(function(newTab){
    page = newTab;
    let hackerrankOpenPromise = newTab.goto(loginLink);
    return hackerrankOpenPromise;
}).then(function(){
    let emailIsEntered = page.type("input[type='text']",email,{delay:50});
    return emailIsEntered;
}).then(function(){
    let passwordIsEntered = page.type("input[id='input-2']",password,{delay:50});
    return passwordIsEntered;
}).then(function(){
    let loginButtonClicked = page.click("button[data-analytics='LoginPassword']");
    return loginButtonClicked;
}).then(function(){
    let clickOnAlgoPromise = waitAndClick("a[data-attr1='algorithms']",page);
    return clickOnAlgoPromise;
}).then(function(){
    let getToWarmup = waitAndClick("input[value='warmup']",page);
    return getToWarmup;
}).then(function(){

    let waitFor3Sec = page.waitForTimeout(3000);
    return waitFor3Sec;
}).then(function(){
    let allChallangesPromise = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled");
    return allChallangesPromise;
}).then(function(questionArr){
    console.log("no of ques",questionArr.length);
    console.log(codesObj.answers.length);
    let questionsWillBeSolved = questionSolver(page,questionArr[0],codesObj.answers[0]);
    return questionsWillBeSolved;
})
.catch(function(err){
    console.log(err);
})



function waitAndClick(selector,cpage){
    return new promise(function(resolve,reject){
        let waitForModalPromise = cpage.waitForSelector(selector);
        waitForModalPromise.then(function(){
            let clickModal = cpage.click(selector);
            return clickModal;
        }).then(function(){
            resolve();
        }).catch(function(err){
            reject();
        })
    })
}

function questionSolver(page,question,answer){
    return new promise(function(resolve,reject){
        let questionWillBeClicked = question.click();
        questionWillBeClicked.then(function(){
             let editorInFocus = waitAndClick(".monaco-editor.no-user-select .vs",page);
            return editorInFocus;
        }).then(function(){
            return waitAndClick('input[type="checkbox"]',page);
        }).then(function(){
            return page.waitForSelector('textarea.custominput');
        }).then(function(){
            return page.type("textarea.custominput",answer,{delay:10});
        }).then(function(){
            let ctrlIsPressed = page.keyboard.down('Control');
            return ctrlIsPressed;
        }).then(function(){
            let aIsPressed = page.keyboard.press('A',{delay:100});
            return aIsPressed;
        }).then(function(){
            let xIsPressed = page.keyboard.press('X',{delay:100});
            return xIsPressed;
        }).then(function(){
            let ctrlIsUnpressed = page.keyboard.up('Control');
            return ctrlIsUnpressed;
        }).then(function(){
            let  mainEditorInFocus = waitAndClick(".monaco-editor.no-user-select .vs",page);
            return mainEditorInFocus;
        }).then(function(){
            let ctrlIsPressed = page.keyboard.down('Control');
            return ctrlIsPressed;
        }).then(function(){
            let aIsPressed = page.keyboard.press('A',{delay:100});
            return aIsPressed;
        }).then(function(){
            let vIsPressed = page.keyboard.press('V',{delay:100});
            return vIsPressed;
        }).then(function(){
            let ctrlIsUnpressed = page.keyboard.up('Control');
            return ctrlIsUnpressed;
        }).then(function(){
            let submitIsPressed = page.click('.hr-monaco-submit',{delay:50});
        }).then(function(){
             resolve();
        }).catch(function(err){
            reject();
        })
    })
}