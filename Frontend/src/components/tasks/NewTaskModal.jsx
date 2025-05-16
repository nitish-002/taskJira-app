import { useState } from 'react';
import { createTask } from '../../services/taskService';
import Modal from '../common/Modal';
import './Tasks.css';

function NewTaskModal({ project, onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(project.statuses[0]);
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createTask({
        title,
        description,
        projectId: project._id,
        status,
        assignee,
        dueDate: dueDate || undefined
      });
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      setIsSubmitting(false);
    }
  };
  
  const modalFooter = (
    <>
      <button 
        type="button" 
        className="modal-secondary-btn" 
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button 
        type="button"
        onClick={handleSubmit}
        className="modal-primary-btn" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </>
  );
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Task"
      size="medium"
      footer={modalFooter}
    >
      <form id="new-task-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={4}
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {project.statuses.map(statusOption => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="assignee">Assignee (Email)</label>
          <select
            id="assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Unassigned</option>
            {project.members.map(member => (
              <option key={member.email} value={member.email}>
                {member.email}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
}

export default NewTaskModal;
