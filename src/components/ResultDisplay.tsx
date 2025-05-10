import React from 'react';
import { PredictionResult } from '../types';

interface ResultDisplayProps {
  result: PredictionResult | null;
  isProcessing: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isProcessing }) => {
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
        <div className="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
        <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">No result yet</p>
        <p className="text-sm text-gray-400">Upload or capture an image to detect sign language</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="text-center">
        <div className="mb-2">
          <span className="text-4xl font-bold inline-block bg-purple-100 text-purple-800 rounded-full w-16 h-16 flex items-center justify-center">
            {result.label === 'space' ? '⎵' : 
             result.label === 'delete' ? '⌫' : 
             result.label === 'nothing' ? '∅' : 
             result.label}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-1">
          {result.label}
        </h3>
        <p className="text-sm text-gray-600">
          Confidence: {(result.confidence * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;