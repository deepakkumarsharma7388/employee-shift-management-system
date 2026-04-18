import { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [employee_id, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);

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

  const fetchAttendance = async (
    employeeList = employees
  ) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/attendance",
        { headers }
      );

      let data = res.data;

      // Employee sirf apna record dekhega
      if (role === "employee") {
        const currentUser = employeeList.find(
          (emp) =>
            emp.name?.toLowerCase() ===
            name?.toLowerCase()
        );

        if (currentUser) {
          setEmployeeId(currentUser._id);

          data = data.filter(
            (item) =>
              item.employee_id === currentUser._id
          );
        } else {
          data = [];
        }
      }

      setRecords(data);

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
      fetchAttendance(res.data);
    };

    loadData();
  }, []);

  const checkIn = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/attendance/checkin",
        { employee_id },
        { headers }
      );

      fetchAttendance();

      alert("✅ Checked In");

    } catch (error) {
      alert("❌ Failed");
    }
  };

  const checkOut = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/attendance/checkout",
        { employee_id },
        { headers }
      );

      fetchAttendance();

      alert("✅ Checked Out");

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
          Attendance Management
        </h1>

        <p className="text-gray-500 mt-1">
          Track employee attendance
        </p>
      </div>

      {/* Action Box */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-3 gap-4">

        {/* Admin + Manager can select */}
        {role !== "employee" ? (
          <select
            className="border p-3 rounded"
            value={employee_id}
            onChange={(e) =>
              setEmployeeId(e.target.value)
            }
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
        ) : (
          <input
            value={name}
            readOnly
            className="border p-3 rounded bg-gray-100"
          />
        )}

        <button
          onClick={checkIn}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded"
        >
          Check In
        </button>

        <button
          onClick={checkOut}
          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded"
        >
          Check Out
        </button>

      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3">
                Employee
              </th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
            </tr>
          </thead>

          <tbody>
            {records.map((item) => (
              <tr
                key={item._id}
                className="border-b"
              >
                <td className="py-3">
                  {getEmployeeName(
                    item.employee_id
                  )}
                </td>

                <td>
                  {item.date?.slice(0, 10)}
                </td>

                <td>
                  {item.checkin
                    ? new Date(
                        item.checkin
                      ).toLocaleTimeString()
                    : "-"}
                </td>

                <td>
                  {item.checkout
                    ? new Date(
                        item.checkout
                      ).toLocaleTimeString()
                    : "-"}
                </td>

                <td>
                  {item.working_hours}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}

export default Attendance;