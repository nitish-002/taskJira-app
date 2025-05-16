import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProjects } from '../services/projectService';
import { testAuthentication, checkToken } from '../utils/authUtils';
import AssignedTasks from '../components/dashboard/AssignedTasks';
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
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Hello, {currentUser?.displayName || 'User'}</h1>
        <p>Welcome to your project dashboard</p>
      </div>
      
      {authStatus && !authStatus.valid && (
        <div className="auth-warning">
          <p>{authStatus.message}</p>
          <button onClick={() => window.location.reload()}>Refresh page</button>
        </div>
      )}

      <div className="dashboard-content">
        <div className="section">
          <AssignedTasks />
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Your Projects</h2>
            <Link to="/projects" className="view-all-link">View All</Link>
          </div>
          
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map(project => (
                <Link 
                  to={`/projects/${project._id}`} 
                  key={project._id}
                  className="project-card"
                >
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span>{project.members.length} members</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p>You don't have any projects yet.</p>
                <Link to="/projects" className="create-btn">Create your first project</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
