import { useEffect, useState } from "react";

function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
    }
  }, [task]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      title,
      description,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{task ? "Edit Task" : "Create Task"}</h2>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
      />

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button type="submit">
        {task ? "Update Task" : "Create Task"}
      </button>

      {task && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default TaskForm;