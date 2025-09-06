'use client';

import { BJJ_POSITIONS } from '@/lib/bjjAnalysis';

interface PositionSelectorProps {
  selectedPosition: string;
  onPositionChange: (positionId: string) => void;
}

export default function PositionSelector({ selectedPosition, onPositionChange }: PositionSelectorProps) {
  const categories = ['guard', 'mount', 'side-control', 'back-control', 'submission'] as const;
  
  const getPositionsByCategory = (category: string) => {
    return BJJ_POSITIONS.filter(pos => pos.category === category);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'guard': 'bg-blue-100 text-blue-800 border-blue-200',
      'mount': 'bg-green-100 text-green-800 border-green-200',
      'side-control': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'back-control': 'bg-purple-100 text-purple-800 border-purple-200',
      'submission': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select BJJ Position</h3>
      
      <div className="space-y-4">
        {categories.map(category => {
          const positions = getPositionsByCategory(category);
          
          if (positions.length === 0) return null;
          
          return (
            <div key={category} className="space-y-2">
              <h4 className={`text-sm font-medium px-2 py-1 rounded capitalize inline-block ${getCategoryColor(category)}`}>
                {category.replace('-', ' ')}
              </h4>
              
              <div className="grid gap-2">
                {positions.map(position => (
                  <button
                    key={position.id}
                    onClick={() => onPositionChange(position.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedPosition === position.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 mb-1">
                          {position.name}
                        </h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {position.description}
                        </p>
                      </div>
                      
                      {selectedPosition === position.id && (
                        <div className="ml-3 flex-shrink-0">
                          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {!selectedPosition && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-blue-700">
              Select a BJJ position to start training
            </p>
          </div>
        </div>
      )}
    </div>
  );
}