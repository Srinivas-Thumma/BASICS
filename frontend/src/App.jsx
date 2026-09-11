import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;