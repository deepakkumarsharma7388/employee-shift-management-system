import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [stats, setStats] = useState({
    employees: 0,
    shifts: 0,
    leaves: 0
  });

  const fetchStats = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const emp = await axios.get(
        "http://localhost:5000/api/employees",
        { headers }
      );

      const shifts = await axios.get(
        "http://localhost:5000/api/shifts",
        { headers }
      );

      const leaves = await axios.get(
        "http://localhost:5000/api/leaves",
        { headers }
      );

      setStats({
        employees: emp.data.length,
        shifts: shifts.data.length,
        leaves: leaves.data.length
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">
          Welcome {name}
        </h1>

        <p className="text-blue-100 text-lg capitalize">
          Logged in as {role}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Employees */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
          <p className="text-gray-500 text-lg">
            Total Employees
          </p>

          <h2 className="text-5xl font-bold text-gray-800 mt-4">
            {stats.employees}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Active workforce records
          </p>
        </div>

        {/* Shifts */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 border-green-500">
          <p className="text-gray-500 text-lg">
            Total Shifts
          </p>

          <h2 className="text-5xl font-bold text-gray-800 mt-4">
            {stats.shifts}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Assigned shift schedules
          </p>
        </div>

        {/* Leaves */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 border-red-500">
          <p className="text-gray-500 text-lg">
            Leave Requests
          </p>

          <h2 className="text-5xl font-bold text-gray-800 mt-4">
            {stats.leaves}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            Pending / Approved requests
          </p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-10 bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">
          Quick Overview
        </h3>

        <p className="text-gray-600 leading-7">
          Manage employees, assign shifts, track attendance,
          and monitor leave requests from one centralized dashboard.
        </p>
      </div>

    </div>
  );
}

export default Dashboard;