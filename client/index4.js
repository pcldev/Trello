const initialListTodos = [
  {
    id: Math.random().toString(16).slice(2),
    todos: [
      {
        title: "4",
        id: Math.random().toString(16).slice(2),
        completed: false,
      },
    ],
    title: "Not working yet",
  },
  {
    id: Math.random().toString(16).slice(2),
    todos: [
      {
        title: "1",
        id: Math.random().toString(16).slice(2),
        completed: false,
      },
      {
        title: "2",
        id: Math.random().toString(16).slice(2),
        completed: false,
      },
      {
        title: "3",
        id: Math.random().toString(16).slice(2),
        completed: false,
      },
    ],
    title: "Working",
  },
  {
    id: Math.random().toString(16).slice(2),
    todos: [
      {
        title: "1",
        id: Math.random().toString(16).slice(2),
        completed: false,
      },
      {
        title: "2",
        id: Math.random().toString(16).slice(2),
        completed: false,
      },
      {
        title: "3",
        id: Math.random().toString(16).slice(2),
        completed: false,
      },
    ],
    title: "Done",
  },
];

const init = [
  {
    tasks: [
      {
        completed: false,
        _id: "62e0ef24d297c9647cc13654",
        name: "Go Fishing",
        __v: 0,
      },
      {
        completed: false,
        _id: "62e0ef2bd297c9647cc13656",
        name: "Go Dogging",
        __v: 0,
      },
      {
        completed: false,
        _id: "62e0ef5ad297c9647cc13660",
        name: "Gymming",
        __v: 0,
      },
      {
        completed: false,
        _id: "62e0ef6bd297c9647cc13662",
        name: "Coding",
        __v: 0,
      },
    ],
    _id: "62e0f2121dcdcd3604b2c573",
    name: "This is the name of board",
    __v: 0,
  },
  {
    tasks: [
      {
        completed: false,
        _id: "62e0ef24d297c9647cc13654",
        name: "Go Fishing",
        __v: 0,
      },
      {
        completed: false,
        _id: "62e0ef2bd297c9647cc13656",
        name: "Go Dogging",
        __v: 0,
      },
    ],
    _id: "62e0f4c2e95be9672cef5698",
    name: "This is the name of board",
    __v: 0,
  },
];

const body = document.querySelector("body");
const overlay = document.querySelector(".overlay");
const toast = document.querySelector(".toast");

class Sortable {
  currentMainBoard;
  listTodos;

  currentTodoId;

  formContainer;
  btnShowForm;
  elementDragging;

  currentAfterTodoId;
  currentBeforeTodoId;

  currentBeforeListTodoId;

  toastTimeout;
  constructor(container, modal) {
    this.container = container;
    this.modal = modal;

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.eventSubmitHandle(e);
    });

    this.container.addEventListener("click", (e) => {
      this.eventClickHandle(e);
    });

    this.container.addEventListener("change", (e) => {
      this.eventChangeHandle(e);
    });

    this.container.addEventListener("dragstart", (e) => {
      this.eventDragStartHandle(e);
    });

    this.container.addEventListener("dragend", (e) => {
      this.eventDragEndHandle(e);
    });

    this.container.addEventListener("dragover", (e) => {
      this.eventDragOverHandle(e);
    });

    this.container.addEventListener("drop", (e) => {
      this.eventDropHandle(e);
    });

    this.modal.addEventListener("submit", (e) => {
      e.preventDefault();

      if (e.target.className.includes("formSaveTodo")) {
        const todoStringify = JSON.parse(e.target.closest("form").dataset.todo);
        this.onSaveTodo(todoStringify);
      }
    });

    overlay.addEventListener("click", () => {
      this.toggleModal(true);
    });
  }

  //fetch data
  async fetchData() {
    try {
      const response = await fetch(
        "http://localhost:2906/mainboards/62e0f48ee95be9672cef568e"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      this.currentMainBoard = data.data._id;
      this.listTodos = data.data.boards;
    } catch (err) {
      console.log(err.message);
    }
  }

  // Main Board
  async onUpdateMainBoard(data, message) {
    // data : _id
    const main = {
      id: this.currentMainBoard,
      ...data,
    };
    try {
      const response = await fetch("http://localhost:2906/mainboards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(main),
      });
      if (!response.ok) throw new Error("Cannot update main board");
      if (message) this.onShowToast(message);
      // const responseData = await response.json();
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  async onAddBoardsInMainBoard(id) {
    const main = {
      id: this.currentMainBoard,
      boards: id,
    };
    try {
      const response = await fetch(
        "http://localhost:2906/mainboards/updateboards",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(main),
        }
      );
      if (!response.ok) throw new Error("Cannot update boards in main board");
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  // Board
  async onAddListTaskHandle(data) {
    // data : { name : ''}
    try {
      const response = await fetch("http://localhost:2906/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Cannot add new board");

      const boards = await response.json();
      await this.onAddBoardsInMainBoard(boards.data._id);
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  async onUpdateBoard(boardId, data) {
    const main = {
      id: boardId,
      ...data,
    };
    try {
      const response = await fetch("http://localhost:2906/boards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(main),
      });
      if (!response.ok) throw new Error("Cannot update board");

      // const responseData = await response.json();
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  async onUpdateBoardMany(data) {
    console.log(JSON.stringify(data));
    try {
      const response = await fetch("http://localhost:2906/boards/updatemany", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Cannot update board");
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  async onAddTasksInBoard(taskId, boardId) {
    const main = {
      id: boardId,
      tasks: taskId,
    };
    try {
      const response = await fetch("http://localhost:2906/boards/updatetasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(main),
      });
      if (!response.ok) throw new Error("Cannot update boards in main board");
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  // Task

  async onAddTaskHandle(data, boardId) {
    try {
      const response = await fetch("http://localhost:2906/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Cannot add new task");
      const responseData = await response.json();

      const responseDataId = responseData.data._id;

      await this.onAddTasksInBoard(responseDataId, boardId);
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  async onDeleteTaskHandle(data) {
    try {
      const response = await fetch("http://localhost:2906/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Cannot delete task");
      this.onShowToast("Delete Task Successfully!");
    } catch (err) {
      console.log("X X ", err);
    }
  }

  async onUpdateTaskHandle(data, message) {
    try {
      const response = await fetch("http://localhost:2906/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Cannot update task");
      if (message) this.onShowToast(message);
    } catch (err) {
      console.log("X X ", err.message);
    }
  }

  // event handle
  eventClickHandle(e) {
    const target = e.target;

    if (target.className.includes("btnEditTodo")) {
      const todoStringify = JSON.parse(
        target.closest(".draggable").dataset.todo
      );
      this.onEditTodo(todoStringify);
    }

    if (target.className.includes("btnDeleteTodo")) {
      const todoStringify = JSON.parse(
        target.closest(".draggable").dataset.todo
      );
      this.onHandleDeleteTodo(todoStringify);
    }

    if (target.className === "btnToggleAddListTodo") {
      this.formContainer = target.nextSibling.nextSibling;
      this.btnShowForm = target;
      const inputSubmit =
        this.formContainer.querySelector('input[type="text"]');
      this.formContainer.classList.add("mt-top-200px");
      this.btnShowForm.classList.add("mt-top-negative-200px");
      inputSubmit?.focus();
      return;
    }

    if (target.className.includes("btnDeleteListTodo")) {
      this.onDeleteListTodo(target.dataset.id);
      // return;
    }
    if (
      target.className.includes("formAddListTodo") ||
      target.closest(".formAddListTodo")
    ) {
      return;
    }

    this.formContainer?.classList.remove("mt-top-200px");
    this.btnShowForm?.classList.remove("mt-top-negative-200px");
  }

  async eventSubmitHandle(e) {
    e.preventDefault();
    const target = e.target;
    if (target.className.includes("form")) {
      const inputValue = target.children[0].value;

      this.listTodos.forEach(async (listTodo) => {
        if (listTodo._id === target.dataset.id) {
          const data = {
            name: inputValue.trim(),
          };
          await this.onAddTaskHandle(data, listTodo._id);

          await this.fetchData();
          this.render();
        }
      });
    }

    if (
      target.className.includes("submitFormAddListTodo") ||
      target.className.includes("formAddListTodo")
    ) {
      const inputSubmit = target.querySelector("input");
      const data = {
        name: inputSubmit.value.trim(),
      };
      await this.onAddListTaskHandle(data);
      inputSubmit.value = "";

      await this.fetchData();
      this.render();
    }
  }

  eventChangeHandle(e) {
    const target = e.target;
    if (target.className.includes("checkbox")) {
      const todoStringify = JSON.parse(
        target.closest(".draggable").dataset.todo
      );
      this.onCheckCompletedTodo(todoStringify);
    }
  }

  eventDragStartHandle(e) {
    const target = e.target;

    if (target.nodeName === "LI") {
      this.dragStart(e);
    }
    if (target.className.includes("listTodoPanel")) {
      this.dragStart(e);
    }

    if (target.parentElement.className.includes("listTodoPanel")) {
      this.dragStart(target.closest("listTodoPanel"));
    }
  }

  eventDragEndHandle(e) {
    const target = e.target;

    if (target.nodeName === "LI") {
      this.dragEnd(e);
    }

    if (this.elementDragging.className.includes("listTodoPanel")) {
      this.dragEnd(e);
    }
  }

  eventDropHandle(e) {
    e.preventDefault();
    const target = e.target;

    if (target.closest(".todos") && this.elementDragging.nodeName === "LI") {
      // pass li element

      this.drop(e);
    }
    if (this.elementDragging.className.includes("listTodoPanel")) {
      this.drop(e);
    }
  }

  eventDragOverHandle(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const target = e.target;

    if (this.elementDragging.nodeName === "LI" && target.closest("ul")) {
      const container = target.closest("ul");

      this.allowDrop(e);
      const afterElement = this.getDragAfterElement(container, e.clientY);
      const beforeElement = this.getDragBeforeElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      this.initialListTodoId = draggable.dataset.listId;

      if (beforeElement == null) {
        this.currentBeforeTodoId = null;
      }
      if (afterElement == null) {
        this.currentAfterTodoId = null;
        container.appendChild(draggable);
      } else {
        this.currentBeforeTodoId = beforeElement?.dataset.id;
        this.currentAfterTodoId = afterElement.dataset.id;
        container.insertBefore(draggable, afterElement);
      }
    }

    if (this.elementDragging.className.includes("listTodoPanel")) {
      const container = target.closest(".listTodo");
      this.allowDrop(e);
      if (!container) return;
      const horizontalBeforeElement = this.getDragHorizontalAfterElement(
        container,
        e.clientX
      );

      const draggable = document.querySelector(".dragging");

      if (horizontalBeforeElement) {
        const sibling = horizontalBeforeElement.nextSibling;

        this.currentBeforeListTodoId =
          horizontalBeforeElement.getAttribute("id");
        container.insertBefore(draggable, sibling);
      } else {
        this.currentBeforeListTodoId = null;
        container.insertBefore(draggable, container.children[0]);
      }
    }
  }

  async initialRender() {
    // this.listTodos = JSON.parse(localStorage.getItem("tasks")) || init;
    await this.fetchData();
    this.render();
  }

  updateLS() {
    // localStorage.setItem(
    //   "tasks",
    //   JSON.stringify(this.listTodos.filter((listTodo) => listTodo))
    // );
  }

  renderListTodos(listTodo) {
    let sHtml = "";
    if (listTodo.tasks.length === 0) {
      sHtml =
        "<p style='color:#ccc;text-align:center'>You have no todo in here!</p>";
    } else
      listTodo.tasks.forEach((task) => {
        sHtml += this.renderLi({ ...task, listTodoId: listTodo._id });
      });
    return `<div class="listTodoPanel" data-id="${listTodo._id}" id="${listTodo._id}" draggable="true" >
      <button class="btnDeleteListTodo btnDelete" data-id='${listTodo._id}'>Delete</button>
      <p class="listTodoTitle">${listTodo.name}</p>
      <ul
        class="todos ulDraggable"
      >
      ${sHtml}
      </ul>
      <form class="form" data-id="${listTodo._id}">
        <input
          type="text"
          class="input"
          id="input"
          placeholder="Enter your todo"
        />
      </form>
    </div>`;
  }

  renderLi(task) {
    const taskStringify = JSON.stringify(task);
    return `<li class="draggable" data-todo='${taskStringify}' data-list-id="${
      task.listTodoId
    }" data-id="${task._id}"  data-type="${task.type}" draggable="true" id="${
      task._id
    }">
      <input class="checkbox" type="checkbox" value="${
        task.name
      }" data-value="${task._id}"  ${task.completed ? "checked" : ""}>
      <p class="${task.completed ? "disable" : ""}">${task.name}</p>
      <div>
        <button type="button" class='btnEditTodo' data-value="${task._id}" ${
      task.completed ? "disabled" : ""
    }>Edit</button>
        <button type="button" class="btnDeleteTodo btnDelete" data-value="${
          task._id
        }" >Delete</button>
      </div>
    </li>`;
  }

  renderModal(task) {
    const taskStringify = JSON.stringify(task);
    this.modal.innerHTML = `<form class='formSaveTodo' data-todo='${taskStringify}'>
        <input class="input editTodo" type="text" />
        <button  class='btnSaveTodo'>Save</button>
      </form>`;
  }

  render() {
    let sHtml = "";
    this.listTodos.forEach((listTodo) => {
      sHtml += this.renderListTodos(listTodo);
    });

    sHtml += `<div class="addListTodo">
        <button class="btnToggleAddListTodo" type="button">
          Add another list
        </button>
        <form class="formAddListTodo" id="formAddListTodo">
          <input type="text" class="input submitFormAddListTodo" />
          <button type="submit" class="btnSubmitAddListTodo">Add</button>
        </form>
      </div>`;

    this.container.innerHTML = sHtml;
  }

  // list todo handle

  async onDeleteListTodo(listTodoId) {
    this.listTodos = this.listTodos.filter(
      (listTodo) => listTodo._id !== listTodoId
    );

    const array = this.listTodos.reduce((acc, ele) => {
      return ele._id !== listTodoId ? [...acc, ele._id] : acc;
    }, []);

    const newBoards = {
      boards: array,
    };

    await this.onUpdateMainBoard(newBoards, "Delete Board Successfully");
    await this.fetchData();
    this.render();
  }

  // todo handle
  onEditTodo(todo) {
    const { listTodoId, _id } = todo;

    this.renderModal(todo);
    const editTodo = document.querySelector(".editTodo");
    this.listTodos.forEach((listTodo, index) => {
      if (listTodo._id === listTodoId) {
        editTodo.value = this.listTodos[index].tasks.filter(
          (task) => task._id === _id
        )[0].name;
      }
    });
    this.toggleModal(false);
  }

  async onSaveTodo(todo) {
    event.preventDefault();
    const { listTodoId, _id } = todo;

    const editTodo = document.querySelector(".editTodo");

    const data = {
      id: _id,
      name: editTodo.value.trim(),
    };

    await this.onUpdateTaskHandle(data, "Update Task Successfully");
    await this.fetchData();
    this.toggleModal(true);
    this.render();
  }

  async onCheckCompletedTodo(todo) {
    const { completed, _id } = todo;
    const data = {
      id: _id,
      completed: !completed,
    };
    await this.onUpdateTaskHandle(data);
    await this.fetchData();
    this.render();
  }

  async onHandleDeleteTodo(todo) {
    const { listTodoId, _id } = todo;
    const data = {
      id: _id,
    };
    await this.onDeleteTaskHandle(data);
    await this.fetchData();
    this.render();
  }

  // drag and drop event
  dragStart(event) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        todoId: event.target.dataset.id,
        listTodoId: event.target.dataset.listId,
      })
    );
    const item = document.getElementById(`${event.target.dataset.id}`);
    this.elementDragging = item;
    item.classList.add("dragging");
  }

  dragEnd(event) {
    const item = document.getElementById(`${event.target.dataset.id}`);
    item.classList.remove("dragging");
  }

  allowDrop(event) {
    event.preventDefault();
  }

  async drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");

    const { todoId, listTodoId } = JSON.parse(data);

    if (
      event.target.closest(".listTodo") &&
      this.elementDragging.className.includes("listTodoPanel")
    ) {
      let currentIndexListTodo;
      let beforeIndexListTodo;
      let temp;

      for (let i = 0; i < this.listTodos.length; i++) {
        if (this.listTodos[i]) {
          if (this.listTodos[i]._id === todoId) {
            temp = this.listTodos[i];
            currentIndexListTodo = i;
          }

          if (this.listTodos[i]._id === this.currentBeforeListTodoId) {
            beforeIndexListTodo = i;
          }
        }
      }

      this.listTodos.splice(currentIndexListTodo, 1);

      if (beforeIndexListTodo || beforeIndexListTodo === 0) {
        this.listTodos.splice(beforeIndexListTodo + 1, 0, temp);
      } else {
        this.listTodos.splice(0, 0, temp);
      }
      const newBoards = {
        boards: [...this.listTodos.map((listTodo) => listTodo._id)],
      };

      await this.onUpdateMainBoard(newBoards);
    } else if (
      event.target.closest(".listTodoPanel") &&
      this.elementDragging.nodeName === "LI"
    ) {
      const place = event.target.closest(".listTodoPanel");
      const id = place.dataset?.id;
      const { todoId, listTodoId } = JSON.parse(data);

      let currentIndexTodo;
      let desireIndexTodo;
      let beforeIndexTodo;
      let temp;

      this.listTodos.forEach((listTodo) => {
        listTodo.tasks.forEach((task, index) => {
          if (task._id === todoId) {
            currentIndexTodo = index;
            temp = task;
          }

          if (this.currentAfterTodoId === task._id) {
            desireIndexTodo = index;
          }

          if (this.currentBeforeTodoId === task._id) {
            beforeIndexTodo = index;
          }
        });
      });

      if (currentIndexTodo === 0 || currentIndexTodo) {
        this.listTodos.forEach((listTodo) => {
          if (listTodo._id === listTodoId) {
            listTodo.tasks.splice(currentIndexTodo, 1);
          }
        });
      }

      //insert todo

      this.listTodos.forEach((listTodo) => {
        if (listTodo._id === id) {
          if (
            ((desireIndexTodo === 1 && currentIndexTodo === 0) ||
              desireIndexTodo === 0) &&
            beforeIndexTodo !== 0
          ) {
            listTodo.tasks.splice(0, 0, temp);
          } else if (
            (currentIndexTodo === beforeIndexTodo + 1 &&
              currentIndexTodo === desireIndexTodo - 1) ||
            (currentIndexTodo === 0 &&
              desireIndexTodo === beforeIndexTodo + 1 &&
              currentIndexTodo !== beforeIndexTodo)
          ) {
            listTodo.tasks.splice(desireIndexTodo - 1, 0, temp);
          } else if (desireIndexTodo) {
            listTodo.tasks.splice(desireIndexTodo, 0, temp);
          } else {
            listTodo.tasks.splice(listTodo.tasks.length, 0, temp);
          }
        }
      });

      // this.listTodos.forEach(async (listTodo) => {
      //   if (listTodo._id === id) {
      //     const data = {
      //       tasks: [...listTodo.tasks.map((task) => task._id)],
      //     };

      //     await this.onUpdateBoard(id, data);
      //   }

      //   if (listTodo._id === listTodoId) {
      //     const data = {
      //       tasks: [...listTodo.tasks.map((task) => task._id)],
      //     };

      //     await this.onUpdateBoard(listTodoId, data);
      //   }
      // });
      const reqData = this.listTodos.reduce((acc, ele) => {
        if (ele._id === id) {
          console.log(acc);
          return [
            ...acc,
            { id: id, tasks: [...ele.tasks.map((task) => task._id)] },
          ];
        } else if (ele._id === listTodoId) {
          console.log(acc);
          return [
            ...acc,
            { id: listTodoId, tasks: [...ele.tasks.map((task) => task._id)] },
          ];
        } else return acc;
      }, []);

      console.log(reqData);
      await this.onUpdateBoardMany(reqData);
    }

    this.listTodos = this.listTodos.filter((listTodo) => listTodo);

    await this.fetchData();
    this.render();
  }

  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, ele) => {
        const box = ele.getBoundingClientRect();

        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset
          ? { offset: offset, element: ele }
          : closest;
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  getDragBeforeElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, ele) => {
        const box = ele.getBoundingClientRect();

        const offset = y - box.top - box.height / 2;
        return offset > 0 && offset < closest.offset
          ? { offset: offset, element: ele }
          : closest;
      },
      { offset: Number.POSITIVE_INFINITY }
    ).element;
  }

  getDragHorizontalAfterElement(container, x) {
    const draggableElements = [
      ...container.querySelectorAll(".listTodoPanel:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, ele) => {
        //
        const box = ele.getBoundingClientRect();

        const offset = x - box.left - box.width / 2;

        return offset > 0 && offset < closest.offset
          ? { offset: offset, element: ele }
          : closest;
      },
      { offset: Number.POSITIVE_INFINITY }
    ).element;
  }

  toggleModal(hide) {
    if (hide) {
      this.modal.classList.add("hidden");
      overlay.classList.add("hidden");
      body.style.overflow = "scroll";
    } else {
      this.modal.classList.remove("hidden");
      overlay.classList.remove("hidden");
      body.scrollIntoView();
      body.style.overflow = "hidden";
    }
  }

  onShowToast(message) {
    toast.querySelector("p").innerHTML = message;
    toast.classList.add("margin-left-negative-300");

    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("margin-left-negative-300");
    }, 2000);
  }
}
