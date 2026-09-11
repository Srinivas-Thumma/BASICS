function TaskCard({ task, onComplete, onDelete, onEdit }) {
  return (
    <div>
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <p>
        Status: <strong>{task.status}</strong>
      </p>

      <button onClick={() => onEdit(task)}>
        Edit
      </button>

      {task.status !== "completed" && (
        <button onClick={() => onComplete(task)}>
          Complete
        </button>
      )}

      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </div>
  );
}

export default TaskCard;