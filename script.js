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
  // Keep only the header row
  const header = todoList.querySelector('.todo-header') || 
    todoList.appendChild(document.createElement('li')).classList.add('todo-header');

  // Clear existing items (except header)
  while (todoList.children.length > 1) {
    todoList.removeChild(todoList.lastChild);
  }

  // Add todos
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
todoList.addEventListener('change', handleTodoCheckboxChange);
document.getElementById('remove-selected').addEventListener('click', removeSelectedTodos);