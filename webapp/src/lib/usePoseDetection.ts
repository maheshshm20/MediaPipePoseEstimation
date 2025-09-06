'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { PoseResults, DetectionConfig, PoseLandmark } from '@/types/pose';

// MediaPipe imports need to be dynamic since they're browser-only
interface MediaPipePose {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOptions: (options: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResults: (callback: (results: any) => void) => void;
  send: (data: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
}

interface MediaPipeCamera {
  start: () => Promise<void>;
  stop: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Pose: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Camera: any;

export function usePoseDetection(config: DetectionConfig) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PoseResults | null>(null);
  
  const poseRef = useRef<MediaPipePose | null>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);

  // Initialize MediaPipe
  const initializeMediaPipe = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Dynamically import MediaPipe modules
      const [poseModule, cameraModule] = await Promise.all([
        import('@mediapipe/pose'),
        import('@mediapipe/camera_utils')
      ]);
      
      Pose = poseModule.Pose;
      Camera = cameraModule.Camera;
      
      // Create pose instance
      poseRef.current = new Pose({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      // Configure pose detection
      if (poseRef.current) {
        poseRef.current.setOptions({
          modelComplexity: config.modelComplexity,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: config.minDetectionConfidence,
          minTrackingConfidence: config.minTrackingConfidence,
        });

        // Set up results callback
        poseRef.current.onResults((results: { poseLandmarks?: PoseLandmark[] }) => {
          if (results.poseLandmarks) {
            setResults({
              poseLandmarks: results.poseLandmarks
            });
          }
        });
      }

      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize pose detection');
      setIsLoading(false);
      console.error('MediaPipe initialization error:', err);
    }
  }, [config]);

  // Start camera and pose detection
  const startDetection = useCallback(async () => {
    if (!poseRef.current || !videoRef.current) {
      await initializeMediaPipe();
      return;
    }

    try {
      setIsActive(true);
      setError(null);

      // Create camera instance
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          if (poseRef.current && videoRef.current) {
            await poseRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      if (cameraRef.current) {
        await cameraRef.current.start();
      }
    } catch (err) {
      setError('Failed to start camera');
      setIsActive(false);
      console.error('Camera start error:', err);
    }
  }, [initializeMediaPipe]);

  // Stop detection
  const stopDetection = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    setIsActive(false);
    setResults(null);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopDetection();
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, [stopDetection]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    isActive,
    error,
    results,
    startDetection,
    stopDetection,
  };
}