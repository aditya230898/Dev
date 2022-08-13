let addbtn = document.querySelector(".add-button");
let removebtn = document.querySelector(".remove-button");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.getElementById('textareaCont');
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let colors = ["lightpink","lightblue","lightgreen","black"];
let modalPriorityColor = colors[colors.length - 1];

//will maintain an array of objects containing tickets for tool-box click functionality
let ticketArr = [];
// .will add to the arr where ticket is created

// retieving from local storage if data already exists
if(localStorage.getItem("jira_tickets")){
    // retrieve and display tickets
    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}


// listener for tool-box colors
for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",(e)=>{
        let currentToolboxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj,idx)=>{
            return currentToolboxColor === ticketObj.ticketColor;
        })

        //remove prev tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        // display new filtered tickets
        filteredTickets.forEach((ticketObj,idx)=>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
        })
    })
//  Double clcik to view all tickets functionality  
    toolBoxColors[i].addEventListener("dblclick",(e)=>{

        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }
        ticketArr.forEach((ticketObj,idx)=>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
        })
    })
}

// listner for modal priority coloring
allPriorityColors.forEach((colorElem, idx)=>{
    colorElem.addEventListener('click',(e)=>{
        allPriorityColors.forEach((priorityColorElem,idx)=>{
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    })
})

addbtn.addEventListener("click",(e)=>{
// Task 1). display modal
// Task 2) generate ticket

// add flag=false -> modal dispay
// addflag = true -> modal none
    addFlag = !addFlag;
    if(addFlag){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
    }
})

removebtn.addEventListener("click",(e)=>{

    if(removeFlag){
        removebtn.style.color = 'gainsboro';
    }else{
        removebtn.style.color = 'red';
    }

    removeFlag = !removeFlag;
    // console.log(removeFlag);
})

modalCont.addEventListener("keydown", (e) =>{
    let key = e.key;
    if(key === 'Enter'){ 
        addFlag = !addFlag;
        
        createTicket(modalPriorityColor,textareaCont.value);
        setModalToDefault();
        modalPriorityColor = colors[colors.length - 1];
    }
})

function createTicket(ticketColor,ticketTask,ticketID){
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`
            <div class = "ticket-color ${ticketColor}"></div>
            <div class = "ticket-id">#${id}</div>
            <div class = "ticket-area" spellcheck="false">${ticketTask}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
            `;
            mainCont.appendChild(ticketCont);

            // create obj of tickets and add to array only if id not existed early to avoid duplicacy while filter functionality
            if(!ticketID){
            ticketArr.push({ticketColor,ticketTask,ticketID : id});
            localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
            }
            handleRemoval(ticketCont,id);
            handleLock(ticketCont,id);
            handleColor(ticketCont,id);

}

function handleRemoval(ticket,id){
    //removeFlag -> true -> return
    ticket.addEventListener("click",(e)=>{
        if(!removeFlag) return;

        ticket.remove(); // UI removal    
        
        let idx = getTicketIdx(id);

        // DataBase removal
        ticketArr.splice(idx,1);
        let strTicketsArr = JSON.stringify(ticketArr);
        localStorage.setItem("jira_tickets",strTicketsArr);

            
    })
}
function handleLock(ticket,id){
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".ticket-area")
    ticketLock.addEventListener("click",(e)=>{
        
        let ticketIdx = getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");
        }else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }

        // modify data in localStorage( Ticket Task)
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    })
}
function handleColor(ticket,id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        
        let currentTicketColor = ticketColor.classList[1];
        //get ticket color idx
        let currentTicketColorIdx = colors.findIndex((color)=>{
            return currentTicketColor === color;
        })
        console.log(currentTicketColor,currentTicketColorIdx);
        
        let newTicketColorIdx = (currentTicketColorIdx + 1) % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        console.log(newTicketColor)

        // modify data in localStorage after change color(priority color change)
        //get ticket idx from the ticket arr
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    })
}

function setModalToDefault(){
    
    modalCont.style.display = "none";
    textareaCont.value = "";
    
    allPriorityColors.forEach((priorityColorElem,idx)=>{
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length -1].classList.add("border");   
}

function getTicketIdx(idx){
    let ticketIdx = ticketArr.findIndex((ticketObj)=>{
        return ticketObj.ticketID === idx;
    })
    return ticketIdx;
}