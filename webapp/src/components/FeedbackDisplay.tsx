'use client';

import { PoseAnalysis } from '@/types/pose';

interface FeedbackDisplayProps {
  analysis: PoseAnalysis | null;
}

export default function FeedbackDisplay({ analysis }: FeedbackDisplayProps) {
  if (!analysis) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pose Analysis</h3>
        <p className="text-gray-600">Start pose detection to see feedback</p>
      </div>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    if (accuracy >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-100 border-green-200';
    if (accuracy >= 60) return 'bg-yellow-100 border-yellow-200';
    if (accuracy >= 40) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Accuracy Score */}
      <div className={`p-6 rounded-lg border-2 ${getAccuracyBgColor(analysis.accuracy)}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Pose Accuracy</h3>
          <div className={`text-3xl font-bold ${getAccuracyColor(analysis.accuracy)}`}>
            {Math.round(analysis.accuracy)}%
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              analysis.accuracy >= 80 ? 'bg-green-600' :
              analysis.accuracy >= 60 ? 'bg-yellow-600' :
              analysis.accuracy >= 40 ? 'bg-orange-600' : 'bg-red-600'
            }`}
            style={{ width: `${Math.max(analysis.accuracy, 5)}%` }}
          ></div>
        </div>
        
        <div className="mt-2 flex items-center justify-center">
          {analysis.isCorrectPosition ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Correct Position
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Needs Adjustment
            </span>
          )}
        </div>
      </div>

      {/* Feedback Messages */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-time Feedback</h3>
        
        {analysis.feedback.length > 0 ? (
          <div className="space-y-2">
            {analysis.feedback.map((message, index) => (
              <div key={index} className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm text-gray-700">{message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No feedback available</p>
        )}
      </div>

      {/* Key Angles */}
      {Object.keys(analysis.keyAngles).length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Body Angles</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analysis.keyAngles)
              .filter(([, value]) => value !== null)
              .map(([key, value]) => (
                <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {typeof value === 'number' ? Math.round(value) : '—'}°
                  </div>
                  <div className="text-xs text-gray-600 mt-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}