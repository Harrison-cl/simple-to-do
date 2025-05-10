// DOM Elements
const categoryToAdd = document.getElementById('new-category');
const todoInput = document.getElementById('todo-text');
const todoList = document.getElementById('todo-list');
const categoryDropdown = document.getElementById('category');

// Data
let todos = [];
let categories = ['General', 'Work', 'Personal', 'Urgent'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  populateCategoryDropdown();
  renderTodos();
});

// --- Core Functions ---
function loadFromLocalStorage() {
  const savedTodos = localStorage.getItem('todos');
  const savedCategories = localStorage.getItem('categories');
  if (savedTodos) todos = JSON.parse(savedTodos);
  if (savedCategories) categories = JSON.parse(savedCategories);
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Populate ONLY the category dropdown (no filter)
function populateCategoryDropdown() {
  // Clear existing options (except the first)
  while (categoryDropdown.options.length > 1) {
    categoryDropdown.remove(1);
  }

  // Add categories
  for (const category of categories) {
    const option = new Option(category, category);
    categoryDropdown.add(option);
  }
}

// Render Todos
function renderTodos() {
  // Check if header exists, otherwise create it
  if (!todoList.querySelector('.todo-header')) {
    const header = document.createElement('li');
    header.className = 'todo-header';
    header.innerHTML = `
      <span>Category</span>
      <span>To-Do</span>
      <span>Status</span>
      <span>Select</span>
    `;
    todoList.appendChild(header);
  }

  // Clear existing items (except header)
  const items = todoList.querySelectorAll('li:not(.todo-header)');
  for (const item of items) {
    item.remove();
  }

  // Add todos
  for (const [index, todo] of todos.entries()) {
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.innerHTML = `
      <span class="todo-category">${todo.category}</span>
      <span class="todo-text">${todo.text}</span>
      <div class="status">
        <!-- Radio buttons (mutually exclusive by default) -->
        <input 
          type="radio" 
          name="status-${index}" 
          value="done"
          class="todo-status" 
          ${todo.done ? 'checked' : ''}
          data-index="${index}"
        >
        <label>Done</label>
        <input 
          type="radio" 
          name="status-${index}" 
          value="unneeded"
          class="todo-status" 
          ${todo.unneeded ? 'checked' : ''}
          data-index="${index}"
        >
        <label>Unneeded</label>
        <input 
          type="radio" 
          name="status-${index}" 
          value="active"
          class="todo-status" 
          ${!todo.done && !todo.unneeded ? 'checked' : ''}
          data-index="${index}"
        >
        <label>Active</label>
      </div>
      <input type="checkbox" class="todo-select" ${todo.selected ? 'checked' : ''}>
    `;
    todoList.appendChild(todoItem);
  }
}

// --- Event Handlers ---
function handleTodoStatusChange(e) {
  if (!e.target.classList.contains('todo-status') && !e.target.classList.contains('todo-select')) {
    return; // Only process radio buttons and selection checkboxes
  }
  
  const index = Number.parseInt(e.target.dataset.index);
  
  if (e.target.classList.contains('todo-status')) {
    const status = e.target.value;
    
    // Reset all status flags
    todos[index].done = false;
    todos[index].unneeded = false;
    
    // Set the appropriate flag based on selection
    if (status === 'done') {
      todos[index].done = true;
    } else if (status === 'unneeded') {
      todos[index].unneeded = true;
    }
    // 'active' means both done and unneeded are false
  } 
  else if (e.target.classList.contains('todo-select')) {
    todos[index].selected = e.target.checked;
  }

  saveTodos();
}

function removeSelectedTodos() {
  todos = todos.filter(todo => !todo.selected);
  saveTodos();
  renderTodos();
}

// Add Category
function addCategory() {
  const newCategory = categoryToAdd.value.trim();
  if (!newCategory || categories.includes(newCategory)) {
    alert('Invalid or duplicate category');
    return;
  }

  categories.push(newCategory);
  saveCategories();
  populateCategoryDropdown();
  categoryToAdd.value = '';
}

// Add Todo
function addTodo() {
  const todoText = todoInput.value.trim();
  const category = categoryDropdown.value;

  if (!todoText || !category) {
    alert('Please enter a to-do and select a category');
    return;
  }

  todos.push({
    text: todoText,
    category,
    done: false,
    unneeded: false,
    selected: false
  });

  todoInput.value = '';
  saveTodos();
  renderTodos();
}

// Attach Event Listeners
document.getElementById('add-category').addEventListener('click', addCategory);
document.getElementById('add-todo').addEventListener('click', addTodo);
todoList.addEventListener('change', handleTodoStatusChange);
document.getElementById('remove-selected').addEventListener('click', removeSelectedTodos);