import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../../services/projectService';
import { getTaskById } from '../../services/taskService';
import MembersList from './MembersList';
import InviteMemberModal from './InviteMemberModal';
import Kanban from '../tasks/Kanban';
import TaskDetailModal from '../tasks/TaskDetailModal';
import AutomationList from '../automations/AutomationList';
import { useAuth } from '../../context/AuthContext';
import { getTaskIdFromUrl } from '../../utils/urlUtils';
import './Projects.css';
import Sidebar from '../layout/Sidebar';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // For direct task links
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);
  
  const { currentUser } = useAuth();
  
  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      setTitle(projectData.title);
      setDescription(projectData.description || '');
      setError(null);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProject();
    
    // Check if there's a task ID in the URL
    const taskId = getTaskIdFromUrl();
    if (taskId) {
      setTaskLoading(true);
      getTaskById(taskId)
        .then(task => {
          setSelectedTask(task);
        })
        .catch(err => {
          console.error('Error loading task:', err);
        })
        .finally(() => {
          setTaskLoading(false);
        });
    }
  }, [projectId]);
  
  const handleSaveChanges = async () => {
    try {
      await updateProject(projectId, { title, description });
      setIsEditing(false);
      fetchProject();
    } catch (err) {
      setError('Failed to update project');
      console.error(err);
    }
  };
  
  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
        console.error(err);
      }
    }
  };
  
  const isOwner = () => {
    if (!project) return false;
    return project.members.some(member => 
      member.userId === project.createdBy && member.role === 'owner'
    );
  };

  const isProjectOwner = () => {
    if (!project) return false;
    return project.members.some(member => 
      member.userId === currentUser?.uid && member.role === 'owner'
    );
  };
  
  const handleMemberInvited = () => {
    setShowInviteModal(false);
    fetchProject();
  };
  
  const handleTaskModalClosed = () => {
    setSelectedTask(null);
    // Remove the task parameter from URL
    navigate(`/projects/${projectId}`, { replace: true });
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading project details...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!project) {
    return <div className="not-found">Project not found</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <Sidebar />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
            <button 
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </button>

            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-3xl font-bold px-4 py-2 rounded-lg border border-purple-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-colors duration-200"
                  placeholder="Project Title"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-colors duration-200"
                  placeholder="Project Description"
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 rounded-lg transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600">
                  {project?.title}
                </h1>
                <p className="text-slate-600 mt-2">{project?.description}</p>
                {isProjectOwner() && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200"
                    >
                      Edit Project
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      Delete Project
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Members Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-purple-900">Project Members</h2>
              {isProjectOwner() && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200"
                >
                  + Invite Member
                </button>
              )}
            </div>
            <MembersList
              members={project?.members || []}
              projectId={projectId}
              onMemberRemoved={fetchProject}
              isOwner={isProjectOwner()}
            />
          </div>

          {/* Tasks Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
            {project && (
              <Kanban
                project={project}
                isOwner={isProjectOwner()}
              />
            )}
          </div>
            
          {/* Automations Section */}
          {project && isProjectOwner() && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6">
              <AutomationList
                project={project}
                isOwner={isProjectOwner()}
              />
            </div>
          )}

          {/* Modals */}
          {showInviteModal && (
            <InviteMemberModal
              projectId={projectId}
              onClose={() => setShowInviteModal(false)}
              onMemberInvited={handleMemberInvited}
            />
          )}

          {/* Task detail modal */}
          {selectedTask && (
            <TaskDetailModal
              task={selectedTask}
              onClose={handleTaskModalClosed}
              onTaskUpdated={fetchProject}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
