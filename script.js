const categoryToAdd = document.getElementById('new-category');
const todoInput = document.getElementById('todo-text');
const todoList = document.getElementById('todo-list');

let todos = [];
let categories = ['General', 'Work', 'Personal', 'Urgent'];


function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function renderTodos() {
    todoList.innerHTML = `
      <li class="todo-header">
        <span>Category</span>
        <span>To-Do</span>
        <span>Status</span>
        <span>Select</span>
      </li>
    `;
  
    for (const todo of todos) {
      const todoItem = document.createElement('li');
      todoItem.className = 'todo-item';
      todoItem.innerHTML = `
        <span class="todo-category">${todo.category}</span>
        <span class="todo-text">${todo.text}</span>
        <div class="status">
          <input type="checkbox" class="todo-done" ${todo.done ? 'checked' : ''}>
          <label>Done</label>
          <input type="checkbox" class="todo-unneeded" ${todo.unneeded ? 'checked' : ''}>
          <label>Unneeded</label>
        </div>
        <input type="checkbox" class="todo-select">
      `;
      todoList.appendChild(todoItem);
    }; 
  }

function addCategory() {
    const newCategory = categoryToAdd.value.trim();
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        document.getElementById('category').appendChild(option);
        categoryToAdd.value = '';
        saveCategories();
        alert('Category added successfully');
    } else {
        alert('Invalid or duplicate category');
    }
}



function addTodo() { 
    const todoText = todoInput.value.trim();
    const category = document.getElementById('category').value;
    if (todoText && category) {
      const todo = { 
        text: todoText, 
        category: category,
        done: false,
        unneeded: false,
        selected: false
      };
      todos.push(todo);
      renderTodos();
      todoInput.value = '';
      saveTodos();
    }
  }


  document.addEventListener('DOMContentLoaded', () => {
    // Toggle done/unneeded (mutually exclusive)
    todoList.addEventListener('change', (e) => {
      if (e.target.classList.contains('todo-done')) {
        const item = e.target.closest('.todo-item');
        item.querySelector('.todo-unneeded').checked = false;
      }
      if (e.target.classList.contains('todo-unneeded')) {
        const item = e.target.closest('.todo-item');
        item.querySelector('.todo-done').checked = false;
      }
    });
  
    // Remove selected items
    document.getElementById('remove-selected').addEventListener('click', () => {
      todos = todos.filter(todo => !todo.selected);
      renderTodos();
      saveTodos();
    });
  });
