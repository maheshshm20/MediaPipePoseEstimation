'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePoseDetection } from '@/lib/usePoseDetection';
import { analyzeBJJPose, BJJ_POSITIONS } from '@/lib/bjjAnalysis';
import { PoseAnalysis, PoseLandmark } from '@/types/pose';

interface PoseDetectionProps {
  selectedPosition: string;
  onAnalysisUpdate: (analysis: PoseAnalysis) => void;
  fullScreen?: boolean;
  darkTheme?: boolean;
  isPaused?: boolean;
}

export default function PoseDetection({ 
  selectedPosition, 
  onAnalysisUpdate, 
  fullScreen = false, 
  darkTheme = false, 
  isPaused = false 
}: PoseDetectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(0);
  
  const {
    videoRef,
    isLoading,
    isActive,
    error,
    results,
    startDetection,
    stopDetection,
  } = usePoseDetection({
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  // Draw pose connections
  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, landmarks: PoseLandmark[], width: number, height: number) => {
    const connections = [
      // Face
      [0, 1], [1, 2], [2, 3], [3, 7],
      [0, 4], [4, 5], [5, 6], [6, 8],
      [9, 10],
      
      // Torso
      [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
      [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
      [11, 23], [12, 24], [23, 24],
      
      // Left arm
      [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
      
      // Right arm  
      [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
      
      // Legs
      [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
      [24, 26], [26, 28], [28, 30], [28, 32], [30, 32],
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    connections.forEach(([startIdx, endIdx]) => {
      const startLandmark = landmarks[startIdx];
      const endLandmark = landmarks[endIdx];
      
      if (startLandmark && endLandmark && 
          startLandmark.visibility && endLandmark.visibility &&
          startLandmark.visibility > 0.5 && endLandmark.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(startLandmark.x * width, startLandmark.y * height);
        ctx.lineTo(endLandmark.x * width, endLandmark.y * height);
        ctx.stroke();
      }
    });
  }, []);

  // Draw pose landmarks and connections
  const drawPoseLandmarks = useCallback((ctx: CanvasRenderingContext2D, landmarks: PoseLandmark[], width: number, height: number) => {
    // Draw connections first
    drawConnections(ctx, landmarks, width, height);
    
    // Draw landmarks
    landmarks.forEach((landmark) => {
      if (landmark.visibility && landmark.visibility > 0.5) {
        const x = landmark.x * width;
        const y = landmark.y * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }, [drawConnections]);

  // Draw pose landmarks on canvas
  useEffect(() => {
    if (!results || !canvasRef.current || !videoRef.current || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mirror the canvas for selfie view
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw pose landmarks
    if (results.poseLandmarks) {
      drawPoseLandmarks(ctx, results.poseLandmarks, canvas.width, canvas.height);
      
      // Analyze the pose
      const analysis = analyzeBJJPose(results.poseLandmarks, selectedPosition);
      onAnalysisUpdate(analysis);
    }

    ctx.restore();

    // Calculate FPS
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  }, [results, selectedPosition, onAnalysisUpdate, drawPoseLandmarks, isPaused]);

  // Auto-start detection in full-screen mode
  useEffect(() => {
    if (fullScreen && !isLoading && !isActive && !error) {
      startDetection();
    }
  }, [fullScreen, isLoading, isActive, error, startDetection]);

  if (fullScreen) {
    return (
      <div className="relative w-full h-full bg-gray-900">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          width={640}
          height={480}
        />
        
        {/* Status Overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm z-10">
          {isLoading && 'Loading...'}
          {!isLoading && !isActive && 'Camera stopped'}
          {!isLoading && isActive && isPaused && 'Paused'}
          {!isLoading && isActive && !isPaused && `FPS: ${fps}`}
        </div>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80 text-white text-center p-4">
            <div>
              <p className="text-lg font-semibold mb-2">Camera Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Video and Canvas Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full max-w-2xl max-h-96 object-contain"
          width={640}
          height={480}
        />
        
        {/* Status Overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
          {isLoading && 'Loading...'}
          {!isLoading && !isActive && 'Camera stopped'}
          {!isLoading && isActive && `FPS: ${fps}`}
        </div>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80 text-white text-center p-4">
            <div>
              <p className="text-lg font-semibold mb-2">Camera Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={startDetection}
          disabled={isLoading || isActive}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Start Camera'}
        </button>
        
        <button
          onClick={stopDetection}
          disabled={!isActive}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop Camera
        </button>
      </div>

      {/* Position Info */}
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Current Position: {BJJ_POSITIONS.find(p => p.id === selectedPosition)?.name || 'None'}
        </h3>
        <p className="text-sm text-gray-600">
          {BJJ_POSITIONS.find(p => p.id === selectedPosition)?.description}
        </p>
      </div>
    </div>
  );
}