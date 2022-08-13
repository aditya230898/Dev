const { dir } = require("console");
let fs = require("fs");
let path = require("path");
const { deserialize } = require("v8");

// 01) Input to directory path,check and create directory
let inputArr = process.argv.slice(2);
let command = inputArr[0];
let types = {
    media: ["mp4","mp3","mkv","png","jpeg"],
    archives: ["zip","rar","7z","tar","gz","ar","iso","xz"],
    documents: ["docx","doc","pdf","xlsx","xls","odt","ods","odp","odg","odf","txt","ps","tex"],
    app: ["exe","dmg","pke","deb"]
}

switch(command){
    case "tree":
        treeFn(inputArr[1]); 
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please enter valid command🙏");
        break;
}

function treeFn(dirpath){
    
    if(dirpath==undefined){
        console.log("Kindle enter the path");
        return;
    }else{
        let doesExist = fs.existsSync(dirpath);
        if(doesExist){
            treeHelper(dirpath,"");
        }else{
            console.log("kindly enter valid path");
            return;
        }
    }
}

function treeHelper(dirPath,indent){

    let isFile = fs.lstatSync( dirPath).isFile();
    if(isFile){
        let FileName = path.basename(dirPath);
        console.log(indent+"--"+FileName);
    }else{
        let dirName = path.basename(dirPath);
        console.log(indent+"->"+dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i=0; i<childrens.length;i++){
            childPath = path.join(dirPath,childrens[i]);
            treeHelper(childPath,indent+"\t");
        }
    }
}

function organizeFn(dirPath){
    // 02) create the organized directory
    let destPath;
    if(dirPath == undefined){
        console.log("Kindly enter path");
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(!doesExist){
            console.log("Please enter valid path");
            return;
        }else{
            destPath = path.join(dirPath,"organized_files");
            if(!fs.existsSync(destPath)){
                fs.mkdirSync(destPath);
            }
        }
        organizeHelper(dirPath,destPath)
    }
}

function organizeHelper(src,dest){

    // 03) identify category of all files present in src directory

    let childNames = fs.readdirSync(src);                   //array of files and folders in that directory
    // console.log(childNames);
    for(let i=0;i<childNames.length;i++){
        let childAddress = path.join(src,childNames[i]);    //joining the src address to file present and checking for ony the files present 
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);       //finding the category/type of the file

            // 04) copy/cut files to the destination folder
            
            sendFiles(childAddress,dest,category);
        }
    }
}

function sendFiles(srcFilePath,dest,category){
    let categoryPath = path.join(dest,category);            //created a path to destination - category folder and if it doesnt exist then create one
    if(!fs.existsSync(categoryPath)){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);              //created a destination path with filename
    let destFilePath = path.join(categoryPath,fileName);
    // console.log(destFilePath);
    fs.copyFileSync(srcFilePath,destFilePath);              //copied/created new file and copied the data there ,, can unlink if cut
    fs.unlinkSync(srcFilePath);
    console.log(fileName," copied to ",category);

}

function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1);                                     //getting the extensions and removing the "."
    for(let type in types){
        let currArray = types[type];
        for(let i=0;i<currArray.length;i++){
            if(ext==currArray[i]){
                return type;
            }
        }
    }
    return "others";
}

function helpFn(){
    console.log(`
    List of all commands:
    tree directoryPath
    organize directoryPath
    help directoryPath
    `);
}