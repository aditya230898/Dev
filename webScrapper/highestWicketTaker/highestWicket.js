let url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const hwtDetailsobj = require("./hwtDetails");
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
    let wTeamName;
    /////////////////finding the winning team name///////////////
    let arr = $(".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo-title.ds-mb-2");
    for(let i=0; i<arr.length;i++){
        let hasClass = $(arr[i]).hasClass("ds-opacity-50");
        if(hasClass == false){
            let teamNameEle = $(arr[i]).find(".ds-text-tight-l.ds-font-bold");
            // console.log(teamNameEle.text());
            wTeamName = teamNameEle.text();
            wTeamName = wTeamName.trim(); // to rempve extra spaces 
        }
    }
    ///////////    finding the tables' html and from that html- finding the winning team's table   ///////////////

    let inningArr = $(".ds-bg-fill-content-prime.ds-rounded-lg .ds-mb-4");
    for(let i=0;i<inningArr.length;i++){
        tableTeamNameEle = $(inningArr[i]).find(" .ds-text-tight-s.ds-font-bold.ds-uppercase")
        let teamName = tableTeamNameEle.text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim(); // to remove extra spaces
        // console.log(teamName);  //found the team names from the tables
        
        let hwt = 0;
        let hwtNmae = "";
        if(wTeamName==teamName){  //if winning team name = team name of the tables retrieved => this is the team for whom we need to find the bowler
            
            let allTable = $(inningArr[i]).find(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed");
           hwtDetailsobj.getDetails(allTable,0,"",$);
           
           
        }
    }
}