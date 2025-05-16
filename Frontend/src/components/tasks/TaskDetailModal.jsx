import { useState } from 'react';
import { format } from 'date-fns';
import { updateTask, deleteTask, updateTaskStatus } from '../../services/taskService';
import CommentList from '../comments/CommentList';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import Toggle from '../common/Toggle';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import { ExclamationCircleIcon, CalendarIcon } from '../common/Icons';

function TaskDetailModal({ task, onClose, onTaskUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignee?.email || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Additional settings with toggles
  const [isUrgent, setIsUrgent] = useState(task.isUrgent || false);
  
  const { currentUser } = useAuth();
  
  // Check if current user is project owner
  const isProjectOwner = () => {
    return task.project?.members?.some(
      member => member.userId === currentUser?.uid && member.role === 'owner'
    );
  };
  
  // Check if current user is task assignee
  const isTaskAssignee = () => {
    return task.assignee && task.assignee.userId === currentUser?.uid;
  };
  
  // Check if user can change task status
  const canChangeTaskStatus = () => {
    return isProjectOwner() || isTaskAssignee();
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Build update object with only changed fields
      const updates = {};
      if (title !== task.title) updates.title = title;
      if (description !== (task.description || '')) updates.description = description;
      if (status !== task.status) updates.status = status;
      if (assignee !== (task.assignee?.email || '')) updates.assignee = assignee || null;
      if (dueDate !== (task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '')) {
        updates.dueDate = dueDate || null;
      }
      if (isUrgent !== (task.isUrgent || false)) updates.isUrgent = isUrgent;
      
      await updateTask(task._id, updates);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteTask(task._id);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      setIsSubmitting(false);
    }
  };
  
  const handleStatusChange = async (e) => {
    try {
      setChangingStatus(true);
      await updateTaskStatus(task._id, e.target.value);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setChangingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  // View Mode Content
  const renderViewMode = () => (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Status:</span>
            {isTaskAssignee() ? (
              <select
                value={task.status}
                onChange={handleStatusChange}
                disabled={changingStatus}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {task.project?.statuses?.map(statusOption => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>  
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {task.status}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Assignee:</span>
            <div className="flex items-center">
              <span className="text-gray-900 dark:text-gray-100">
                {task.assignee?.email || 'Unassigned'}
              </span>
              {isProjectOwner() && (
                <button 
                  className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                  onClick={() => setIsEditing(true)}
                  title="Assign this task"
                  type="button"
                >
                  <span className="text-sm">✎</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Due Date:</span>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-gray-100">{formatDate(task.dueDate)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Created:</span>
            <span className="text-gray-900 dark:text-gray-100">{formatDate(task.createdAt)}</span>
          </div>

          {task.isUrgent && (
            <div className="space-y-1 col-span-2">
              <span className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Priority:</span>
              <div className="flex items-center">
                <ExclamationCircleIcon className="w-4 h-4 mr-1 text-danger-500" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200">
                  Urgent
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Description</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <CommentList taskId={task._id} projectId={task.projectId} />
      </div>
    </>
  );
  
  // Edit Mode Content
  const renderEditMode = () => (
    <form id="edit-task-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
      {error && (
        <div className="bg-danger-50 border-l-4 border-danger-500 p-4 dark:bg-danger-900/30">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-danger-500" />
            <div className="ml-3">
              <p className="text-sm text-danger-700 dark:text-danger-200">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {task.project?.statuses?.map(statusOption => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Assignee (Email)
        </label>
        <select
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Unassigned</option>
          {task.project?.members?.map(member => (
            <option key={member.email} value={member.email}>
              {member.email}
            </option>
          ))}
        </select>
      </div>

      <div className="py-2">
        <Toggle 
          checked={isUrgent}
          onChange={(e) => setIsUrgent(e.target.checked)}
          label="Mark as urgent"
          id="task-urgent-toggle"
          labelPosition="right"
        />
      </div>
    </form>
  );
  
  // Modal footer based on mode
  const renderFooter = () => {
    if (isEditing) {
      return (
        <>
          <Button 
            variant="secondary" 
            onClick={() => setIsEditing(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            form="edit-task-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      );
    }
    
    return isProjectOwner() && (
      <>
        <Button 
          variant="danger"
          onClick={() => setShowConfirmDelete(true)}
          disabled={isSubmitting}
        >
          Delete
        </Button>
        <Button 
          onClick={() => setIsEditing(true)}
          disabled={isSubmitting}
        >
          Edit
        </Button>
      </>
    );
  };
  
  return (
    <>
      <Modal 
        isOpen={true}
        onClose={onClose}
        title={isEditing ? "Edit Task" : task.title}
        size="large"
        className="task-detail-modal"
        footer={renderFooter()}
      >
        {isEditing ? renderEditMode() : renderViewMode()}
      </Modal>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        confirmStyle="danger"
      />
    </>
  );
}

export default TaskDetailModal;
