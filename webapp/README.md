# BJJ Pose Trainer MVP

A Brazilian Jiu-Jitsu pose training application built with Next.js, TypeScript, and MediaPipe for real-time pose detection and analysis.

## Features

- Real-time pose detection using MediaPipe
- BJJ-specific pose analysis and feedback
- Training session tracking
- Progress visualization
- Camera-based pose recognition
- Responsive design with TailwindCSS

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Allow camera permissions when prompted
2. Select a BJJ training mode (guard positions, submissions, etc.)
3. Follow the on-screen guidance for proper form
4. Track your progress and improvement over time

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience  
- **TailwindCSS** - Modern utility-first CSS framework
- **MediaPipe** - Real-time pose detection and analysis
- **React** - Component-based UI library

## Camera Requirements

- Modern web browser with camera support
- Good lighting conditions for optimal pose detection
- Stable internet connection for initial MediaPipe model loading

## Development

The application is built using modern web technologies and follows Next.js best practices:

- `/src/app` - Application pages and layouts
- `/src/components` - Reusable React components  
- `/src/lib` - Utility functions and pose analysis logic
- `/public` - Static assets and MediaPipe models
