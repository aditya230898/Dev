const request = require("request");
const cheerio = require("cheerio");

function getDetail(allTable,hwt,hwtNmae,$){
    
    for(let i=0;i<allTable.length;i++){
        let hasClass = $(allTable[i]).hasClass("ci-scorecard-table");
        if(hasClass == false){
            let finalTableEle = allTable[i]; //final bowling table
                    // console.log($(finalTableEle).text());
            let allBowlers = $(finalTableEle).find("tbody>tr");
                    
            for(let j=0;j<allBowlers.length;j++){
                        allColumnOfPlayer = $(allBowlers[j]).find("td");
                        let playerName = $(allColumnOfPlayer[0]).text();
                        let playerWickets = $(allColumnOfPlayer[4]).text();
                if(allColumnOfPlayer.length > 5){
                            // console.log(playerName);
                            // console.log(playerWickets);
                    if(playerWickets>hwt){
                                hwt = playerWickets;
                                hwtNmae = playerName;
                            }
                    }
                    }
                }
    }
    console.log(`highest wicket taker is : ${hwtNmae} , and he took : ${hwt} wickets`);
}

module.exports = {
    getDetails: getDetail
}