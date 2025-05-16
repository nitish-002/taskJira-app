import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProjects } from '../../services/projectService';
import NewProjectModal from './NewProjectModal';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getUserProjects();
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleProjectCreated = () => {
    fetchProjects();
    setShowNewProjectModal(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-900">Your Projects</h1>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map(project => (
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id}
              className="group block p-6 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-purple-800 group-hover:text-emerald-600 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">{project.description}</p>
              </div>
              <div className="ml-6 flex flex-col items-end gap-2">
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {project.members.length} members
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-purple-200 rounded-xl">
            <p className="text-purple-600 mb-4">You don't have any projects yet.</p>
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200"
            >
              Create your first project
            </button>
          </div>
        )}
      </div>
      
      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}

export default ProjectList;
