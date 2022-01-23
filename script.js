
/** 
 * Task object with some properties
*/
var taskObj = {
  title: "title",
  description: "Desc",
  id: 0,
  priority: "",
  assignedTo: "",
  status: 1,
  type:'',
};

var submitted = false;

/**
 * Getter function to get data from localStorage
 */
function getLocalItem(key) {
  var data = window.localStorage.getItem(key);
  return data;
}

/**
 * Setter function to set/update data into localStorage
 */
function setlocalItem(key, value) {
  window.localStorage.setItem(key, value);
}

/**  
 *  initialCall() call initially on load
*/
function initialCall()
{
  getTODOTask();
  getInProgressTask();
  getInReviewTask();
  getDoneTask();
}

initialCall();


var el = document.getElementById("button1"); // Add button reference
el.addEventListener("click", function () { // click event on add button.
  submitted = true;
  var form = document.getElementById("myForm");
  var formData = new FormData(form);
  taskObj.title = convertCase(formData.get("title"));
  taskObj.description = formData.get("description");
  taskObj.priority = formData.get("priority");
  taskObj.assignedTo = formData.get("assignedTo");
  taskObj.id = generateUid();
  taskObj.type=formData.get("type");
  if (validateForm()) {
    var errorMessages = document.getElementById("error");
    document.getElementById("title").classList.add("input-error");
    document.getElementById("error").classList.add("error-msg");
    errorMessages.innerHTML = "Field is required";
    document.getElementById("button1").disabled = true;
    return;
  }
  let taskList = getLocalItem("taskList");
  taskList = JSON.parse(taskList);
  if (taskList) {
    taskList.splice(0, 0, taskObj);
    setlocalItem("taskList", JSON.stringify(taskList));
  } else {
    setlocalItem("taskList", JSON.stringify([taskObj]));
  }
  document.getElementById("modals").style.display = "none";
  $("#modals").modal("hide");
  submitted = false;
  initialCall();
  location.reload();
});

/**
 * Form Validation
 */
function validateForm() {
  var form = document.getElementById("myForm");
  var formData = new FormData(form);
  for (var key of formData.entries()) {
    if (key[1] == "" && submitted && key[0] == "title") {
      return true;
    }
  }
  return false;
}

/**
 * 
 * Generate TaskID on the basis on last taskID
 */
function generateUid() {
  let currentId = window.localStorage.getItem("taskID");
  var Id = "TID-1000";
  if (currentId) {
    let cId = parseInt(currentId.split("-")[1]);
    let newID = "TID" + "-" + ++cId;
    Id = newID;
    window.localStorage.setItem("taskID", JSON.stringify(newID));
  } else {
    setlocalItem("taskID", JSON.stringify(Id));
  }
  return Id;
}

/**
 * onkeup event on input filed.
 */
function inputEvent() {
  var title = document.getElementById("title").value;
  var errorMessages = document.getElementById("error");
  document.getElementById("title").classList.remove("input-error");
  document.getElementById("error").classList.remove("error-msg");
  errorMessages.innerHTML = "";
  document.getElementById("button1").disabled = false;
  if (title == "") {
    var errorMessages = document.getElementById("error");
    document.getElementById("title").classList.add("input-error");
    document.getElementById("error").classList.add("error-msg");
    errorMessages.innerHTML = "Field is required";
  }
}

/**
 * 
 * Get All TODO task
 */
function getTODOTask() {
  let allTask = this.getLocalItem("taskList");
  if(!allTask){
    const taskCard = "<span>No tasks found in TO DO list </span>";
    const ele = document.createElement("div");
    ele.innerHTML = taskCard;
    document.getElementById("taskCard").appendChild(ele);
    return;
  }
  allTask = JSON.parse(allTask);
  let todoTask = allTask.filter((e) => e.status == 1);
  const ele = document.getElementById("taskCard");
  ele.innerHTML = '';
  if (todoTask.length) {
    todoTask.forEach((el) => {
     el.newtitle= el.title.length > 19  ? el.title.substring(0, 19)+'..' : el.title;
      const taskCard = `<div class="task-card" id="todo">
           <div class="task-id">
              <div><small>ID :${el.id}</small></div>
               <div class="form-group" id="form-Id">
                   <select class="form-control dropdown"  id="${ el.id}">
                     <option value="${1 + "/" + el.id}">To Do</option>
                     <option value="${2 + "/" + el.id}">In Progress</option>
                     <option value="${3 + "/" + el.id}">In Review</option>
                     <option value="${4 + "/" + el.id}">Done</option>
                   </select>
               </div>
               <div style="flex:1;"><img src="./assets/images/icons8-edit.svg" alt="${el.id}" srcset="" onclick="updateTask(event.target.alt)" style="width:20px; cursor:pointer;"></div>
           </div>
           <div>
               <h5 data-toggle="tooltip" title="${el.title}">${el.newtitle}</h5>
               <div class="task-detail">
               <span class="prt"><h6>${el.priority}</h6></span>
               <span class="icon"> <img src="./assets/images/user (1).png" alt="" srcset="" style="width:13px; height:13px;">  <h6>${el.assignedTo}</h6></span>
               <span class="type" id="${el.id+'do'}"><h6>${el.type}</h6></span>
               </div>
           </div>
       </div>`;

      const ele = document.createElement("div");
      ele.innerHTML = taskCard;
      document.getElementById("taskCard").appendChild(ele);
    if(el.type == 'Bug')
    {
        document.getElementById(el.id+'do').classList.add("errorClass");
    }else
    {
        document.getElementById(el.id+'do').classList.add("taskClass");
    }
    });
  } else
  {
    const taskCard = "<span>No tasks found in TO DO list </span>";
    const ele = document.createElement("div");
    ele.innerHTML = taskCard;
    document.getElementById("taskCard").appendChild(ele);
  }
}


/**
 * 
 * Get inprogress task list.
 */
function getInProgressTask() {
  let allTasks = this.getLocalItem("taskList");
  if(!allTasks){
    const taskCard = "<span>No tasks found in Progress list </span>";
    const ele = document.createElement("div");
    ele.innerHTML = taskCard;
    document.getElementById("InProgress").appendChild(ele);
    return;
  }
  allTasks = JSON.parse(allTasks);
  var inProgressTask = allTasks.filter((e) => e.status == 2);
    const ele =  document.getElementById("InProgress")
    ele.innerHTML = ''
  if (inProgressTask.length) {
    inProgressTask.forEach((el) => {
    el.newtitle= el.title.length > 19  ? el.title.substring(0, 19)+'..' : el.title;
      const taskCard = `<div class="task-card" id="progress">
            <div class="task-id">
               <div><small>ID :${el.id}</small></div>
                <div class="form-group">
                    <select class="form-control dropdown"  id="${ el.id}">
                    <option value="${2 + "/" + el.id}">In Progress</option>
                      <option value="${1 + "/" + el.id}">To Do</option>
                      <option value="${3 + "/" + el.id}">In Review</option>
                      <option value="${4 + "/" + el.id}">Done</option>
                    </select>
                </div>
                <div style="flex:1;"><img src="./assets/images/icons8-edit.svg" alt="${el.id}" srcset="" onclick="updateTask(event.target.alt)" style="width:20px; cursor:pointer;"></div>
            </div>
            <div>
                <h5 data-toggle="tooltip" title="${el.title}">${el.newtitle}</h5>
                <div class="task-detail">
                <span class="prt"><h6>${el.priority}</h6></span>
                <span class="icon"> <img src="./assets/images/user (1).png" alt="" srcset="" style="width:13px; height:13px;">  <h6>${el.assignedTo}</h6></span>
                <span class="type" id="${el.id+'pro'}"><h6>${el.type}</h6></span>
                </div>
            </div>
        </div>`;
      const ele = document.createElement("div");
      ele.innerHTML = taskCard;
      document.getElementById("InProgress").appendChild(ele);
      if(el.type == 'Bug')
      {
          document.getElementById(el.id+'pro').classList.add("errorClass");
      }else
      {
          document.getElementById(el.id+'pro').classList.add("taskClass");
      }
    });
  }else{
    const taskCard = "<span>No tasks found in Progress list </span>";
    const ele = document.createElement("div");
    ele.innerHTML = taskCard;
    document.getElementById("InProgress").appendChild(ele);
  }
}


/**
 * 
 * Get InReview task List
 */
function getInReviewTask() {
    let allTasks = this.getLocalItem("taskList");
    if(!allTasks) 
    {
      const taskCard = "<span>No tasks found in Review list </span>";
      const ele = document.createElement("div");
      ele.innerHTML = taskCard;
      document.getElementById("InReview").appendChild(ele);
      return;
    }
    allTasks = JSON.parse(allTasks);
    let  inProgressTask = allTasks.filter((e) => e.status == 3);
    const ele =  document.getElementById("InReview")
    ele.innerHTML = '';
   
    if (inProgressTask.length) {
      inProgressTask.forEach((el) => {
        el.newtitle= el.title.length > 19  ? el.title.substring(0, 19)+'..' : el.title;
        const taskCard = `<div class="task-card" id="review">
              <div class="task-id">
                 <div><small>ID :${el.id}</small></div>
                  <div class="form-group">
                      <select class="form-control dropdown"  id="${ el.id}">
                        <option value="${3 + "/" + el.id}">In Review</option>
                        <option value="${1 + "/" + el.id}">To Do</option>
                        <option value="${2 + "/" + el.id}">In Progress</option>
                        <option value="${4 + "/" + el.id}">Done</option>
                      </select>
                  </div>
                  <div style="flex:1;"><img src="./assets/images/icons8-edit.svg" alt="${el.id}" srcset="" onclick="updateTask(event.target.alt)" style="width:20px; cursor:pointer;"></div>
              </div>
              <div>
                  <h5 data-toggle="tooltip" title="${el.title}">${el.newtitle}</h5>
                  <div class="task-detail">
                  <span class="prt"><h6>${el.priority}</h6></span>
                  <span class="icon"> <img src="./assets/images/user (1).png" alt="" srcset="" style="width:13px; height:13px;">  <h6>${el.assignedTo}</h6></span>
                  <span class="type" id="${el.id+'rev'}"><h6>${el.type}</h6></span>
                  </div>
              </div>
          </div>`;
        const ele = document.createElement("div");
        ele.innerHTML = taskCard;
        document.getElementById("InReview").appendChild(ele);
        if(el.type == 'Bug')
        {
            document.getElementById(el.id+'rev').classList.add("errorClass");
        }else
        {
            document.getElementById(el.id+'rev').classList.add("taskClass");
        }
      });
    } else
    {
      const taskCard = "<span>No tasks found in Review list </span>";
      const ele = document.createElement("div");
      ele.innerHTML = taskCard;
      document.getElementById("InReview").appendChild(ele);
    }
  }


  /**
   * 
   * Get Done task List
   */
function getDoneTask() {
    let allTasks = this.getLocalItem("taskList");
    if(!allTasks) {
      const taskCard = "<span>No tasks found in Done list </span>";
      const ele = document.createElement("div");
      ele.innerHTML = taskCard;
      document.getElementById("doneTask").appendChild(ele);
      return;
    }
    allTasks = JSON.parse(allTasks);
    let  inProgressTask = allTasks.filter((e) => e.status == 4);
    const ele =  document.getElementById("doneTask")
    ele.innerHTML = '';
   
    if (inProgressTask.length) {
      inProgressTask.forEach((el) => {
        el.newtitle= el.title.length > 19  ? el.title.substring(0, 19)+'..' : el.title;
        const taskCard = `<div class="task-card" id="done">
              <div class="task-id">
                 <div><small>ID :${el.id}</small></div>
                  <div class="form-group">
                      <select class="form-control  dropdown"  id="${ el.id}">
                        <option value="${4 + "/" + el.id}">Done</option>
                        <option value="${3 + "/" + el.id}">In Review</option>
                        <option value="${1 + "/" + el.id}">To Do</option>
                        <option value="${2 + "/" + el.id}">In Progress</option>
                      </select>
                  </div>
                  <div style="flex:1;"><img src="./assets/images/icons8-edit.svg" alt="${el.id}" srcset="" onclick="updateTask(event.target.alt)" style="width:20px; cursor:pointer;"></div>
              </div>
              <div>
                  <h5 data-toggle="tooltip" title="${el.title}">${el.newtitle}</h5>
                  <div class="task-detail">
                  <span class="prt"><h6>${el.priority}</h6></span>
                  <span class="icon"> <img src="./assets/images/user (1).png" alt="" srcset="" style="width:13px; height:13px;">  <h6>${el.assignedTo}</h6></span>
                  <span class="type" id="${el.id+'dn'}"><h6>${el.type}</h6></span>
                 </div>
              </div>
          </div>`;
        const ele = document.createElement("div");
        ele.innerHTML = taskCard;
        document.getElementById("doneTask").appendChild(ele);
        if(el.type == 'Bug')
        {
            document.getElementById(el.id+'dn').classList.add("errorClass");
        }else
        {
            document.getElementById(el.id+'dn').classList.add("taskClass");
        }
      });
    } else{
      const taskCard = "<span>No tasks found in Done list </span>";
      const ele = document.createElement("div");
      ele.innerHTML = taskCard;
      document.getElementById("doneTask").appendChild(ele);
    }
  }


/**
 * onChange event on select tag to change the status of a task.
*/
$("select").on("change", function (e) {
  if(!this.value.includes('TID')) return;
  let tId = this.value;
  let status = tId.split("/")[0];
  let id = tId.split("/")[1];
  let allTasks = window.localStorage.getItem("taskList");
  allTasks = JSON.parse(allTasks);
  if (allTasks) {
    allTasks.forEach((el) => {
      if (el.id == id) 
      (el.status = parseInt(status));
    });
  }
  setlocalItem("taskList", JSON.stringify(allTasks));
  setTimeout(() => {
     initialCall()
    location.reload();
  },100);
});


/**
 * Convert a string to Titlecases
 */
function convertCase(str)
{
    if(!str){return ''}
    const titleStr= str.split(' ')
    .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(' ');
    return titleStr;
}

/**
 * Update a task
 */
function updateTask(Id)
{
  console.log(Id)
  let allTasks = this.getLocalItem("taskList");
  if(!allTasks)return;
  allTasks = JSON.parse(allTasks);
  let  taskObject = allTasks.filter((e) => e.id == Id);
  taskObject=taskObject[0];
  taskObj=new Object(taskObject);
  document.forms['myForm']['title'].value = taskObject.title
  document.forms['myForm']['description'].value = taskObject.description
  document.forms['myForm']['type'].value = taskObject.type
  document.forms['myForm']['priority'].value = taskObject.priority
  document.forms['myForm']['assignedTo'].value = taskObject.assignedTo
  document.getElementById('button1').style.display='none';
  document.getElementById('update').style.display='block';
  document.getElementById('exampleModalLongTitle').innerHTML='Update | '+Id;
  $('#modals').modal('show');
}

/**
 * Click event on create button.
 */
function addTask()
{
  document.getElementById('exampleModalLongTitle').innerHTML='Add Task';
  document.getElementById('button1').style.display='block';
  document.getElementById('update').style.display='none';
  document.getElementById("myForm").reset();

}


var update=document.getElementById('update') // update button reference
update.addEventListener('click',function(){ // update task on click update button
  submitted=true
  let allTasks = window.localStorage.getItem("taskList");
  allTasks = JSON.parse(allTasks);
  let form = document.getElementById("myForm");
  let formData = new FormData(form);
  taskObj.title = convertCase(formData.get("title"));
  taskObj.description = formData.get("description");
  taskObj.priority = formData.get("priority");
  taskObj.assignedTo = formData.get("assignedTo");
  taskObj.type=formData.get("type");
  if (validateForm()) {
    var errorMessages = document.getElementById("error");
    document.getElementById("title").classList.add("input-error");
    document.getElementById("error").classList.add("error-msg");
    errorMessages.innerHTML = "Field is required";
    return;
  }
  let  taskIndex = allTasks.findIndex(e=> e.id == taskObj.id);
  allTasks.splice(taskIndex,1,taskObj);
  setlocalItem('taskList',JSON.stringify(allTasks));
  $('#modals').modal('hide');
  setTimeout(()=>{
    submitted=false;
    initialCall();
    location.reload();
  },100)
})