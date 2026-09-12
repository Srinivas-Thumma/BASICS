import express from "express"
import cookieParser from "cookie-parser"

import cors from "cors"

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";

import { verifyCsrfToken } from "./middleware/csrf.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Allow the React frontend to make credentialed requests to the backend. 
app.use(
  cors({
    origin:process.env.CLIENT_ORIGIN,
    credentials:true,
  })
)

app.use(verifyCsrfToken);

app.get('/api',(req,res) =>{
  res.json({message:"Hello World"})
});



//If a request URL starts with /api/auth, stop handling it here and hand it entirely over to the authRoutes file.
app.use("/api/auth",authRoutes);
app.use("/api/tasks", taskRoutes);




export default app;