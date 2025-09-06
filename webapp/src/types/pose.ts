// MediaPipe pose types
export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PoseResults {
  poseLandmarks: PoseLandmark[];
  poseWorldLandmarks?: PoseLandmark[];
  segmentationMask?: ImageData;
}

// BJJ Training types
export interface BJJPosition {
  id: string;
  name: string;
  category: 'guard' | 'mount' | 'side-control' | 'back-control' | 'submission';
  description: string;
  keyPoints: number[]; // MediaPipe landmark indices
}

export interface TrainingSession {
  id: string;
  positionId: string;
  startTime: Date;
  endTime?: Date;
  accuracy: number;
  feedback: string[];
}

export interface PoseAnalysis {
  accuracy: number;
  feedback: string[];
  keyAngles: { [key: string]: number | null };
  isCorrectPosition: boolean;
}

// Camera and detection types
export interface CameraConfig {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

export interface DetectionConfig {
  modelComplexity: 0 | 1 | 2;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}