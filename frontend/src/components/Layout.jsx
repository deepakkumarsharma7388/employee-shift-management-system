import {
  Outlet,
  useNavigate,
  useLocation
} from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuClass = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white px-4 py-3 rounded-lg cursor-pointer font-medium"
      : "hover:bg-slate-700 px-4 py-3 rounded-lg cursor-pointer transition";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 h-screen sticky top-0 bg-slate-900 text-white p-6 flex flex-col shadow-xl">

        {/* Top Section */}
        <div>
          {/* Logo */}
          <h1 className="text-2xl font-bold mb-2">
            ESS Panel
          </h1>

          {/* User Info */}
          <p className="text-sm text-gray-300 mb-8 capitalize">
            {name} ({role})
          </p>

          {/* Menu */}
          <ul className="space-y-3">

            {/* Dashboard */}
            <li
              onClick={() => navigate("/")}
              className={menuClass("/")}
            >
              Dashboard
            </li>

            {/* Employees */}
            {(role === "admin" || role === "manager") && (
              <li
                onClick={() => navigate("/employees")}
                className={menuClass("/employees")}
              >
                Employees
              </li>
            )}

            {/* Shifts */}
            <li
              onClick={() => navigate("/shifts")}
              className={menuClass("/shifts")}
            >
              Shifts
            </li>

            {/* Attendance */}
            <li
              onClick={() => navigate("/attendance")}
              className={menuClass("/attendance")}
            >
              Attendance
            </li>

            {/* Leaves */}
            <li
              onClick={() => navigate("/leaves")}
              className={menuClass("/leaves")}
            >
              Leaves
            </li>

          </ul>
        </div>

        {/* Logout Bottom Fixed */}
        <button
          onClick={logout}
          className="mt-auto w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold transition"
        >
          Logout
        </button>

      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default Layout;