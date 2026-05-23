import { useState } from "react";

const TaskItem = (taskprops) => {
  const [hover, setHover] = useState(false);
  return (
    <li
      key={taskprops.id}
      className="list-group-item d-flex justify-content-between align-items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {taskprops.text}

      {hover && (
        <button
          className="btn btn-danger btn-sm p-0 task-delete-btn"
          onClick={() => taskprops.onDelete(taskprops.id)}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      )}
    </li>
  );
};


export default TaskItem;