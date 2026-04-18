import { useEffect, useState } from "react";
import axios from "axios";

function Leaves() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    from_date: "",
    to_date: "",
    reason: ""
  });

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees",
        { headers }
      );

      setEmployees(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchLeaves = async (employeeList = employees) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leaves",
        { headers }
      );

      let data = res.data;

      // Employee sirf apni leave dekhega
      if (role === "employee") {
        const currentUser = employeeList.find(
          (emp) =>
            emp.name?.toLowerCase() === name?.toLowerCase()
        );

        if (currentUser) {
          data = data.filter(
            (leave) =>
              leave.employee_id === currentUser._id
          );
        } else {
          data = [];
        }
      }

      setLeaves(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/employees",
        { headers }
      );

      setEmployees(res.data);
      fetchLeaves(res.data);
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const applyLeave = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/leaves",
        form,
        { headers }
      );

      fetchLeaves();

      setForm({
        employee_id: "",
        from_date: "",
        to_date: "",
        reason: ""
      });

      alert("✅ Leave Applied");

    } catch (error) {
      alert("❌ Failed");
    }
  };

  const approveLeave = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/leaves/${id}/approve`,
        {},
        { headers }
      );

      fetchLeaves();
      alert("✅ Leave Approved");

    } catch (error) {
      alert("❌ Failed");
    }
  };

  const rejectLeave = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/leaves/${id}/reject`,
        {},
        { headers }
      );

      fetchLeaves();
      alert("❌ Leave Rejected");

    } catch (error) {
      alert("❌ Failed");
    }
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(
      (item) => item._id === id
    );

    return emp ? emp.name : id;
  };

  return (
    <>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Leave Management
        </h1>

        <p className="text-gray-500 mt-1">
          Apply and manage leave requests
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={applyLeave}
        className="grid md:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow mb-8"
      >
        <select
          name="employee_id"
          className="border p-3 rounded"
          value={form.employee_id}
          onChange={handleChange}
        >
          <option value="">
            Select Employee
          </option>

          {employees.map((emp) => (
            <option
              key={emp._id}
              value={emp._id}
            >
              {emp.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="from_date"
          className="border p-3 rounded"
          value={form.from_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="to_date"
          className="border p-3 rounded"
          value={form.to_date}
          onChange={handleChange}
        />

        <input
          name="reason"
          placeholder="Reason"
          className="border p-3 rounded"
          value={form.reason}
          onChange={handleChange}
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-3">
          Apply Leave
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3">
                Employee
              </th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>

              {role !== "employee" && (
                <th>Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr
                key={leave._id}
                className="border-b"
              >
                <td className="py-3">
                  {getEmployeeName(
                    leave.employee_id
                  )}
                </td>

                <td>
                  {leave.from_date?.slice(
                    0,
                    10
                  )}
                </td>

                <td>
                  {leave.to_date?.slice(
                    0,
                    10
                  )}
                </td>

                <td>{leave.reason}</td>

                <td>
                  <span
                    className={
                      leave.status ===
                      "approved"
                        ? "text-green-600 font-semibold"
                        : leave.status ===
                          "rejected"
                        ? "text-red-500 font-semibold"
                        : "text-yellow-500 font-semibold"
                    }
                  >
                    {leave.status}
                  </span>
                </td>

                {role !== "employee" && (
                  <td className="space-x-2">

                    <button
                      onClick={() =>
                        approveLeave(
                          leave._id
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectLeave(
                          leave._id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
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

export default Leaves;