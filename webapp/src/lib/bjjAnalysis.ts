import { PoseLandmark, BJJPosition, PoseAnalysis } from '@/types/pose';
import { getBodyAngles, POSE_LANDMARKS, isLandmarkVisible } from './poseUtils';

// BJJ positions with their key characteristics
export const BJJ_POSITIONS: BJJPosition[] = [
  {
    id: 'closed-guard',
    name: 'Closed Guard',
    category: 'guard',
    description: 'Bottom position with legs wrapped around opponent\'s torso',
    keyPoints: [POSE_LANDMARKS.leftHip, POSE_LANDMARKS.rightHip, POSE_LANDMARKS.leftKnee, POSE_LANDMARKS.rightKnee]
  },
  {
    id: 'open-guard',
    name: 'Open Guard',
    category: 'guard',
    description: 'Bottom position with legs controlling opponent without closing',
    keyPoints: [POSE_LANDMARKS.leftHip, POSE_LANDMARKS.rightHip, POSE_LANDMARKS.leftKnee, POSE_LANDMARKS.rightKnee]
  },
  {
    id: 'mount',
    name: 'Mount Position',
    category: 'mount',
    description: 'Top position sitting on opponent\'s torso',
    keyPoints: [POSE_LANDMARKS.leftHip, POSE_LANDMARKS.rightHip, POSE_LANDMARKS.leftKnee, POSE_LANDMARKS.rightKnee]
  },
  {
    id: 'side-control',
    name: 'Side Control',
    category: 'side-control',
    description: 'Top position controlling from the side',
    keyPoints: [POSE_LANDMARKS.leftShoulder, POSE_LANDMARKS.rightShoulder, POSE_LANDMARKS.leftHip, POSE_LANDMARKS.rightHip]
  },
  {
    id: 'back-control',
    name: 'Back Control',
    category: 'back-control',
    description: 'Controlling opponent from behind',
    keyPoints: [POSE_LANDMARKS.leftShoulder, POSE_LANDMARKS.rightShoulder, POSE_LANDMARKS.leftHip, POSE_LANDMARKS.rightHip]
  }
];

/**
 * Analyze pose for closed guard position
 */
function analyzeClosedGuard(landmarks: PoseLandmark[]): PoseAnalysis {
  const angles = getBodyAngles(landmarks);
  const feedback: string[] = [];
  let accuracy = 0;
  
  // Check if key landmarks are visible
  const requiredLandmarks = [
    POSE_LANDMARKS.leftHip,
    POSE_LANDMARKS.rightHip,
    POSE_LANDMARKS.leftKnee,
    POSE_LANDMARKS.rightKnee
  ];
  
  const visibleCount = requiredLandmarks.filter(idx => 
    landmarks[idx] && isLandmarkVisible(landmarks[idx])
  ).length;
  
  if (visibleCount < 3) {
    return {
      accuracy: 0,
      feedback: ['Unable to detect sufficient body landmarks. Ensure your full body is visible.'],
      keyAngles: {},
      isCorrectPosition: false
    };
  }

  // Analyze knee position for closed guard
  if (angles.leftKnee && angles.rightKnee) {
    const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;
    
    if (avgKneeAngle >= 60 && avgKneeAngle <= 120) {
      accuracy += 40;
      feedback.push('Good knee angle for closed guard');
    } else if (avgKneeAngle > 120) {
      feedback.push('Knees too wide - bring them closer together');
    } else {
      feedback.push('Knees too tight - open up slightly for better control');
    }
  }

  // Check hip position
  if (landmarks[POSE_LANDMARKS.leftHip] && landmarks[POSE_LANDMARKS.rightHip]) {
    const hipWidth = Math.abs(
      landmarks[POSE_LANDMARKS.leftHip].x - landmarks[POSE_LANDMARKS.rightHip].x
    );
    
    if (hipWidth > 0.1) {
      accuracy += 30;
      feedback.push('Good hip positioning');
    } else {
      feedback.push('Keep hips square and stable');
    }
  }

  // Check torso angle
  if (angles.torso !== null) {
    const torsoAngle = Math.abs(angles.torso);
    if (torsoAngle < 30) {
      accuracy += 30;
      feedback.push('Good torso alignment');
    } else {
      feedback.push('Keep torso more upright');
    }
  }

  return {
    accuracy,
    feedback,
    keyAngles: angles,
    isCorrectPosition: accuracy >= 70
  };
}

/**
 * Analyze pose for mount position
 */
function analyzeMount(landmarks: PoseLandmark[]): PoseAnalysis {
  const angles = getBodyAngles(landmarks);
  const feedback: string[] = [];
  let accuracy = 0;

  // Check knee angles for mount position
  if (angles.leftKnee && angles.rightKnee) {
    const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;
    
    if (avgKneeAngle >= 80 && avgKneeAngle <= 130) {
      accuracy += 35;
      feedback.push('Good knee positioning for mount');
    } else if (avgKneeAngle < 80) {
      feedback.push('Knees too tight - widen your base');
    } else {
      feedback.push('Knees too wide - narrow your base for better control');
    }
  }

  // Check hip position
  if (landmarks[POSE_LANDMARKS.leftHip] && landmarks[POSE_LANDMARKS.rightHip] &&
      landmarks[POSE_LANDMARKS.leftKnee] && landmarks[POSE_LANDMARKS.rightKnee]) {
    
    const hipY = (landmarks[POSE_LANDMARKS.leftHip].y + landmarks[POSE_LANDMARKS.rightHip].y) / 2;
    const kneeY = (landmarks[POSE_LANDMARKS.leftKnee].y + landmarks[POSE_LANDMARKS.rightKnee].y) / 2;
    
    if (hipY < kneeY) { // Hips should be higher than knees in mount
      accuracy += 35;
      feedback.push('Good hip elevation');
    } else {
      feedback.push('Lift your hips higher for better mount position');
    }
  }

  // Check posture
  if (angles.torso !== null) {
    const torsoAngle = Math.abs(angles.torso);
    if (torsoAngle < 20) {
      accuracy += 30;
      feedback.push('Excellent posture');
    } else if (torsoAngle < 45) {
      feedback.push('Good posture, but stay more upright');
    } else {
      feedback.push('Sit up straighter for better mount control');
    }
  }

  return {
    accuracy,
    feedback,
    keyAngles: angles,
    isCorrectPosition: accuracy >= 70
  };
}

/**
 * Analyze pose for side control
 */
function analyzeSideControl(landmarks: PoseLandmark[]): PoseAnalysis {
  const angles = getBodyAngles(landmarks);
  const feedback: string[] = [];
  let accuracy = 0;

  // Check shoulder positioning
  if (landmarks[POSE_LANDMARKS.leftShoulder] && landmarks[POSE_LANDMARKS.rightShoulder]) {
    const shoulderX = Math.abs(landmarks[POSE_LANDMARKS.leftShoulder].x - landmarks[POSE_LANDMARKS.rightShoulder].x);
    
    if (shoulderX > 0.2) {
      accuracy += 40;
      feedback.push('Good shoulder separation for side control');
    } else {
      feedback.push('Spread your shoulders wider for better control');
    }
  }

  // Check hip position
  if (angles.leftHip && angles.rightHip) {
    const avgHipAngle = (angles.leftHip + angles.rightHip) / 2;
    
    if (avgHipAngle >= 120 && avgHipAngle <= 170) {
      accuracy += 35;
      feedback.push('Good hip positioning');
    } else {
      feedback.push('Adjust hip angle for better pressure');
    }
  }

  // Check weight distribution
  if (angles.torso !== null) {
    const torsoAngle = Math.abs(angles.torso);
    if (torsoAngle >= 30 && torsoAngle <= 70) {
      accuracy += 25;
      feedback.push('Good weight distribution');
    } else {
      feedback.push('Lean more into the position for better control');
    }
  }

  return {
    accuracy,
    feedback,
    keyAngles: angles,
    isCorrectPosition: accuracy >= 70
  };
}

/**
 * Main pose analysis function
 */
export function analyzeBJJPose(landmarks: PoseLandmark[], positionId: string): PoseAnalysis {
  if (!landmarks || landmarks.length === 0) {
    return {
      accuracy: 0,
      feedback: ['No pose detected. Make sure you are visible to the camera.'],
      keyAngles: {},
      isCorrectPosition: false
    };
  }

  switch (positionId) {
    case 'closed-guard':
      return analyzeClosedGuard(landmarks);
    case 'mount':
      return analyzeMount(landmarks);
    case 'side-control':
      return analyzeSideControl(landmarks);
    case 'open-guard':
      return analyzeClosedGuard(landmarks); // Similar analysis for now
    case 'back-control':
      return analyzeSideControl(landmarks); // Similar analysis for now
    default:
      return {
        accuracy: 0,
        feedback: ['Unknown BJJ position selected.'],
        keyAngles: {},
        isCorrectPosition: false
      };
  }
}

/**
 * Get position by ID
 */
export function getPositionById(id: string): BJJPosition | undefined {
  return BJJ_POSITIONS.find(pos => pos.id === id);
}