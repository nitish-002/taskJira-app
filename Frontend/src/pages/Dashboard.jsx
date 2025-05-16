import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProjects } from '../services/projectService';
import { testAuthentication, checkToken } from '../utils/authUtils';
import AssignedTasks from '../components/dashboard/AssignedTasks';
import Sidebar from '../components/layout/Sidebar';
import './Pages.css';

function Dashboard() {
  const { currentUser, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    // Check token validity
    const tokenStatus = checkToken();
    setAuthStatus(tokenStatus);
    
    async function fetchProjects() {
      try {
        // Test authentication first
        const authTest = await testAuthentication();
        console.log('Auth test result:', authTest);
        
        if (authTest.success) {
          const projectsData = await getUserProjects();
          setProjects(projectsData.slice(0, 4)); // Show only the first 4 projects
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser && token) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [currentUser, token]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <Sidebar />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600">
              Hello, {currentUser?.displayName || 'User'}
            </h1>
            <p className="text-slate-600 mt-2">Welcome to your project dashboard</p>
          </div>
          
          {authStatus && !authStatus.valid && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-purple-700">{authStatus.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                Refresh page
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-purple-100/50 transition-all duration-300">
                <AssignedTasks />
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-purple-900">Your Projects</h2>
                  <Link to="/projects" className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.length > 0 ? (
                    projects.map(project => (
                      <Link 
                        to={`/projects/${project._id}`} 
                        key={project._id}
                        className="group block p-5 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white"
                      >
                        <h3 className="text-lg font-medium text-purple-800 group-hover:text-emerald-600 transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-slate-600 text-sm line-clamp-2">{project.description}</p>
                        <div className="mt-4 flex items-center text-purple-500 text-sm">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>{project.members.length} members</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-purple-200 rounded-xl">
                      <p className="text-purple-600 mb-4">You don't have any projects yet.</p>
                      <Link 
                        to="/projects" 
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200"
                      >
                        Create your first project
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
