'use client';

import { useState } from 'react';
import Link from 'next/link';
import PoseDetection from '@/components/PoseDetection';
import PositionSelector from '@/components/PositionSelector';
import { PoseAnalysis } from '@/types/pose';

export default function DrillPage() {
  const [selectedPosition, setSelectedPosition] = useState<string>('side-control');
  const [currentAnalysis, setCurrentAnalysis] = useState<PoseAnalysis | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleAnalysisUpdate = (analysis: PoseAnalysis) => {
    setCurrentAnalysis(analysis);
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
    setIsPaused(false);
  };

  const handlePauseSession = () => {
    setIsPaused(!isPaused);
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">
                JIU-JITSU TRAINING
              </h1>
              
              <nav className="flex space-x-6">
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/drill" 
                  className="text-white border-b-2 border-blue-500 px-3 py-2 text-sm font-medium"
                >
                  Drill
                </Link>
                <button className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Profile
                </button>
              </nav>
            </div>
            
            <button className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {!isSessionActive ? (
        /* Position Selection Screen */
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Select Position to Practice</h2>
              <p className="text-gray-400">Choose a BJJ position to start your drill session</p>
            </div>
            
            <PositionSelector
              selectedPosition={selectedPosition}
              onPositionChange={setSelectedPosition}
              darkTheme={true}
            />
            
            <div className="mt-8 text-center">
              <button
                onClick={handleStartSession}
                disabled={!selectedPosition}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                Start Drill Session
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Screen Drill View */
        <div className="relative h-[calc(100vh-4rem)]">
          {/* Camera Container */}
          <div className="absolute inset-0">
            <PoseDetection
              selectedPosition={selectedPosition}
              onAnalysisUpdate={handleAnalysisUpdate}
              fullScreen={true}
              darkTheme={true}
              isPaused={isPaused}
            />
          </div>

          {/* Position Display */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-black bg-opacity-80 rounded-lg px-6 py-4 text-center">
              <p className="text-gray-400 text-sm mb-1">You&apos;re in</p>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                {selectedPosition.replace('-', ' ')}
              </h2>
            </div>
          </div>

          {/* Feedback Display */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
            {currentAnalysis && (
              <div className="bg-yellow-600 bg-opacity-90 rounded-lg px-6 py-3">
                <p className="text-black font-semibold text-center">
                  {currentAnalysis.feedback}
                </p>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex space-x-4">
              <button
                onClick={handlePauseSession}
                className="px-6 py-3 bg-gray-700 bg-opacity-90 text-white rounded-lg hover:bg-gray-600 font-semibold min-w-[120px]"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              
              <button
                onClick={handleEndSession}
                className="px-6 py-3 bg-red-600 bg-opacity-90 text-white rounded-lg hover:bg-red-700 font-semibold min-w-[120px]"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}