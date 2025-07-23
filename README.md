# Multi-user Todo List App

A full-stack web application that allows multiple users to register, log in, and manage their personal task lists. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and modern web technologies.

## 🚀 Features

### Core Features
- 🔐 **User Authentication**: JWT-based registration and login
- 👥 **Multi-user Support**: Each user has their own secure task list
- 📝 **CRUD Operations**: Create, read, update, and delete tasks
- ✅ **Task Management**: Mark tasks as complete/incomplete
- 🔍 **Search & Filter**: Filter tasks by status, priority, and search text
- 📅 **Due Date Tracking**: Set and track task due dates
- 🎯 **Priority Levels**: Low, medium, and high priority tasks
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

### Technical Features
- 🛡️ **Input Validation**: Client and server-side validation
- 🔒 **Protected Routes**: Secure access to user-specific data
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 🔄 **State Management**: React Context API for global state
- 📦 **TypeScript**: Full type safety throughout the application
- 🔔 **Real-time Feedback**: Toast notifications for user actions
- 🚀 **Fast Development**: Vite for rapid development experience

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: Cross-origin resource sharing

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
todo-app/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables template
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript definitions
│   │   ├── App.tsx         # Main app component
│   │   ├── main.tsx        # App entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
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

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd todo-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Task Endpoints

- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/toggle` - Toggle task status

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

## 🎯 Learning Objectives

This project demonstrates:

- **Full-stack Development**: Complete MERN stack application
- **Authentication**: JWT-based user authentication
- **Database Design**: MongoDB schemas and relationships
- **API Development**: RESTful API with Express.js
- **Frontend Architecture**: Modern React patterns and practices
- **State Management**: Context API for global state
- **Form Handling**: Client and server-side validation
- **UI/UX Design**: Responsive design with Tailwind CSS
- **Error Handling**: Comprehensive error handling
- **Security**: Password hashing, input validation, CORS

## 🚀 Deployment

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS team for the utility-first CSS framework
- MongoDB team for the flexible database
- Express.js team for the web framework 