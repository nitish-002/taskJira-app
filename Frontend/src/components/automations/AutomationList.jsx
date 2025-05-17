import { useState, useEffect } from 'react';
import { getProjectAutomations, deleteAutomation } from '../../services/automationService.js';
import AutomationForm from './AutomationForm';
import './Automations.css';

function AutomationList({ project, isOwner }) {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewAutomationForm, setShowNewAutomationForm] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const data = await getProjectAutomations(project._id);
      setAutomations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load automations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, [project._id]);

  const handleDeleteAutomation = async (automationId) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        await deleteAutomation(automationId);
        fetchAutomations();
      } catch (err) {
        setError('Failed to delete automation');
        console.error(err);
      }
    }
  };

  const handleAutomationCreated = () => {
    setShowNewAutomationForm(false);
    fetchAutomations();
  };

  const handleAutomationUpdated = () => {
    setEditingAutomation(null);
    fetchAutomations();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderTriggerDetails = (trigger) => {
    switch (trigger.type) {
      case 'STATUS_CHANGE':
        return (
          <span>When task moves from <strong>{trigger.fromStatus}</strong> to <strong>{trigger.toStatus}</strong></span>
        );
      case 'ASSIGNMENT_CHANGE':
        return (
          <span>When task is assigned to <strong>{trigger.assigneeEmail}</strong></span>
        );
      case 'DUE_DATE_PASSED':
        return (
          <span>When task due date passes</span>
        );
      default:
        return <span>Unknown trigger type</span>;
    }
  };

  const renderActionDetails = (action) => {
    switch (action.type) {
      case 'ASSIGN_BADGE':
        return (
          <span>Assign badge: <strong>{action.badgeName}</strong></span>
        );
      case 'MOVE_TASK':
        return (
          <span>Move task to status: <strong>{action.targetStatus}</strong></span>
        );
      case 'SEND_NOTIFICATION':
        return (
          <span>Send notification: <strong>{action.notificationText}</strong></span>
        );
      default:
        return <span>Unknown action type</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-purple-900">Workflow Automations</h2>
        {isOwner && (
          <button 
            onClick={() => setShowNewAutomationForm(true)}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Automation
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {automations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-purple-200 rounded-xl">
          <p className="text-purple-600 mb-4">No automations set up yet.</p>
          {isOwner && (
            <button 
              onClick={() => setShowNewAutomationForm(true)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create your first automation
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {automations.map((automation) => (
            <div 
              key={automation._id} 
              className={`p-4 bg-white/80 backdrop-blur-sm rounded-xl border ${automation.isActive ? 'border-purple-200' : 'border-slate-200'} hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <h3 className="font-medium text-slate-900">{automation.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full inline-flex w-fit mt-2 ${
                    automation.isActive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {automation.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingAutomation(automation)}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteAutomation(automation._id)}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-purple-50/50 rounded-lg">
                  <div className="text-purple-700 font-medium mb-1">Trigger</div>
                  <div className="text-slate-600">{renderTriggerDetails(automation.trigger)}</div>
                </div>
                
                <div className="p-3 bg-emerald-50/50 rounded-lg">
                  <div className="text-emerald-700 font-medium mb-1">Action</div>
                  <div className="text-slate-600">{renderActionDetails(automation.action)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOwner && showNewAutomationForm && (
        <AutomationForm
          project={project}
          onClose={() => setShowNewAutomationForm(false)}
          onAutomationCreated={handleAutomationCreated}
        />
      )}

      {isOwner && editingAutomation && (
        <AutomationForm
          project={project}
          automation={editingAutomation}
          isEditing={true}
          onClose={() => setEditingAutomation(null)}
          onAutomationUpdated={handleAutomationUpdated}
        />
      )}
    </div>
  );
}

export default AutomationList;
