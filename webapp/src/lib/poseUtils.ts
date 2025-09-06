import { PoseLandmark } from '@/types/pose';

// MediaPipe landmark indices
export const POSE_LANDMARKS = {
  // Face
  nose: 0,
  leftEyeInner: 1,
  leftEye: 2,
  leftEyeOuter: 3,
  rightEyeInner: 4,
  rightEye: 5,
  rightEyeOuter: 6,
  leftEar: 7,
  rightEar: 8,
  mouthLeft: 9,
  mouthRight: 10,
  
  // Torso
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftPinky: 17,
  rightPinky: 18,
  leftIndex: 19,
  rightIndex: 20,
  leftThumb: 21,
  rightThumb: 22,
  leftHip: 23,
  rightHip: 24,
  
  // Legs
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
  leftHeel: 29,
  rightHeel: 30,
  leftFootIndex: 31,
  rightFootIndex: 32,
} as const;

/**
 * Calculate angle between three points
 */
export function calculateAngle(
  pointA: PoseLandmark,
  pointB: PoseLandmark,
  pointC: PoseLandmark
): number {
  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - 
                  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(pointA: PoseLandmark, pointB: PoseLandmark): number {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

/**
 * Check if a landmark is visible (confidence threshold)
 */
export function isLandmarkVisible(landmark: PoseLandmark, threshold = 0.5): boolean {
  return landmark.visibility !== undefined && landmark.visibility >= threshold;
}

/**
 * Get key body angles for BJJ analysis
 */
export function getBodyAngles(landmarks: PoseLandmark[]) {
  const angles = {
    leftElbow: null as number | null,
    rightElbow: null as number | null,
    leftKnee: null as number | null,
    rightKnee: null as number | null,
    leftShoulder: null as number | null,
    rightShoulder: null as number | null,
    leftHip: null as number | null,
    rightHip: null as number | null,
    torso: null as number | null,
  };

  try {
    // Left elbow angle
    if (landmarks[POSE_LANDMARKS.leftShoulder] && 
        landmarks[POSE_LANDMARKS.leftElbow] && 
        landmarks[POSE_LANDMARKS.leftWrist]) {
      angles.leftElbow = calculateAngle(
        landmarks[POSE_LANDMARKS.leftShoulder],
        landmarks[POSE_LANDMARKS.leftElbow],
        landmarks[POSE_LANDMARKS.leftWrist]
      );
    }

    // Right elbow angle
    if (landmarks[POSE_LANDMARKS.rightShoulder] && 
        landmarks[POSE_LANDMARKS.rightElbow] && 
        landmarks[POSE_LANDMARKS.rightWrist]) {
      angles.rightElbow = calculateAngle(
        landmarks[POSE_LANDMARKS.rightShoulder],
        landmarks[POSE_LANDMARKS.rightElbow],
        landmarks[POSE_LANDMARKS.rightWrist]
      );
    }

    // Left knee angle
    if (landmarks[POSE_LANDMARKS.leftHip] && 
        landmarks[POSE_LANDMARKS.leftKnee] && 
        landmarks[POSE_LANDMARKS.leftAnkle]) {
      angles.leftKnee = calculateAngle(
        landmarks[POSE_LANDMARKS.leftHip],
        landmarks[POSE_LANDMARKS.leftKnee],
        landmarks[POSE_LANDMARKS.leftAnkle]
      );
    }

    // Right knee angle
    if (landmarks[POSE_LANDMARKS.rightHip] && 
        landmarks[POSE_LANDMARKS.rightKnee] && 
        landmarks[POSE_LANDMARKS.rightAnkle]) {
      angles.rightKnee = calculateAngle(
        landmarks[POSE_LANDMARKS.rightHip],
        landmarks[POSE_LANDMARKS.rightKnee],
        landmarks[POSE_LANDMARKS.rightAnkle]
      );
    }

    // Shoulder angles
    if (landmarks[POSE_LANDMARKS.leftElbow] && 
        landmarks[POSE_LANDMARKS.leftShoulder] && 
        landmarks[POSE_LANDMARKS.leftHip]) {
      angles.leftShoulder = calculateAngle(
        landmarks[POSE_LANDMARKS.leftElbow],
        landmarks[POSE_LANDMARKS.leftShoulder],
        landmarks[POSE_LANDMARKS.leftHip]
      );
    }

    if (landmarks[POSE_LANDMARKS.rightElbow] && 
        landmarks[POSE_LANDMARKS.rightShoulder] && 
        landmarks[POSE_LANDMARKS.rightHip]) {
      angles.rightShoulder = calculateAngle(
        landmarks[POSE_LANDMARKS.rightElbow],
        landmarks[POSE_LANDMARKS.rightShoulder],
        landmarks[POSE_LANDMARKS.rightHip]
      );
    }

    // Hip angles
    if (landmarks[POSE_LANDMARKS.leftKnee] && 
        landmarks[POSE_LANDMARKS.leftHip] && 
        landmarks[POSE_LANDMARKS.leftShoulder]) {
      angles.leftHip = calculateAngle(
        landmarks[POSE_LANDMARKS.leftKnee],
        landmarks[POSE_LANDMARKS.leftHip],
        landmarks[POSE_LANDMARKS.leftShoulder]
      );
    }

    if (landmarks[POSE_LANDMARKS.rightKnee] && 
        landmarks[POSE_LANDMARKS.rightHip] && 
        landmarks[POSE_LANDMARKS.rightShoulder]) {
      angles.rightHip = calculateAngle(
        landmarks[POSE_LANDMARKS.rightKnee],
        landmarks[POSE_LANDMARKS.rightHip],
        landmarks[POSE_LANDMARKS.rightShoulder]
      );
    }

    // Torso angle (shoulder line relative to hip line)
    if (landmarks[POSE_LANDMARKS.leftShoulder] && 
        landmarks[POSE_LANDMARKS.rightShoulder] &&
        landmarks[POSE_LANDMARKS.leftHip] && 
        landmarks[POSE_LANDMARKS.rightHip]) {
      const shoulderMidpoint = {
        x: (landmarks[POSE_LANDMARKS.leftShoulder].x + landmarks[POSE_LANDMARKS.rightShoulder].x) / 2,
        y: (landmarks[POSE_LANDMARKS.leftShoulder].y + landmarks[POSE_LANDMARKS.rightShoulder].y) / 2,
      };
      const hipMidpoint = {
        x: (landmarks[POSE_LANDMARKS.leftHip].x + landmarks[POSE_LANDMARKS.rightHip].x) / 2,
        y: (landmarks[POSE_LANDMARKS.leftHip].y + landmarks[POSE_LANDMARKS.rightHip].y) / 2,
      };
      
      angles.torso = Math.atan2(
        shoulderMidpoint.y - hipMidpoint.y,
        shoulderMidpoint.x - hipMidpoint.x
      ) * 180 / Math.PI;
    }
  } catch (error) {
    console.warn('Error calculating body angles:', error);
  }

  return angles;
}