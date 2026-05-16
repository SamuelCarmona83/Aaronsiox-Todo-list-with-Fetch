import React, { useState, useEffect } from "react";
const TaskItem = (taskprops) => {
	const [hover, setHover] = useState(!true)
	return <li key={taskprops.id} className="list-group-item d-flex justify-content-between align-items-center" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
		{taskprops.text}

		{(hover && <button
			className="btn btn-danger btn-sm p-0"
			onClick={() => taskprops.onDelete(taskprops.id)}
			style= {{fontSize: "13px"}}
		>
			<i className="fa-solid fa-trash-can"></i>
		</button>)}
	</li>
}

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");

	const addTask = (e) => {
		if (e.key === "Enter" && newTask.trim() !== "") {
			fetch("https://playground.4geeks.com/todo/todos/MrMartinezTabata", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					label: newTask,
					is_done: false
				})
			})
			.then((resp) => {
				console.log(resp.ok)
				return resp.json()
			})
			.then((createdTask) => {
				console.log(createdTask)
				// setTasks([...tasks, {id: Date.now(), label: createdTask.label}]);
				setNewTask("");
				listTasks()
			})
			.catch(error => {
        		console.log(error);
    		});
		} 
	};

	const deleteTask = (id) => {
		// setTasks(tasks.filter(task => task.id !== id));
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(resp => {
			if (resp.ok) {
				listTasks()
			}
		})
		.catch(error => {
        		console.log(error);
    		});
	}

	const itemsLeft = tasks.length;
	const itemsText = itemsLeft === 1 ? "Tarea restante" : "Tareas restantes";

	const listTasks = () => {
		fetch("https://playground.4geeks.com/todo/users/MrMartinezTabata", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(resp => {
			return resp.json();
		})
		.then(fetchTasks =>{
			console.log(fetchTasks)
			setTasks(fetchTasks.todos)
		})
		.catch(error => {
        		console.log(error);
    		});
	}
	useEffect(() => {
		listTasks()
	}, [])

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow">
						<div className="card-header bg-secondary text-white text-center">
							<h4>Todo List</h4>
						</div>
						<div className="card-body">
							<input
								type="text"
								className="form-control mb-3"
								placeholder="Añadir tareas..."
								value={newTask}
								onChange={(e) => setNewTask(e.target.value)}
								onKeyPress={addTask}
							/>
							{tasks.length === 0 ? (
								<div className="text-center text-muted">
									<p><strong>No hay tareas, añadir tareas</strong></p>
								</div>
							) : (
								<ul className="list-group">
									{tasks.map(task => (
										<TaskItem key={task.id} text={task.label} id={task.id} onDelete={deleteTask} />
									))}
								</ul>
							)}
						</div>
						<div className="card-footer text-muted text-center">
							{itemsLeft} {itemsText}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;