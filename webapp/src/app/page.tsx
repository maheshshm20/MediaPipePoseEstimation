'use client';

import { useState } from 'react';
import Link from 'next/link';
import PoseDetection from '@/components/PoseDetection';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import PositionSelector from '@/components/PositionSelector';
import { PoseAnalysis } from '@/types/pose';

export default function Home() {
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<PoseAnalysis | null>(null);

  const handleAnalysisUpdate = (analysis: PoseAnalysis) => {
    setCurrentAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                BJJ Pose Trainer
              </h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                MVP
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/drill"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Drill
              </Link>
              
              <div className="text-sm text-gray-600">
                Real-time pose analysis powered by MediaPipe
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Position Selection */}
          <div className="lg:col-span-1">
            <PositionSelector
              selectedPosition={selectedPosition}
              onPositionChange={setSelectedPosition}
            />
          </div>

          {/* Middle Column - Pose Detection */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Live Pose Detection
              </h2>
              
              {selectedPosition ? (
                <PoseDetection
                  selectedPosition={selectedPosition}
                  onAnalysisUpdate={handleAnalysisUpdate}
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-600 text-sm">
                      Select a BJJ position to start
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Feedback */}
          <div className="lg:col-span-1">
            <FeedbackDisplay analysis={currentAnalysis} />
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-12 bg-white p-8 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            How to Use BJJ Pose Trainer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Select Position</h3>
              <p className="text-sm text-gray-600">
                Choose a BJJ position you want to practice from the left panel
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Start Camera</h3>
              <p className="text-sm text-gray-600">
                Click &quot;Start Camera&quot; and allow camera permissions when prompted
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Get Feedback</h3>
              <p className="text-sm text-gray-600">
                Follow the real-time feedback to improve your technique
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li className="flex items-start">
              <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Ensure good lighting and a clear background
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Position yourself so your full body is visible
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Use a modern browser with camera support
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Hold positions steady for more accurate feedback
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            BJJ Pose Trainer MVP - Powered by MediaPipe and Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
