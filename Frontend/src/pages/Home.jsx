import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-8 mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600 mb-4">
            TaskBoard Pro
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            A collaborative project management platform that helps teams work efficiently
          </p>

          {currentUser ? (
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              Get Started
            </Link>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6">
          <h2 className="text-2xl font-semibold text-purple-900 text-center mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white">
              <h3 className="text-lg font-medium text-purple-800 mb-3">
                Project Management
              </h3>
              <p className="text-slate-600">
                Create and manage projects with flexible boards
              </p>
            </div>
            <div className="p-6 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white">
              <h3 className="text-lg font-medium text-purple-800 mb-3">
                Task Organization
              </h3>
              <p className="text-slate-600">
                Create, assign and track tasks across different statuses
              </p>
            </div>
            <div className="p-6 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white">
              <h3 className="text-lg font-medium text-purple-800 mb-3">
                Team Collaboration
              </h3>
              <p className="text-slate-600">
                Work together with your team in real-time
              </p>
            </div>
            <div className="p-6 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white">
              <h3 className="text-lg font-medium text-purple-800 mb-3">
                Workflow Automation
              </h3>
              <p className="text-slate-600">
                Set up rules to automate your workflow processes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
