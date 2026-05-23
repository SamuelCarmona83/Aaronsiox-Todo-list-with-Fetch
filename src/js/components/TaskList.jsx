import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem";


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [submitError, setSubmitError] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;

    fetch("https://playground.4geeks.com/todo/todos/MrCarmona", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: newTask,
        is_done: false,
      }),
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error(`No se pudo crear la tarea (${resp.status} ${resp.statusText})`);
        }
        return resp.json();
      })
      .then(() => {
        setSubmitError("");
        setNewTask("");
        listTasks();
      })
      .catch(error => {
        setSubmitError(error.message);
        console.error(error);
      });
  };

  const deleteTask = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(resp => {
        if (resp.ok) {
          listTasks();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const amountItemsLeft = tasks.length;
  const itemsLeft = amountItemsLeft === 1 ? "Tarea restante" : "Tareas restantes";

  const itemsLabel = `${amountItemsLeft} ${itemsLeft}`;

  const createUser = async () => {
    let resp = await fetch(
      "https://playground.4geeks.com/todo/users/MrCarmona",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );
    let data = await resp.json();

    if (resp.ok) {
      await listTasks();
    }
  };

  const listTasks = () => {
    fetch("https://playground.4geeks.com/todo/users/MrCarmona", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          createUser();
          throw new Error("El usuario no esta creado en la API");
        }

        return resp.json();
      })
      .then((fetchTasks) => {
        setTasks(fetchTasks.todos);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    listTasks();
  }, []);

  return (
    <div className="app-page">
      <div className="app-page-content">
        <section className="app-form-shell card shadow" aria-labelledby="todo-list-title">
            <div className="card-header app-form-shell-header text-white text-center">
              <h4 id="todo-list-title">Todo List</h4>
            </div>
            <div className="card-body app-form-shell-body">
              <form className="app-form" onSubmit={(event) => {
                event.preventDefault();
                addTask();
              }}>
                <input
                  type="text"
                  className="form-control app-form-control"
                  placeholder="Añadir tareas..."
                  value={newTask}
                  onChange={(e) => {
                    setNewTask(e.target.value);
                    if (submitError) setSubmitError("");
                  }}
                />
                <button type="submit" className="btn btn-secondary app-form-submit">
                  Añadir tarea
                </button>
              </form>
              {submitError && (
                <p className="app-form-feedback" role="alert">{submitError}</p>
              )}
              {tasks.length === 0 ? (
                <div className="text-center text-muted app-form-empty-state">
                  <p>
                    <strong>No hay tareas, añadir tareas</strong>
                  </p>
                </div>
              ) : (
                <ul className="list-group">
                  {tasks.map(task => (
                    <TaskItem
                      key={task.id}
                      text={task.label}
                      id={task.id}
                      onDelete={deleteTask}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer text-muted text-center">
              {itemsLabel}
            </div>
        </section>
      </div>
    </div>
  );
};

export default TaskList;
