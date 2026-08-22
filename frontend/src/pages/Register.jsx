import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee"
  });

  const API_URL =
    "https://employee-shift-management-system-blond.vercel.app";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/register`,
        form
      );

      alert("Registered Successfully");
      navigate("/login");

    } catch (error) {
      console.log("Registration Error:", error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl w-96 shadow-xl"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full border p-3 rounded mb-4"
          value={form.role}
          onChange={handleChange}
        >
          <option value="employee">
            Employee
          </option>

          <option value="manager">
            Manager
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded"
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Already account?

          <Link
            to="/login"
            className="text-blue-600 ml-1"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;