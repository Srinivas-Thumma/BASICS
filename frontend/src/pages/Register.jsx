import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);

      navigate("/tasks");
    } catch (error) {
      console.error("Registration failed:", error);

      setError("root", {
        type: "server",
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {errors.root && (
        <p>{errors.root.message}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>

          <input {...register("name")} />

          {errors.name && (
            <p>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            {...register("email")}
          />

          {errors.email && (
            <p>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            {...register("password")}
          />

          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account..."
            : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;