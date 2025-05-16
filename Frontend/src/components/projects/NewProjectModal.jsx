import { useState } from 'react';
import { createProject } from '../../services/projectService';
import './Projects.css';

function NewProjectModal({ onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createProject({ title, description });
      onProjectCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-purple-100 bg-gradient-to-br from-purple-50 to-emerald-50">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600">
            Create New Project
          </h2>
          <p className="text-slate-600 mt-1">Start organizing your tasks with a new project</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 bg-white">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="w-full px-4 py-2.5 rounded-lg border border-purple-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-colors duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-purple-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-purple-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-emerald-600 rounded-lg hover:from-purple-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProjectModal;
