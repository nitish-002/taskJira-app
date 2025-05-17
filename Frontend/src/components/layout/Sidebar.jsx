import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserNotifications } from "../../services/automationService";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const [latestNotification, setLatestNotification] = useState(null);

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

  useEffect(() => {
    const fetchLatestNotification = async () => {
      try {
        const notifications = await getUserNotifications();
        if (notifications.length > 0) {
          setLatestNotification(notifications[0]);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchLatestNotification();
    // Poll for new notifications every minute
    const interval = setInterval(fetchLatestNotification, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center">
          <svg
            className="h-8 w-8 text-primary-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h14v14H5V5z" />
            <path d="M10 8a1 1 0 000 2h4a1 1 0 000-2h-4z" />
            <path d="M8 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
            <path d="M14 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
          </svg>
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
            TaskBoard Pro
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

        {/* Latest Notification */}
        {latestNotification && (
          <Link
            to="/profile?tab=notifications"
            className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {latestNotification.type === "TASK" && <span>📝</span>}
                {latestNotification.type === "BADGE" && <span>🏆</span>}
                {latestNotification.type === "PROJECT" && <span>📂</span>}
                {latestNotification.type === "SYSTEM" && <span>ℹ️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-0.5 truncate">
                  {latestNotification.title}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-300 line-clamp-2">
                  {latestNotification.message}
                </p>
              </div>
              {!latestNotification.isRead && (
                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
              )}
            </div>
          </Link>
        )}
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
