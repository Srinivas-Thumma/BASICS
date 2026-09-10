import { AppDataSource } from "../config/db.js";
import { Task } from "../entities/Task.js";

// Helper function to grab the TypeORM repository. 
// Wrapping this in a function is a safe pattern to ensure AppDataSource 
// is fully initialized before we try to use it.
const taskRepository = () => {
  return AppDataSource.getRepository(Task);
};

const allowedStatuses = ["pending", "in_progress", "completed"];

// CREATE
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // .create() prepares the object in Node.js memory.
    const task = taskRepository().create({
      title,
      description: description || null,
      status: status || "pending",
      userId: req.user.id, //took id from jwt
    });

    // .save() physically inserts the task into PostgreSQL.
    const savedTask = await taskRepository().save(task);

    return res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL
export const getTasks = async (req, res) => {
  try {
    const tasks = await taskRepository().find({
      // SECURITY: The WHERE clause ensures User A only gets User A's tasks.
      // Without this, everyone would see every task in the entire database!
      where: {
        userId: req.user.id,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ONE
export const getTaskById = async (req, res) => {
  try {
    
    // req.params pulls the 'id' right out of the URL
    const { id } = req.params;


    const task = await taskRepository().findOneBy({
      id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await taskRepository().findOneBy({
      id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // These are PATCH - missing fields are ignored and untouched.
    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    const updatedTask = await taskRepository().save(task);

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskRepository().findOneBy({
      id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await taskRepository().remove(task);

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};