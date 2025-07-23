# Todo App Backend

A robust RESTful API for the Multi-user Todo List application built with Express.js, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication
- 👥 Multi-user support
- 📝 CRUD operations for tasks
- 🔍 Search and filter tasks
- ✅ Task status management
- 📅 Due date tracking
- 🎯 Priority levels
- 🛡️ Input validation
- 🔒 Protected routes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user profile (requires authentication)

### Tasks

#### GET `/api/tasks`
Get all tasks for current user
- Query parameters:
  - `status`: pending | completed
  - `priority`: low | medium | high
  - `search`: search in title and description
  - `sortBy`: createdAt | dueDate | priority
  - `sortOrder`: asc | desc

#### POST `/api/tasks`
Create a new task
```json
{
  "title": "Complete project",
  "description": "Finish the todo app project",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "priority": "high"
}
```

#### GET `/api/tasks/:id`
Get a specific task

#### PUT `/api/tasks/:id`
Update a task

#### DELETE `/api/tasks/:id`
Delete a task

#### PATCH `/api/tasks/:id/toggle`
Toggle task status (pending ↔ completed)

### User Profile

#### GET `/api/users/profile`
Get current user profile

#### PUT `/api/users/profile`
Update user profile
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### DELETE `/api/users/profile`
Delete user account

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Development

- **Development server**: `npm run dev`
- **Production server**: `npm start`

## Project Structure

```
backend/
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 