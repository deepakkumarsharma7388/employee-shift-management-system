import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Shifts from "./pages/Shifts";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";

import Layout from "./components/Layout";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route
          path="/"
          element={
            token ? (
              <Layout />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* Employees */}
          <Route
            path="employees"
            element={<Employees />}
          />

          {/* Shifts */}
          <Route
            path="shifts"
            element={<Shifts />}
          />

          {/* Attendance */}
          <Route
            path="attendance"
            element={<Attendance />}
          />

          {/* Leaves */}
          <Route
            path="leaves"
            element={<Leaves />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;