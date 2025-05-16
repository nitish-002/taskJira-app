import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../../context/AuthContext';
import './Tasks.css';

function TaskCard({ task, onTaskUpdated, onDragStart, onClick }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { currentUser } = useAuth();
  
  // Check if current user can move this task (owner or assignee)
  const canMoveTask = () => {
    if (!currentUser) return false;
    
    // User is assigned this task
    if (task.assignee && task.assignee.userId === currentUser.uid) {
      return true;
    }
    
    // User is project owner
    if (task.project && task.project.members) {
      const isOwner = task.project.members.some(
        member => member.userId === currentUser.uid && member.role === 'owner'
      );
      
      if (isOwner) {
        return true;
      }
    }
    
    return false;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const handleTaskUpdated = () => {
    setShowDetailModal(false);
    if (onTaskUpdated) onTaskUpdated();
  };
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(task);
    } else {
      setShowDetailModal(true);
    }
  };
  
  const handleDragStart = (e) => {
    const canMove = canMoveTask();
    
    if (canMove) {
      // Add a visual indication of dragging
      e.currentTarget.classList.add('dragging');
      onDragStart(e, task._id);
    } else {
      e.preventDefault();
    }
  };
  
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };
  
  // Determine if task is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now && task.status !== 'Done';
  };
  
  return (
    <>
      <div 
        className={`
          bg-white dark:bg-gray-800 rounded-md border 
          ${task.isUrgent ? 'border-l-4 border-l-red-500' : ''} 
          ${canMoveTask() ? 'cursor-grab border-l-4 border-l-primary-500' : ''}
          ${isOverdue() ? 'border-red-200 dark:border-red-900' : 'border-gray-200 dark:border-gray-700'}
          p-3 shadow-sm hover:shadow-md transition-all duration-200 group relative
          ${isOverdue() ? 'bg-red-50 dark:bg-red-900/10' : ''}
        `}
        draggable={canMoveTask()}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
      >
        <h4 className="text-gray-900 dark:text-gray-100 font-medium mb-2 pr-6">
          {task.isUrgent && (
            <span className="text-red-500 mr-1" title="Urgent">⚠️</span>
          )}
          {task.title}
        </h4>
        
        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-xs mt-2">
          {task.dueDate && (
            <span 
              className={`
                inline-flex items-center px-2 py-1 rounded-full
                ${isOverdue() 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }
              `}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isOverdue() ? 'Overdue ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
          
          {task.assignee?.email && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {task.assignee.email.split('@')[0]}
              {task.assignee.userId === currentUser?.uid && (
                <span className="ml-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs" title="Assigned to me">✓</span>
              )}
            </span>
          )}
        </div>
        
        {/* Quick action buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          {canMoveTask() && (
            <button 
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              title="Edit task"
              onClick={e => { e.stopPropagation(); setShowDetailModal(true); }}
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {showDetailModal && !onClick && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowDetailModal(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </>
  );
}

export default TaskCard;
