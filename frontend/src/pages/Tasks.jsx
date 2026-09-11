import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task.api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setError("");

      const result = await getTasks();
      setTasks(result.tasks);
    } catch (error) {
      console.error(error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const result = await createTask({
        title,
        description,
      });

      setTasks((currentTasks) => [result.task, ...currentTasks]);

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      setError("Failed to create task");
    }
  };

  const handleComplete = async (task) => {
    try {
      const result = await updateTask(task.id, {
        status: "completed",
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? result.task : currentTask
        )
      );
    } catch (error) {
      console.error(error);
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error(error);
      setError("Failed to delete task");
    }
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div>
      <h1>My Tasks</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleCreate}>
        <div>
          <label>Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter description"
          />
        </div>

        <button type="submit">
          Create Task
        </button>
      </form>

      <hr />

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>Status: {task.status}</p>

            {task.status !== "completed" && (
              <button onClick={() => handleComplete(task)}>
                Complete
              </button>
            )}

            <button onClick={() => handleDelete(task.id)}>
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;