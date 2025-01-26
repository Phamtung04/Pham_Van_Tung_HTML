const input = document.getElementById("tName");
const list = document.getElementById("list_task");

const modalEditTask = document.getElementById("modal-edit-task");
const saveEditTask = document.getElementById("save-edit-task");
const newTaskContent = document.getElementById("new-task-content");

const filterSelect = document.getElementById("filter-select");

let draggedElement = null;

let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

// Cập nhật danh sách hiển thị
const updateTodoList = (tasks = todoList) => {
    list.innerHTML = '';
    tasks.forEach((item, index) => {
        const li = document.createElement("li");
        li.id = `task-${index}`;
        li.className = item.completed ? "completed" : "";
        li.innerHTML = tag_li(item.text, index);
        list.appendChild(li);
    });
};



const tag_li = (value, index) => {
    return `<li draggable="true" data-index="${index}" id="task-${index}">
            <p onClick="successTask(${index})" style="padding-top: 20px; padding-right: 20px; width: 300px;">${value}</p>
            <span>
                <svg onClick="openModalEditTask(${index})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brush" viewBox="0 0 16 16">
                    <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/>
                </svg>
                <svg onClick="deleteTask(${index})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </span>
        </li>`;
};



// Thêm công việc mới
const addToDo = () => {
    const newToDo = {
        text: input.value.trim(),
        completed: false,
    };

    if (newToDo.text) {
        todoList.push(newToDo);
        localStorage.setItem("todoList", JSON.stringify(todoList));
        input.value = '';
        updateTodoList();
    }
};


// Đánh dấu hoàn thành công việc
const successTask = (index) => {
    todoList[index].completed = !todoList[index].completed;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    updateTodoList();
    todoList = JSON.parse(localStorage.getItem("todoList")); // Cập nhật lại todoList
};

// xóa cong viec
const deleteTask = (index) => {
    todoList.splice(index, 1);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    updateTodoList();
};

// update
const openModalEditTask = (index) => {
    modalEditTask.style.display = "block";
    newTaskContent.value = todoList[index].text;
    newTaskContent.dataset.index = index;
};

const saveEditTaskContent = (index) => {
    const newTaskContentValue = newTaskContent.value.trim();
    if (newTaskContentValue !== "") {
        todoList[index].text = newTaskContentValue;
        localStorage.setItem("todoList", JSON.stringify(todoList));
        updateTodoList();
        modalEditTask.style.display = "none";
    }
};


document.querySelectorAll('.bi-brush').forEach((icon, index) => {
    icon.addEventListener('click', () => {
        openModalEditTask(index);
    });
});

modalEditTask.addEventListener("click", (event) => {
    if (event.target.classList.contains("close")) {
        modalEditTask.style.display = "none";
    }
});

saveEditTask.addEventListener("click", () => {
    const index = newTaskContent.dataset.index;
    saveEditTaskContent(index);
});


//filtter
filterSelect.addEventListener("change", (e) => {
    const filterType = e.target.value;
    filterTask(filterType);

});

const filterTask = (filterType) => {
    const filterTasks = todoList.filter((task) => {
        switch (filterType) {
            case "all":
                return true;
            case "completed":
                return task.completed;
            case "not-completed":
                return !task.completed;
            default:
                return true;
        }
    });
    updateTodoList(filterTasks);
}


// Sắp xếp

list.addEventListener("dragstart", (e) => {
    if (e.target && e.target.tagName === "LI") {
        draggedElement = e.target;
        draggedElement.style.opacity = "0.5"; // Cải thiện khả năng nhận diện
    }
});

list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const targetElement = e.target;
    if (targetElement && targetElement.tagName === "LI" && targetElement !== draggedElement) {
        draggedElement = targetElement;
    }
});


list.addEventListener("drop", (e) => {
    e.preventDefault();
    const targetElement = e.target;

    // Kiểm tra nếu targetElement là phần tử <li> hợp lệ
    if (targetElement && targetElement.tagName === "LI" && draggedElement !== targetElement) {
        const draggedIndex = draggedElement.getAttribute("data-index");
        const targetIndex = targetElement.getAttribute("data-index");

        // Tạo một bản sao của mảng todoList để tránh thay đổi mảng gốc
        const todoListCopy = [...todoList];

        // Di chuyển phần tử đang được kéo đến vị trí mới
        const draggedTask = todoListCopy[draggedIndex];
        todoListCopy.splice(draggedIndex, 1);
        todoListCopy.splice(targetIndex, 0, draggedTask);

        // Cập nhật lại mảng todoList
        todoList = todoListCopy;

        // Lưu lại vào localStorage
        localStorage.setItem("todoList", JSON.stringify(todoList));

        // Cập nhật lại giao diện
        updateTodoList(todoList);
    }
});


list.addEventListener("dragend", (e) => {
    e.target.style.opacity = "1";
});

// Khởi tạo ứng dụng
updateTodoList();