import React from 'react';
import { Info } from 'lucide-react';

const Instructions: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="flex items-start">
        <Info className="text-blue-500 mr-2 flex-shrink-0 mt-1" size={20} />
        <div>
          <h3 className="font-semibold text-blue-800 mb-2">How to use this sign language detector:</h3>
          <ol className="text-blue-700 space-y-2 list-decimal list-inside">
            <li>Upload an image of a sign language gesture or use your camera to capture one</li>
            <li>The AI model will process the image</li>
            <li>The detected sign will be displayed with its letter/symbol</li>
            <li>The model can recognize A-Z letters, space, delete, and nothing</li>
          </ol>
          <p className="mt-2 text-sm text-blue-600">
            For best results, ensure good lighting and a clear view of the hand gesture against a plain background.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;