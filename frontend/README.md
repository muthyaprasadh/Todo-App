# Todo App Frontend

A modern React frontend for the Multi-user Todo List application built with TypeScript, Tailwind CSS, and modern React patterns.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🔐 JWT Authentication
- 📱 Responsive design
- 🎯 Form validation with React Hook Form + Zod
- 🔄 State management with Context API
- 🚀 Fast development with Vite
- 📦 TypeScript for type safety
- 🔔 Toast notifications
- 🎨 ShadCN-inspired components

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── App.tsx        # Main app component
├── main.tsx       # App entry point
└── index.css      # Global styles
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Development

The frontend is configured to proxy API requests to the backend running on port 5000. Make sure your backend is running before starting the frontend.

## Building for Production

```bash
npm run build
```

This will create a `dist` folder with the production build.

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test your changes thoroughly
4. Update documentation if needed 