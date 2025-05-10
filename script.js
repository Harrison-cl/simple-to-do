const categoryToAdd = document.getElementById('new-category');
const todoInput = document.getElementById('todo-text');
const todoList = document.getElementById('todo-list');
const categoryDropdown = document.getElementById('category'); // Fixed: consistent name
const categoryFilter = document.getElementById('category-filter');

let todos = [];
let categories = ['General', 'Work', 'Personal', 'Urgent'];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  populateCategoryDropdowns();
  renderTodos();

  // Event listeners
  todoList.addEventListener('change', handleTodoCheckboxChange);
  document.getElementById('remove-selected').addEventListener('click', removeSelectedTodos);
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

function populateCategoryDropdowns() {
  const dropdowns = [categoryDropdown, categoryFilter];
  
  for (const dropdown of dropdowns) {
    // Clear except first option
    while (dropdown.options.length > 1) dropdown.remove(1);
    
    // Add categories
    for (const category of categories) {
      dropdown.add(new Option(category, category));
    }
  }
}

// --- Todo List Rendering ---
function renderTodos() {
  todoList.innerHTML = `
    <li class="todo-header">
      <span>Category</span>
      <span>To-Do</span>
      <span>Status</span>
      <span>Select</span>
    </li>
  `;

  for (const [index, todo] of todos.entries()) {
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
      <input type="checkbox" class="todo-select" ${todo.selected ? 'checked' : ''}>
    `;
    todoList.appendChild(todoItem);
  }
}

// --- Event Handlers ---
function handleTodoCheckboxChange(e) {
  const item = e.target.closest('.todo-item');
  const index = [...todoList.children].indexOf(item) - 1; // Skip header
  
  if (e.target.classList.contains('todo-done')) {
    todos[index].done = e.target.checked;
    if (e.target.checked) todos[index].unneeded = false;
  } 
  else if (e.target.classList.contains('todo-unneeded')) {
    todos[index].unneeded = e.target.checked;
    if (e.target.checked) todos[index].done = false;
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

function addCategory() {
  const newCategory = categoryToAdd.value.trim();
  if (!newCategory || categories.includes(newCategory)) {
    alert('Invalid or duplicate category');
    return;
  }
  
  categories.push(newCategory);
  saveCategories();
  populateCategoryDropdowns();
  categoryToAdd.value = '';
}

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