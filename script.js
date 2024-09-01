let priorityColor = document.querySelector(".priorityColor")
let deleteBtn = document.querySelector(".delete")
let addBtn = document.querySelector(".add")
let allTicketsBtn = document.querySelector(".all")
let inputSearchBar = document.querySelector(".inputsearch")
let searchBtn = document.querySelector(".srchBtn")
let ticketAdder = document.querySelector(".ticketAdder")
let ticketPriorityBox = document.querySelector(".ticketpriority")
let ticketContainer = document.querySelector(".ticketContainer")
let allBoxes = document.querySelectorAll(".ticketpriority .box")   //all box ko select kiya hai
let ticketadderTextPart = document.querySelector(".textPart")


let taskColor = "red";
let activeDelete = false;

let taskArray = [];                                     //create a taskArray array
let oldData = localStorage.getItem("TaskManager");      //access the local storage data
if (oldData){
    taskArray = [...JSON.parse(oldData)];
    ticketAdderfn(taskArray);
}
let colorsArray = ['red', 'blue', 'green', 'black'];    //create a color array


deleteBtn.addEventListener("click", function () {
    activeDelete = !activeDelete;
    deleteBtn.classList.toggle("red")
})

addBtn.addEventListener("click", function () {
    ticketAdder.classList.toggle("noDisplay")          //phle se class hogi to remove kar dega or nhi hogi to laga dega
})

//Border Priority
ticketPriorityBox.addEventListener("click", function (event) {
    let clickedBox = event.target;                     //colour ko access karne ke liye

    if (clickedBox.classList[0] == 'box') {            //only 4 colour ko access karne ke liye
        allBoxes.forEach(function (box) {
            box.classList.remove("border")             //3 pese hatane ke liye or 1 per laga ne ke liye 
        });
        taskColor = clickedBox.classList[1];

        clickedBox.classList.add("border");            //border lagane ke liye sab per 
    }
})

ticketadderTextPart.addEventListener("keydown", function (event) {            //keybord ka event lisner laga ege kyu ki enter se yicket generate karne hai.
    if (event.key == "Enter") {                          //activate a Enter key
        let taskObj = {                                  //create a uniq id 
            task: ticketadderTextPart.value,
            color: taskColor,
            id: Date.now()
        }
        taskArray.push(taskObj);
        ticketadderTextPart.value = "";                  //textPare pe se text ko remove karne ke li or naya access karne ke liye

        localStorage.setItem("TaskManager", JSON.stringify(taskArray))           //add local storage


        ticketAdderfn(taskArray);                           //ticketAdderfn ko call karna 

        //ticketAdder.classList.toggle("noDisplay");           //ticketAdder ko hatane ke liye
        //or
        addBtn.click();                               //ticketAdder ko hatane ke liye
    }
})

function ticketAdderfn(arr) {                        //ticket dekhne ke liye function create kiya.
    ticketContainer.innerHTML = "";                  //ticket container ko khali kar dege har bar. kyu ki repeat na ho.
    for (let i = 0; i < arr.length; i++) {
        let ticket = document.createElement("div")    //create a div
        ticket.classList.add("ticket")                //add a class

        let { color, task, id } = arr[i];

        // ticket ke ander metter dalne ke liye
        ticket.innerHTML = `<div class="taskColor ${color}"></div>     
            <div class="taskText">
                <p class='editTask' > ${task}</p>
                <samp class="lock"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"
                        fill="currentColor">
                        <path
                            d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM5 10V20H19V10H5ZM11 14H13V16H11V14ZM7 14H9V16H7V14ZM15 14H17V16H15V14ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16Z">
                        </path>
                    </svg></samp>
            </div>`

        //lock unlock functions
        let lockBtn = ticket.querySelector(".lock")
        let editTask = ticket.querySelector(".editTask")
        let lock = true;
        lockBtn.addEventListener("click", function () {
            if (lock == true) {
                //unlock

                editTask.setAttribute("contenteditable", "true")
                lockBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM10 15V17H14V15H10Z"></path></svg>`
            }
            else {
                //lock
                editTask.setAttribute("contenteditable", "false")
                let updatedTask = editTask.innerHTML;
                arr[i].task = updatedTask;

                localStorage.setItem("TaskManager", JSON.stringify(taskArray))           //add local storage

                lockBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM5 10V20H19V10H5ZM11 14H13V16H11V14ZM7 14H9V16H7V14ZM15 14H17V16H15V14ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16Z"></path></svg>`
            }
            lock = !lock;
        })

        //delete functionality

        ticket.addEventListener("dblclick", function () {
            if (activeDelete == true) {

                //1) remove from UI 2) remove from taskArray
                ticketContainer.removeChild(ticket);

                let filtertedArray = taskArray.filter(function (taskObj) {
                    return taskObj.id != id;
                })
                taskArray = [...filtertedArray];

                localStorage.setItem("TaskManager", JSON.stringify(taskArray))           //add local storage

                // console.log(taskArray)
            }
        })

        //color strip functionality
        let colorStrip = ticket.querySelector(".taskColor");          //ticket me se color per click karne se color change ho.
        colorStrip.addEventListener("click", function () {
            let prevColor = arr[i].color;                                    //ticket ka konsa color ha at a present time
            let preIdx = colorsArray.findIndex(function (color) {            //ab us ka index chahiye
                return color == prevColor;
            });
            let nextColorIdx = (preIdx + 1) % 4;                        //color ko 

            //update on UI
            colorStrip.classList.remove(prevColor);       //phle color ko remove karege
            colorStrip.classList.add(colorsArray[nextColorIdx])              //fir color ko add kare ge or 2 color change ho jaega 

            //update on taskArray
            arr[i].color = colorsArray[nextColorIdx];              //color change ho jaega

            localStorage.setItem("TaskManager", JSON.stringify(taskArray))           //add local storage

        })
        ticketContainer.appendChild(ticket)       //print karane ke liye innerHTML ko

    }
}

//select a color wise ticket
priorityColor.addEventListener("click", function (event) {
    let clickedEle = event.target;

    if (clickedEle.classList[0] == 'box') {
        let color = clickedEle.classList[1];

        let filteredArray = taskArray.filter(function (taskObj) {
            return taskObj.color == color;
        })
        ticketAdderfn(filteredArray)
    }

})

//All ticket button to work
allTicketsBtn.addEventListener("click", function (event) {
    ticketAdderfn(taskArray)
})

//search bar funclality
searchBtn.addEventListener("click", function(){
    let searchquery = inputSearchBar.value;
    inputSearchBar.value = "";

    let filteredArray = taskArray.filter(function(taskObj){
        return taskObj.task.toLowerCase().includes(searchquery.toLowerCase())
    })
    ticketAdderfn(filteredArray);
})


//local Storage me update

// localStorage.setItem("TaskManager", JSON.stringify(taskArray))