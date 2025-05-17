import { useState } from 'react';
import { createAutomation, updateAutomation } from '../../services/automationService.js';
import './Automations.css';

function AutomationForm({ project, automation, isEditing, onClose, onAutomationCreated, onAutomationUpdated }) {
  const [name, setName] = useState(automation?.name || '');
  const [triggerType, setTriggerType] = useState(automation?.trigger?.type || 'STATUS_CHANGE');
  const [fromStatus, setFromStatus] = useState(automation?.trigger?.fromStatus || project.statuses[0]);
  const [toStatus, setToStatus] = useState(automation?.trigger?.toStatus || project.statuses[0]);
  const [assigneeEmail, setAssigneeEmail] = useState(automation?.trigger?.assigneeEmail || '');
  const [actionType, setActionType] = useState(automation?.action?.type || 'MOVE_TASK');
  const [targetStatus, setTargetStatus] = useState(automation?.action?.targetStatus || project.statuses[0]);
  const [badgeName, setBadgeName] = useState(automation?.action?.badgeName || '');
  const [notificationText, setNotificationText] = useState(automation?.action?.notificationText || '');
  const [notifyAssignee, setNotifyAssignee] = useState(automation?.action?.notifyAssignee ?? true);
  const [notifyCreator, setNotifyCreator] = useState(automation?.action?.notifyCreator ?? false);
  const [notifyProjectOwners, setNotifyProjectOwners] = useState(automation?.action?.notifyProjectOwners ?? false);
  const [isActive, setIsActive] = useState(automation?.isActive ?? true);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Automation name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Build the automation object
      const automationData = {
        projectId: project._id,
        name,
        isActive,
        trigger: {
          type: triggerType,
        },
        action: {
          type: actionType,
        }
      };

      // Add trigger details based on type
      switch (triggerType) {
        case 'STATUS_CHANGE':
          automationData.trigger.fromStatus = fromStatus;
          automationData.trigger.toStatus = toStatus;
          break;
        case 'ASSIGNMENT_CHANGE':
          automationData.trigger.assigneeEmail = assigneeEmail;
          break;
      }

      // Add action details based on type
      switch (actionType) {
        case 'MOVE_TASK':
          automationData.action.targetStatus = targetStatus;
          break;
        case 'ASSIGN_BADGE':
          automationData.action.badgeName = badgeName;
          break;
        case 'SEND_NOTIFICATION':
          automationData.action.notificationText = notificationText;
          automationData.action.notifyAssignee = notifyAssignee;
          automationData.action.notifyCreator = notifyCreator;
          automationData.action.notifyProjectOwners = notifyProjectOwners;
          break;
      }

      if (isEditing) {
        await updateAutomation(automation._id, automationData);
        onAutomationUpdated();
      } else {
        await createAutomation(automationData);
        onAutomationCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save automation');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {isEditing ? 'Edit Automation' : 'New Automation'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Automation Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                placeholder="Enter automation name"
              />
            </div>

            {/* Trigger Section */}
            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-medium text-purple-900 mb-4">Trigger</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trigger Type
                  </label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  >
                    <option value="">Select trigger type</option>
                    <option value="STATUS_CHANGE">When task status changes</option>
                    <option value="ASSIGNMENT_CHANGE">When task is assigned</option>
                    <option value="DUE_DATE_PASSED">When task due date passes</option>
                  </select>
                </div>
                
                {/* Conditional trigger fields */}
                {triggerType === 'STATUS_CHANGE' && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="fromStatus">From Status</label>
                        <select
                          id="fromStatus"
                          value={fromStatus}
                          onChange={(e) => setFromStatus(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                        >
                          {project.statuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="toStatus">To Status</label>
                        <select
                          id="toStatus"
                          value={toStatus}
                          onChange={(e) => setToStatus(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                        >
                          {project.statuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
                
                {triggerType === 'ASSIGNMENT_CHANGE' && (
                  <div className="form-group">
                    <label htmlFor="assigneeEmail">Assigned To</label>
                    <select
                      id="assigneeEmail"
                      value={assigneeEmail}
                      onChange={(e) => setAssigneeEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                    >
                      <option value="">Select a member</option>
                      {project.members.map(member => (
                        <option key={member.email} value={member.email}>
                          {member.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Action Section */}
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-900 mb-4">Action</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Action Type
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                  >
                    <option value="">Select action type</option>
                    <option value="MOVE_TASK">Move task to a status</option>
                    <option value="ASSIGN_BADGE">Assign a badge</option>
                    <option value="SEND_NOTIFICATION">Send a notification</option>
                  </select>
                </div>
                
                {/* Conditional action fields */}
                {actionType === 'MOVE_TASK' && (
                  <div className="form-group">
                    <label htmlFor="targetStatus">Move To Status</label>
                    <select
                      id="targetStatus"
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                    >
                      {project.statuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {actionType === 'ASSIGN_BADGE' && (
                  <div className="form-group">
                    <label htmlFor="badgeName">Badge Name</label>
                    <input
                      type="text"
                      id="badgeName"
                      value={badgeName}
                      onChange={(e) => setBadgeName(e.target.value)}
                      placeholder="e.g., Task Master, Problem Solver"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                    />
                  </div>
                )}
                
                {actionType === 'SEND_NOTIFICATION' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="notificationText">Notification Message</label>
                      <textarea
                        id="notificationText"
                        value={notificationText}
                        onChange={(e) => setNotificationText(e.target.value)}
                        placeholder="Enter notification message"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                      />
                    </div>
                    
                    <div className="checkbox-group">
                      <label>Who should be notified?</label>
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="notifyAssignee"
                          checked={notifyAssignee}
                          onChange={(e) => setNotifyAssignee(e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="notifyAssignee" className="ml-2 text-sm text-slate-700">
                          Task assignee
                        </label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="notifyCreator"
                          checked={notifyCreator}
                          onChange={(e) => setNotifyCreator(e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="notifyCreator" className="ml-2 text-sm text-slate-700">
                          Task creator
                        </label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="notifyProjectOwners"
                          checked={notifyProjectOwners}
                          onChange={(e) => setNotifyProjectOwners(e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="notifyProjectOwners" className="ml-2 text-sm text-slate-700">
                          Project owners
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Automation' : 'Create Automation'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AutomationForm;
