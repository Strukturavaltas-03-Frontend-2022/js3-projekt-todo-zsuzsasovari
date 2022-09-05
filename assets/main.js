let all = [];
let lastAddedIndex = -1;

const newItem = () => {
    let inputField = document.querySelector('.addText');
    if(inputField.value === ''){
        inputField.placeholder = 'Give me something to do!';
        return
    }
    let todoItem = {
        text: inputField.value,
        done: false
    };
    all.push(todoItem);
    lastAddedIndex = all.length-1;
    inputField.value = '';
    localStorage.setItem('todolist', JSON.stringify(all));
    update();
}

let deleteItem = (index) => {
    all.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(all));
    update();
}

const generateTodoItemTemplate = (text, index) => {
    if(lastAddedIndex === index){
        lastAddedIndex = -1;
        return `<div class="item fadeIn"><input type="checkbox" id="cb${index}" class="checkbox">${text}
        <button class="deleteTask" id="del${index}" onclick="deleteItem(${index});"><i class="fa fa-trash" aria-hidden="true"></i></button></div>`;
    } 
    return `<div class="item"><input type="checkbox" id="cb${index}" class="checkbox">${text}
    <button class="deleteTask" id="del${index}" onclick="deleteItem(${index});"><i class="fa fa-trash" aria-hidden="true"></i></button></div>`;
}

const generateCompletedItemTemplate = (text) => {
    let completedTemplate = `<div class="completedItem"><input type="checkbox" checked>${text}</div>`;
    return completedTemplate;
}

const addEventListeners = (index) => {
    let checkbox = document.querySelector('#cb' + index);
    checkbox.addEventListener('change', () => {
        all[index].done = true;
        localStorage.setItem('todolist', JSON.stringify(all));
        update();
    });
    let itemParent = checkbox.parentElement;
    itemParent.addEventListener("mouseover", () => {
        let deleteButton = document.querySelector(`#del${index}`);
        deleteButton.style.visibility = "visible";
      }); 
    itemParent.addEventListener("mouseleave", () => {
    let deleteButton = document.querySelector(`#del${index}`);
    deleteButton.style.visibility = "hidden";
    });
}

const showHide = () => {
    let completed = document.querySelector('.completed');
    let btn = document.querySelector('.showHide');
    if( !completed.classList.contains('invisible')){
        completed.classList.add('invisible');
        btn.innerText = 'Show completed';
    } else {
        completed.classList.remove('invisible');
        btn.innerText = 'Hide completed';
    }
}

const clearAll = () => {
    all = [];
    localStorage.setItem('todolist', JSON.stringify(all));
    update();
}

const update = () => {
    let pendingTask = document.querySelector('.pendingTask');
    let completedTask = document.querySelector('.completedTask');
    let pendingHeader = document.querySelector('#pendingHeader');
    let completedHeader = document.querySelector('#completedHeader');
    pendingTask.innerHTML = '';
    completedTask.innerHTML = '';
    
    all.forEach((item, index) => {
        if(item.done === true){
            completedTask.insertAdjacentHTML('beforeend', generateCompletedItemTemplate(item.text));
        } else {
            pendingTask.insertAdjacentHTML('beforeend',generateTodoItemTemplate(item.text,index));
            addEventListeners(index);
        }
    });
    let pendingCount = all.filter((item) => item.done === false).length;
    pendingHeader.innerHTML = `You have ${pendingCount} pending items`;
    let completedpercent = all.length === 0 ? 0 : ((all.filter((item) =>item.done ===true).length / all.length)*100);
    completedHeader.innerHTML = `Completed tasks:${completedpercent}%`;
}

let localStorageItem = JSON.parse(localStorage.getItem('todolist'));
if(localStorageItem){
    all = localStorageItem;
}
update();

document.querySelector('.date').innerHTML = new Date().toLocaleDateString("en-US", {
    weekday: "long",    
    year: "numeric",
    month: "2-digit",
    day: "2-digit",      
});