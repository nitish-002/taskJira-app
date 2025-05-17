# CurTer

A modern project management and collaboration platform designed to help teams organize, track, and manage their tasks efficiently with real-time updates and workflow automation.

![image](https://github.com/user-attachments/assets/d3b34d53-a882-49b7-a5aa-8390149b850d)



---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Database Diagram](#database-schema-diagram)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)

---

## Introduction

CurTer is a full-stack task management application built with **React**, **Node.js**, **Express**, and **MongoDB**.  
It empowers teams to efficiently collaborate on projects, manage tasks through a Kanban-style board, streamline communication with comments, and automate routine workflows with ease.

The application offers:

- A responsive and intuitive UI across all devices  
- Real-time task updates using WebSockets  
- Customizable automation rules and project workflows  
- Insightful analytics to monitor and boost project performance  


---

## Features

### Project Management
- **Project Creation & Organization:** Secure Login with Google Auth via Firebase
  ![image](https://github.com/user-attachments/assets/3dd3c7fa-bb2d-4f18-bd09-4da2f16e3848)


- **Project Creation & Organization:** Create new projects, add descriptions, and organize work.
  ![image](https://github.com/user-attachments/assets/2e2aa80b-c774-4089-8f17-be0275fbecf1)


- **Customizable Statuses:** Define your own workflow stages (To Do, In Progress, Review, Done, etc.).
 ![image](https://github.com/user-attachments/assets/5d15d5cd-45c0-4a90-80e6-8d44d66e941c)

  
- **Create and Assign Task:** Invite team members and assign roles (owner, member).
-  ![image](https://github.com/user-attachments/assets/7b5a2118-6e7d-4455-b93a-672b1f54ba58)

-  **Real Time Comment:** add comments in realTime
    ![image](https://github.com/user-attachments/assets/819a9750-f065-4819-a139-c5a9e44f3242)


### Task Management

- **Kanban Board View:** Drag-and-drop interface for managing tasks.
- **Task Details:** Title, description, assignee, due date, priority, urgency.
- **Comments & Discussions:** Threaded comments on tasks.
- **Task Assignments:** Assign tasks with email notifications.

### User Experience

- **Real-time Updates:** Instant changes via WebSocket integration.
- **Responsive Design:** Works on desktop, tablet, and mobile.
- **Notifications:** In-app for assignments, mentions, and status changes.
- **Dark Mode Support:** Adapts to system preferences.
- ![image](https://github.com/user-attachments/assets/be24a7e5-01b2-4e94-bb17-a8c387815969)


### Workflow Automation

- **Custom Automation Rules:** "If this, then that" style automations.
- **Triggers:** Status change, assignment change, due date passed.
- **Actions:** Move tasks, assign badges, send notifications.
- **Achievement Badges:** Gamification elements.
  ![image](https://github.com/user-attachments/assets/a4128423-67ed-40af-93c6-cbdc830bbd72)


### Security & Access Control

- **Authentication:** Secure user authentication with Firebase.
- **Role-Based Access:** Different permissions for owners/members.
- **Data Protection:** Encrypted storage and secure API endpoints.

---

## API Documentation

**All endpoints (except registration/login) require authentication via a Bearer token:**
```
Authorization: Bearer <your-jwt-token>
```

### 📁 Projects API

- **GET** `/api/projects`  
  → Fetch all projects belonging to the current user.

- **POST** `/api/projects`  
  → Create a new project.  
  **Body:**
  ```json
  {
    "title": "Project Title",
    "description": "Project Description"
  }
  | `DELETE` | `/api/projects/:projectId` | Delete a project | - |
| `POST` | `/api/projects/:projectId/invite` | Invite a user to the project | ```json
{
  "email": "user@example.com"
}
``` |
| `DELETE` | `/api/projects/:projectId/members/:userId` | Remove a user from a project | - |

## ✅ Tasks API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/tasks` | Create a new task | ```json
{
  "title": "Task Title",
  "description": "Details...",
  "projectId": "123",
  "status": "To Do",
  "assignee": "userId",
  "dueDate": "YYYY-MM-DD",
  "priority": "High",
  "isUrgent": true
}
``` |
| `GET` | `/api/tasks/project/:projectId` | Get all tasks in a project | - |
| `GET` | `/api/tasks/user/assigned` | Get tasks assigned to the current user | - |
| `GET` | `/api/tasks/:taskId` | Fetch a specific task by ID | - |
| `PUT` | `/api/tasks/:taskId` | Update task details | - |
| `PATCH` | `/api/tasks/:taskId/status` | Update only the status of a task | ```json
{
  "status": "In Progress"
}
``` |
| `DELETE` | `/api/tasks/:taskId` | Delete a task | - |
| `PUT` | `/api/tasks/project/:projectId/statuses` | Customize the task statuses for a project | ```json
{
  "statuses": ["To Do", "Review", "Done"]
}
``` |

## 💬 Comments API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/comments` | Add a comment to a task | ```json
{
  "taskId": "123",
  "content": "This task needs revision."
}
``` |
| `GET` | `/api/comments/task/:taskId` | Fetch all comments for a task | - |
| `DELETE` | `/api/comments/:commentId` | Delete a comment | - |

## ⚙️ Automations API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/automations` | Create a new automation rule | - |
| `GET` | `/api/automations/project/:projectId` | Get all automations for a project | - |
| `PUT` | `/api/automations/:automationId` | Update an automation rule | - |
| `DELETE` | `/api/automations/:automationId` | Delete an automation rule | - |
| `GET` | `/api/automations/badges` | Get all achievement badges for the user | - |
| `GET` | `/api/automations/notifications` | Fetch all automation-related notifications | - |

## Database Schema

<details>
<summary>Click to expand collections</summary>

### Project

```js
{
  _id: ObjectId,
  title: String,
  description: String,
  createdBy: String, // Firebase UID
  members: [
    {
      userId: String, // Firebase UID
      email: String,
      role: String, // 'owner' or 'member'
      name: String,
      joinedAt: Date
    }
  ],
  statuses: [String], // e.g., ['To Do', 'In Progress', 'Done']
  createdAt: Date,
  updatedAt: Date
}
```

### Task

```js
{
  _id: ObjectId,
  title: String,
  description: String,
  projectId: ObjectId, // ref: Project
  status: String,
  assignee: {
    userId: String,
    email: String,
    name: String
  },
  dueDate: Date,
  isUrgent: Boolean,
  priority: String, // '', 'low', 'medium', 'high'
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment

```js
{
  _id: ObjectId,
  taskId: ObjectId, // ref: Task
  projectId: ObjectId, // ref: Project
  content: String,
  author: {
    userId: String,
    name: String,
    email: String,
    photoURL: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Automation

```js
{
  _id: ObjectId,
  projectId: ObjectId, // ref: Project
  name: String,
  isActive: Boolean,
  trigger: {
    type: String, // 'STATUS_CHANGE', 'ASSIGNMENT_CHANGE', 'DUE_DATE_PASSED'
    fromStatus: String,
    toStatus: String,
    assigneeEmail: String
  },
  action: {
    type: String, // 'MOVE_TASK', 'ASSIGN_BADGE', 'SEND_NOTIFICATION'
    targetStatus: String,
    badgeName: String,
    notificationText: String,
    notifyAssignee: Boolean,
    notifyCreator: Boolean,
    notifyProjectOwners: Boolean
  },
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Badge

```js
{
  _id: ObjectId,
  userId: String,
  name: String,
  description: String,
  projectId: ObjectId, // ref: Project
  taskId: ObjectId, // ref: Task
  automationId: ObjectId, // ref: Automation
  awardedAt: Date
}
```

### Notification

```js
{
  _id: ObjectId,
  userId: String,
  type: String, // 'TASK_ASSIGNED', 'TASK_UPDATED', 'COMMENT_ADDED', 'AUTOMATION_TRIGGERED'
  title: String,
  content: String,
  relatedProjectId: ObjectId, // ref: Project
  relatedTaskId: ObjectId, // ref: Task
  isRead: Boolean,
  createdAt: Date
}
```
</details>

---

## Database Schema Diagram


![image](https://github.com/user-attachments/assets/f9ee752b-4f05-42ce-adb9-099052c359e0)
## System Architecture

```
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│ React Frontend│◄───────►│ Express API  │◄───────►  │  MongoDB     │
│   (Vite)     │  HTTP    │  (Node.js)   │           │              │
└──────────────┘           └──────────────┘           └──────────────┘
        │                        │
        ▼                        ▼
    WebSocket                Socket.io
      (Client)                (Server)

┌──────────────┐
│  Firebase    │
│Authentication│
└──────────────┘
```


---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Firebase account for authentication

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/Va16hav07/Taskboard-pro.git
    cd Taskboard-pro
    ```

2. **Install dependencies for backend and frontend**
    ```bash
    # Backend
    cd Backend
    npm install

    # Frontend
    cd ../Frontend
    npm install
    ```

3. **Create environment files**
    ```bash
    # Backend
    touch .env

    # Frontend
    touch .env
    ```

4. **Set environment variables**

    **Backend (.env):**
    ```
    copy grom .env.example
    ```

    **Frontend (.env):**
    ```
    copy grom .env.example

5. **Start the development servers**
    ```bash
    # Backend
    cd Backend
    npm run dev

    # Frontend (in another terminal)
    cd Frontend
    npm run dev
    ```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000
