import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center">
          <svg
            className="h-8 w-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
            CurTer
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
            isActive("/dashboard")
              ? "bg-gradient-to-r from-purple-600 to-emerald-600 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
          }`}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </Link>

        <Link
          to="/projects"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
            isActive("/projects") || location.pathname.startsWith("/projects/")
              ? "bg-gradient-to-r from-purple-600 to-emerald-600 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
          }`}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          Projects
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-emerald-600 flex items-center justify-center text-white mr-3">
            {currentUser.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <div className="text-sm font-medium">
              {currentUser.displayName || "User"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentUser.email}
            </div>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="mt-2 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
