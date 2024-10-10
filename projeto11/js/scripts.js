const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

const saveTodo = (todoText, done = 0, save = 1) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = todoText;
    todoDiv.appendChild(todoTitle);

    const todoFinishdBtn = document.createElement("button");
    todoFinishdBtn.classList.add("finish-todo");
    todoFinishdBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todoDiv.appendChild(todoFinishdBtn);

    const todoEditBtn = document.createElement("button");
    todoEditBtn.classList.add("edit-todo");
    todoEditBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todoDiv.appendChild(todoEditBtn);

    const todoRemoveBtn = document.createElement("button");
    todoRemoveBtn.classList.add("remove-todo");
    todoRemoveBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todoDiv.appendChild(todoRemoveBtn);

    // using data from local storage
    if (done) {
        todoDiv.classList.add("done");
    }
    if (save) {
        saveTodoLocalStorage({text: todoText, done: 0})
    }

    todoList.appendChild(todoDiv);
    todoInput.value = "";
    todoInput.focus();
}

const toggleForm = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");

}

const updateTodoTitle = (todoText) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = todoText;
            updateTodoTextLocalStorage(oldInputValue, todoText);
        }
    });
}

const getSearchTodos = (searchValue) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        todo.style.display = "flex";

        if (!todoTitle.includes(searchValue)) {
            todo.style.display = "none";
        }
    });
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
            break;
        case "done":
            todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
            break;
        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
            break;
    }
}


todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputValue = todoInput.value;

    if (!inputValue) return;
    saveTodo(inputValue);
});

document.addEventListener("click", (event) => {
    const targetElement = event.target;
    const parentElement = targetElement.closest("div");
    let todoTitle;

    if (parentElement && parentElement.querySelector("h3")) todoTitle = parentElement.querySelector("h3").innerText;

    if (targetElement.classList.contains("finish-todo")) {
        parentElement.classList.toggle("done");
        updateTodoStatusLocalStorage(todoTitle);
    } else if (targetElement.classList.contains("remove-todo")) {
        parentElement.remove();
        removeTodoLocalStorage(todoTitle);
    } else if (targetElement.classList.contains("edit-todo")) {
        toggleForm();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (event) => {
    event.preventDefault();
    toggleForm();
});

editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const editInputValue = editInput.value;
    if (!editInputValue) return;
    updateTodoTitle(editInputValue);
    toggleForm();
});

searchInput.addEventListener("keyup", (event) => {
    const searchValue = event.target.value;
    getSearchTodos(searchValue.toLowerCase());
});

eraseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
})

filterBtn.addEventListener("change", (event) => {
    const filterValue = event.target.value;
    filterTodos(filterValue);
});

// local storage functions
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    return todos;
}

const loadTodos = () => {
    const todos = getTodosLocalStorage();
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
}

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    const filteredTodos = todos.filter((todo) => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null);
    localStorage.setItem("todos", JSON.stringify(todos));
}

const updateTodoTextLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null);
    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();
