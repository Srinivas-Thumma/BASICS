import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/tasks">My Tasks</Link>

      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <span>Welcome, {user.name}</span>

          <button onClick={logout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;