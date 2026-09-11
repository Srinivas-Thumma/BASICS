import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Before sending anything to the backend, define what valid login data looks like.
const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Get login function from AuthContext
  const { login } = useAuth();

  // Used to move the user to another route
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);

      // Login successful → go to tasks
      navigate("/tasks");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input type="email" {...register("email")} />

          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} />

          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;