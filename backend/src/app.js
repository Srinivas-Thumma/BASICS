import express from "express"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/api',(req,res) =>{
  res.json({message:"Hello"})
});

//If a request URL starts with /api/auth, stop handling it here and hand it entirely over to the authRoutes file.
app.use("/api/auth",authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;