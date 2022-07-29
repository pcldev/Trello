// const initialListTodos = [
//   {
//     id: Math.random().toString(16).slice(2),
//     todos: [
//       {
//         title: "4",
//         id: Math.random().toString(16).slice(2),
//         completed: false,
//       },
//     ],
//     title: "Not working yet",
//   },
//   {
//     id: Math.random().toString(16).slice(2),
//     todos: [
//       {
//         title: "1",
//         id: Math.random().toString(16).slice(2),
//         completed: false,
//       },
//       {
//         title: "2",
//         id: Math.random().toString(16).slice(2),
//         completed: false,
//       },
//       {
//         title: "3",
//         id: Math.random().toString(16).slice(2),
//         completed: false,
//       },
//     ],
//     title: "Working",
//   },
//   {
//     id: Math.random().toString(16).slice(2),
//     todos: [
//       {
//         title: "1",
//         id: Math.random().toString(16).slice(2),
//         completed: false,
//       },
//       {
//         title: "2",
//         id: Math.random().toString(16).slice(2),
//         completed: false,
//       },
//       {
//         title: "3",
//         id: Math.random().toString(16).slice(2),
//         completed: false,
//       },
//     ],
//     title: "Done",
//   },
// ];

const body = document.querySelector("body");
const overlay = document.querySelector(".overlay");

class Sortable {
  listTodos;

  currentTodoId;

  formContainer;
  btnShowForm;
  elementDragging;

  currentAfterTodoId;
  currentBeforeTodoId;

  currentBeforeListTodoId;

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

  eventSubmitHandle(e) {
    e.preventDefault();
    const target = e.target;
    if (target.className.includes("form")) {
      const inputValue = target.children[0].value;

      this.listTodos.forEach((listTodo) => {
        if (listTodo.id === target.dataset.id) {
          listTodo.todos.push({
            title: inputValue,
            id: Math.random().toString(16).slice(2),
            completed: false,
          });
        }
      });

      this.render();
      this.updateLS();
    }

    if (
      target.className.includes("submitFormAddListTodo") ||
      target.className.includes("formAddListTodo")
    ) {
      const inputSubmit = target.querySelector("input");
      this.listTodos.push({
        id: Math.random().toString(16).slice(2),
        todos: [],
        title: inputSubmit.value.trim(),
      });
      inputSubmit.value = "";
      this.render();
      this.updateLS();
    }
    if (target.className.includes("btnSubmitAddListTodo")) {
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

  initialRender() {
    this.listTodos =
      JSON.parse(localStorage.getItem("todos")) || initialListTodos;

    this.render();
  }

  updateLS() {
    localStorage.setItem(
      "todos",
      JSON.stringify(this.listTodos.filter((listTodo) => listTodo))
    );
  }

  renderListTodos(listTodo) {
    let sHtml = "";
    if (listTodo.todos.length === 0) {
      sHtml =
        "<p style='color:#ccc;text-align:center'>You have no todo in here!</p>";
    } else
      listTodo.todos.forEach((todo) => {
        sHtml += this.renderLi({ ...todo, listTodoId: listTodo.id });
      });
    return `<div class="listTodoPanel" data-id="${listTodo.id}" id="${listTodo.id}" draggable="true" >
      <button class="btnDeleteListTodo btnDelete" data-id='${listTodo.id}'>Delete</button>
      <p class="listTodoTitle">${listTodo.title}</p>
      <ul
        class="todos ulDraggable"

      >
      ${sHtml}
      </ul>
      <form class="form" data-id="${listTodo.id}">
        <input
          type="text"
          class="input"
          id="input"
          placeholder="Enter your todo"
        />
      </form>
    </div>`;
  }

  renderLi(todo) {
    const todoStringify = JSON.stringify(todo);
    return `<li class="draggable" data-todo='${todoStringify}' data-list-id="${
      todo.listTodoId
    }" data-id="${todo.id}"  data-type="${todo.type}" draggable="true" id="${
      todo.id
    }">
      <input class="checkbox" type="checkbox" value="${
        todo.title
      }" data-value="${todo.id}"  ${todo.completed ? "checked" : ""}>
      <p class="${todo.completed ? "disable" : ""}">${todo.title}</p>
      <div>
        <button type="button" class='btnEditTodo' data-value="${todo.id}" ${
      todo.completed ? "disabled" : ""
    }>Edit</button>
        <button type="button" class="btnDeleteTodo btnDelete" data-value="${
          todo.id
        }" >Delete</button>
      </div>
    </li>`;
  }

  renderModal(todo) {
    const todoStringify = JSON.stringify(todo);
    this.modal.innerHTML = `<form class='formSaveTodo' data-todo='${todoStringify}'>
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

  onDeleteListTodo(listTodoId) {
    this.listTodos = this.listTodos.filter(
      (listTodo) => listTodo.id !== listTodoId
    );

    this.render();
    this.updateLS();
  }

  // todo handle
  onEditTodo(todo) {
    const { listTodoId, id } = todo;

    this.renderModal(todo);
    const editTodo = document.querySelector(".editTodo");
    this.listTodos.forEach((listTodo, index) => {
      if (listTodo.id === listTodoId) {
        editTodo.value = this.listTodos[index].todos.filter(
          (todo) => todo.id === id
        )[0].title;
      }
    });
    this.toggleModal(false);
  }

  onSaveTodo(todo) {
    event.preventDefault();
    const { listTodoId, id } = todo;

    const editTodo = document.querySelector(".editTodo");

    this.listTodos.forEach((listTodo, index) => {
      if (listTodo.id === listTodoId) {
        this.listTodos[index].todos.filter((todo) => todo.id === id)[0].title =
          editTodo.value;
      }
    });
    this.toggleModal(true);
    this.updateLS();
    this.render();
  }

  onCheckCompletedTodo(todo) {
    const { listTodoId, id } = todo;
    this.listTodos.forEach((listTodo, index) => {
      if (listTodo.id === listTodoId) {
        this.listTodos[index].todos.forEach((todo) => {
          if (todo.id === id) {
            todo.completed = !todo.completed;
          }
        });
      }
    });
    this.updateLS();
    this.render();
  }

  onHandleDeleteTodo(todo) {
    const { listTodoId, id } = todo;
    this.listTodos.forEach((listTodo, index) => {
      if (listTodo.id === listTodoId) {
        this.listTodos[index].todos = listTodo.todos.filter(
          (todo) => todo.id !== id
        );
      }
    });
    this.render();
    this.updateLS();
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

  drop(event) {
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
          if (this.listTodos[i].id === todoId) {
            temp = this.listTodos[i];
            currentIndexListTodo = i;
          }

          if (this.listTodos[i].id === this.currentBeforeListTodoId) {
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
        listTodo.todos.forEach((todo, index) => {
          if (todo.id === todoId) {
            currentIndexTodo = index;
            temp = todo;
          }

          if (this.currentAfterTodoId === todo.id) {
            desireIndexTodo = index;
          }

          if (this.currentBeforeTodoId === todo.id) {
            beforeIndexTodo = index;
          }
        });
      });

      if (currentIndexTodo === 0 || currentIndexTodo) {
        this.listTodos.forEach((listTodo) => {
          if (listTodo.id === listTodoId) {
            listTodo.todos.splice(currentIndexTodo, 1);
          }
        });
      }

      //insert todo

      this.listTodos.forEach((listTodo) => {
        if (listTodo.id === id) {
          if (
            ((desireIndexTodo === 1 && currentIndexTodo === 0) ||
              desireIndexTodo === 0) &&
            beforeIndexTodo !== 0
          ) {
            listTodo.todos.splice(0, 0, temp);
          } else if (
            (currentIndexTodo === beforeIndexTodo + 1 &&
              currentIndexTodo === desireIndexTodo - 1) ||
            (currentIndexTodo === 0 &&
              desireIndexTodo === beforeIndexTodo + 1 &&
              currentIndexTodo !== beforeIndexTodo)
          ) {
            listTodo.todos.splice(desireIndexTodo - 1, 0, temp);
          } else if (desireIndexTodo) {
            listTodo.todos.splice(desireIndexTodo, 0, temp);
          } else {
            listTodo.todos.splice(listTodo.todos.length, 0, temp);
          }
        }
      });
    }

    this.listTodos = this.listTodos.filter((listTodo) => listTodo);
    this.render();
    this.updateLS();
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
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
      body.style.overflow = "scroll";
    } else {
      modal.classList.remove("hidden");
      overlay.classList.remove("hidden");
      body.scrollIntoView();
      body.style.overflow = "hidden";
    }
  }
}
