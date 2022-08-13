//insights - fullPage search , saperate , shorter form html, use this fun/n -> $("").find()


const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");

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

    ///////////    finding the tables' html and from that html- finding the winning team's table   ///////////////

    let inningArr = $(".ds-bg-fill-content-prime.ds-rounded-lg .ds-mb-4");
    for(let i=0;i<inningArr.length;i++){
                ////Team Names////////
        tableTeamNameEle = $(inningArr[i]).find(" .ds-text-tight-s.ds-font-bold.ds-uppercase")
        let teamName = tableTeamNameEle.text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim(); // to remove extra space
        // console.log(teamName);

                ////Table Batsmans
        let allTable = $(inningArr[i]).find(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed");
            for(let i=0;i<allTable.length;i++){
                let hasClass = $(allTable[i]).hasClass("ci-scorecard-table");
                if(hasClass){
                    let finalTableEle = allTable[i]; //final bowling table
                    // console.log($(finalTableEle).text());
                    let allBowlers = $(finalTableEle).find("tbody>tr");
                    
                    for(let j=0;j<allBowlers.length;j++){
                        allColumnOfPlayer = $(allBowlers[j]).find("td");
                        
                        if(allColumnOfPlayer.length > 5){
                            let hrefPlayer = $(allColumnOfPlayer[0]).find("a").attr("href");  // creating link using link in the attribute of anchor tag   
                            let fullLink = "https://www.espncricinfo.com/" + hrefPlayer;      // completing the link
                            // console.log();
                            let playerName = $(allColumnOfPlayer[0]).text();
                            
                            // getBday = (fullLink,playerName,teamName);

                            request(fullLink,cb);
                            function cb(err,response,html){
                                if(err){
                                    console.log(err);
                                }else{
                                    let $ = cheerio.load(html);
                                    let bdayArr = $(".ds-text-title-s.ds-font-bold.ds-text-ui-typo");
                                    let bdy = $(bdayArr[1]).text();
                                    console.log(`${playerName} plays for ${teamName} was born on ${bdy}`);
                                }
                            }
                        }
                    }
                
                }
            } 
    }



}

// function getBday(url,name,team){
    
//     request(url,cb);
//     function cb(err,response,html){
//         if(err){
//             console.log(err);
//         }else{
//             extractBirthday(html,name,team);
            
//         }
//     }
// }

// function extractBirthday(html,name,team){
    
//     let $ = cheerio.load(html);
//     let bdayArr = $(".ds-text-title-s.ds-font-bold.ds-text-ui-typo");
//     let bdy = $(bdayArr[1]).text();
//     console.log(`${name} plays for ${team} was born on ${bdy}`);
// }