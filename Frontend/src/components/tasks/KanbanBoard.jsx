import { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import NewTaskModal from './NewTaskModal';
import StatusManagementModal from './StatusManagementModal';
import Button from '../common/Button';

function KanbanBoard({ project }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  
  // Fetch tasks (placeholder for actual implementation)
  useEffect(() => {
    // ... fetch tasks code
  }, [project._id]);
  
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
  };
  
  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100', 'dark:bg-gray-700/50');
  };
  
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-gray-100', 'dark:bg-gray-700/50');
  };
  
  const handleDrop = (e, status) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100', 'dark:bg-gray-700/50');
    
    // Update task status code here
  };
  
  // Group tasks by status
  const tasksByStatus = {};
  project.statuses.forEach(status => {
    tasksByStatus[status] = tasks.filter(task => task.status === status);
  });
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.name} Tasks</h2>
        
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowNewTaskModal(true)}
            variant="primary"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Task
          </Button>
          
          <Button
            onClick={() => setShowStatusModal(true)}
            variant="secondary"
          >
            Manage Statuses
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-md text-red-800 dark:text-red-300">
          {error}
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4 snap-x">
          {project.statuses.map(status => (
            <div
              key={status}
              className="min-w-[300px] w-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col max-h-[600px] snap-start"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 sticky top-0 z-10 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {status}
                  </h3>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                    {tasksByStatus[status].length}
                  </span>
                </div>
              </div>
              
              <div 
                className="p-3 overflow-y-auto flex-1 space-y-2 transition-colors"
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                {tasksByStatus[status].length > 0 ? (
                  tasksByStatus[status].map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onTaskUpdated={() => fetchTasks()}
                      onDragStart={handleDragStart}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                    No tasks yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showNewTaskModal && (
        <NewTaskModal
          project={project}
          onClose={() => setShowNewTaskModal(false)}
          onTaskCreated={() => {
            fetchTasks();
            setShowNewTaskModal(false);
          }}
        />
      )}
      
      {showStatusModal && (
        <StatusManagementModal
          project={project}
          onClose={() => setShowStatusModal(false)}
          onStatusesUpdated={() => {
            // Refresh project data
            setShowStatusModal(false);
          }}
        />
      )}
    </div>
  );
}

export default KanbanBoard;
