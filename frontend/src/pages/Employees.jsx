import { useEffect, useState } from "react";
import axios from "axios";

function Employees() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    branch: "",
    designation: "",
    joining_date: "",
    status: "active",
    manager_id: ""
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEmployees(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/employees",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchEmployees();

      setForm({
        name: "",
        email: "",
        department: "",
        branch: "",
        designation: "",
        joining_date: "",
        status: "active",
        manager_id: ""
      });

      alert("✅ Employee Added");

    } catch (error) {
      alert("❌ Failed");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchEmployees();

      alert("🗑 Employee Deleted");

    } catch (error) {
      alert("❌ Delete Failed");
    }
  };

  // Employee role blocked
  if (role === "employee") {
    return (
      <h1 className="text-2xl font-bold text-red-500">
        Access Denied
      </h1>
    );
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Employee Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage employee records
        </p>
      </div>

      {/* Add Form - Admin + Manager */}
      {(role === "admin" || role === "manager") && (
        <form
          onSubmit={addEmployee}
          className="grid md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow mb-8"
        >
          <input
            name="name"
            placeholder="Name"
            className="border p-3 rounded"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="border p-3 rounded"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="department"
            placeholder="Department"
            className="border p-3 rounded"
            value={form.department}
            onChange={handleChange}
          />

          <input
            name="branch"
            placeholder="Branch"
            className="border p-3 rounded"
            value={form.branch}
            onChange={handleChange}
          />

          <input
            name="designation"
            placeholder="Designation"
            className="border p-3 rounded"
            value={form.designation}
            onChange={handleChange}
          />

          <input
            type="date"
            name="joining_date"
            className="border p-3 rounded"
            value={form.joining_date}
            onChange={handleChange}
          />

          <input
            name="manager_id"
            placeholder="Manager ID"
            className="border p-3 rounded"
            value={form.manager_id}
            onChange={handleChange}
          />

          <select
            name="status"
            className="border p-3 rounded"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-3">
            Add Employee
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3">Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Status</th>

              {role === "admin" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b">

                <td className="py-3">{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>

                <td>
                  <span
                    className={
                      emp.status === "active"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {emp.status}
                  </span>
                </td>

                {role === "admin" && (
                  <td>
                    <button
                      onClick={() => deleteEmployee(emp._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}

export default Employees;