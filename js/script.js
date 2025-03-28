const todos = [];
const RENDER_EVENT = 'render-todo';
const STORAGE_KEY = 'TODO_APPS';
const SAVED_EVENT = 'saved-todo';


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });
});

function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
   
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function generateId() {
    return +new Date();
}
   
function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    // console.log(todos);

    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';
   
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);

      if (!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
      } else {
        completedTODOList.append(todoElement);
      }
    }
});

function makeTodo(todoObject) {
    // Membuat elemen H2
    const textTile = document.createElement('h2');
    textTile.innerText = todoObject.task;

    // membuat elemen P untuk Timestamps
    const timestamp = document.createElement('p');
    timestamp.innerText = todoObject.timestamp;

    // Membuat elemen div
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTile, timestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);
    
    // membuat if else Jika isCompleted false (default)
    if (todoObject.isCompleted) {
      // Deklarasi dan inisialisasi variabel Undo Button
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
   
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(todoObject.id);
      });
   
      // Deklarasi dan inisialisasi variabel Trash Button
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
   
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(todoObject.id);
      });
      
      // Menambahkan Undo Button dan Trash Button ke dalam container
      container.append(undoButton, trashButton);
    } else {
      // Deklarasi dan inisialisasi variabel Check Button
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(todoObject.id);
      });
      
      container.append(checkButton);
    }
   
    return container;
}

function addTaskToCompleted (todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
 
  if (todoTarget === -1) return;
 
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
 
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof(Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  alert(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  // ...
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});