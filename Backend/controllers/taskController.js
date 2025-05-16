import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';
import User from '../models/userModel.js';
import { processTaskAutomations } from '../services/automationService.js';
import { getIO } from '../websocket/socketServer.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, status, assignee, dueDate } = req.body;
    const { uid } = req.user;
    
    // Verify that the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    // Verify the status is valid for the project
    if (!project.statuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of the project statuses.',
        validStatuses: project.statuses
      });
    }
    
    // Find the assignee if provided by email
    let assigneeData = null;
    if (assignee) {
      // Check if the assignee email is a project member
      const assigneeMember = project.members.find(member => member.email === assignee);
      
      if (!assigneeMember) {
        return res.status(400).json({ message: 'Assignee must be a member of the project.' });
      }
      
      assigneeData = {
        userId: assigneeMember.userId,
        email: assigneeMember.email
      };
    }
    
    const task = new Task({
      title,
      description,
      projectId,
      status: status || project.statuses[0], // Default to first status if not provided
      assignee: assigneeData,
      dueDate,
      createdBy: uid
    });
    
    await task.save();
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-created', task);
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Get all tasks for a project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { uid } = req.user;
    
    // Verify that the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    const tasks = await Task.find({ projectId });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { uid } = req.user;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, assignee, dueDate } = req.body;
    const { uid } = req.user;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    // Verify the status is valid for the project if provided
    if (status && !project.statuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of the project statuses.',
        validStatuses: project.statuses
      });
    }
    
    // Find the assignee if provided by email
    let assigneeData = null;
    if (assignee) {
      // Check if the assignee email is a project member
      const assigneeMember = project.members.find(member => member.email === assignee);
      
      if (!assigneeMember) {
        return res.status(400).json({ message: 'Assignee must be a member of the project.' });
      }
      
      assigneeData = {
        userId: assigneeMember.userId,
        email: assigneeMember.email
      };
    }
    
    // Save the previous state for automation comparison
    const previousTask = { ...task.toObject() };
    
    // Update task fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (assignee !== undefined) {
      if (assignee) {
        // Check if the assignee email is a project member
        const assigneeMember = project.members.find(member => member.email === assignee);
        
        if (!assigneeMember) {
          return res.status(400).json({ message: 'Assignee must be a member of the project.' });
        }
        
        task.assignee = {
          userId: assigneeMember.userId,
          email: assigneeMember.email
        };
      } else {
        task.assignee = null;
      }
    }
    if (dueDate !== undefined) task.dueDate = dueDate;
    task.updatedAt = Date.now();
    
    await task.save();
    
    // Process automations
    await processTaskAutomations(task, previousTask);
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-updated', task);
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Update task status (move task)
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const { uid } = req.user;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    // Verify the status is valid for the project
    if (!project.statuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of the project statuses.',
        validStatuses: project.statuses
      });
    }
    
    // Save the previous state for automation comparison
    const previousTask = { ...task.toObject() };
    
    task.status = status;
    task.updatedAt = Date.now();
    
    await task.save();
    
    // Process automations
    await processTaskAutomations(task, previousTask);
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-updated', task);
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { uid } = req.user;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify that the project exists
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user is a member of the project
    const isMember = project.members.some(member => member.userId === uid);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this project.' });
    }
    
    await Task.findByIdAndDelete(taskId);
    
    // Emit real-time update via WebSocket
    const io = getIO();
    io.to(`project:${task.projectId}`).emit('task-deleted', { taskId, projectId: task.projectId });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// Update project statuses
export const updateProjectStatuses = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { statuses } = req.body;
    const { uid } = req.user;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify that user has owner role in project
    const userMember = project.members.find(member => member.userId === uid);
    if (!userMember || userMember.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only project owner can update statuses.' });
    }
    
    // Validate statuses array
    if (!Array.isArray(statuses) || statuses.length === 0) {
      return res.status(400).json({ message: 'Statuses must be a non-empty array of strings.' });
    }
    
    // Make sure all tasks with statuses not in the new list are moved to a default status
    const defaultStatus = statuses[0];
    const tasksToUpdate = await Task.find({
      projectId,
      status: { $nin: statuses }
    });
    
    // Update tasks with outdated statuses
    if (tasksToUpdate.length > 0) {
      await Task.updateMany(
        { 
          projectId,
          status: { $nin: statuses }
        },
        { status: defaultStatus }
      );
    }
    
    // Update project statuses
    project.statuses = statuses;
    await project.save();
    
    res.status(200).json({ 
      message: 'Project statuses updated successfully', 
      project,
      tasksUpdated: tasksToUpdate.length
    });
  } catch (error) {
    console.error('Error updating project statuses:', error);
    res.status(500).json({ message: 'Error updating project statuses', error: error.message });
  }
};

// Get tasks assigned to a user
export const getUserTasks = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const tasks = await Task.find({
      'assignee.userId': uid
    }).populate({
      path: 'projectId',
      select: 'title members'
    });
    
    // Filter out tasks where the user might no longer be a member of the project
    const filteredTasks = tasks.filter(task => {
      if (!task.projectId) return false;
      return task.projectId.members.some(member => member.userId === uid);
    });
    
    res.status(200).json(filteredTasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
  }
};
