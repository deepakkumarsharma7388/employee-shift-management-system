import { useEffect, useState } from "react";
import axios from "axios";

function Shifts() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    shift_date: "",
    start_time: "",
    end_time: "",
    branch: ""
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

  const fetchShifts = async (employeeList = employees) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/shifts",
        { headers }
      );

      let data = res.data;

      // Employee sirf apni shifts dekhega
      if (role === "employee") {
        const currentUser = employeeList.find(
          (emp) =>
            emp.name?.toLowerCase() === name?.toLowerCase()
        );

        if (currentUser) {
          data = data.filter(
            (shift) =>
              shift.employee_id === currentUser._id
          );
        } else {
          data = [];
        }
      }

      setShifts(data);

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
      fetchShifts(res.data);
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createShift = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/shifts",
        form,
        { headers }
      );

      fetchShifts();

      setForm({
        employee_id: "",
        shift_date: "",
        start_time: "",
        end_time: "",
        branch: ""
      });

      alert("✅ Shift Created");

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
          Shift Management
        </h1>

        <p className="text-gray-500 mt-1">
          Create and manage shift schedules
        </p>
      </div>

      {/* Form - Admin + Manager only */}
      {(role === "admin" ||
        role === "manager") && (
        <form
          onSubmit={createShift}
          className="grid md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow mb-8"
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
            name="shift_date"
            className="border p-3 rounded"
            value={form.shift_date}
            onChange={handleChange}
          />

          <input
            name="start_time"
            placeholder="09:00 AM"
            className="border p-3 rounded"
            value={form.start_time}
            onChange={handleChange}
          />

          <input
            name="end_time"
            placeholder="06:00 PM"
            className="border p-3 rounded"
            value={form.end_time}
            onChange={handleChange}
          />

          <input
            name="branch"
            placeholder="Branch"
            className="border p-3 rounded"
            value={form.branch}
            onChange={handleChange}
          />

          <button className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-3">
            Create Shift
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3">
                Employee
              </th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Branch</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift) => (
              <tr
                key={shift._id}
                className="border-b"
              >
                <td className="py-3">
                  {getEmployeeName(
                    shift.employee_id
                  )}
                </td>

                <td>
                  {shift.shift_date?.slice(
                    0,
                    10
                  )}
                </td>

                <td>
                  {shift.start_time}
                </td>

                <td>
                  {shift.end_time}
                </td>

                <td>
                  {shift.branch}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}

export default Shifts;