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
        const todo = { text: todoText, category: category };
        todos.push(todo);
        renderTodos();
        todoInput.value = '';
        saveTodos();
        alert('To-do added successfully');
    } else {
        alert('Please enter a to-do and select a category');
    }
}


