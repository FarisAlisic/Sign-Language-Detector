import React, { useEffect, useState } from 'react';
import { loadModel } from '../services/modelService';
import { ModelStatus } from '../types';

interface ModelLoaderProps {
  onModelStatusChange: (status: ModelStatus) => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ onModelStatusChange }) => {
  const [status, setStatus] = useState<ModelStatus>({
    loaded: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const initModel = async () => {
      try {
        setStatus({ loaded: false, loading: true, error: null });
        await loadModel();
        setStatus({ loaded: true, loading: false, error: null });
      } catch (error) {
        console.error('Error loading model:', error);
        setStatus({ 
          loaded: false, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error loading model'
        });
      }
    };

    initModel();
  }, []);

  useEffect(() => {
    onModelStatusChange(status);
  }, [status, onModelStatusChange]);

  if (status.error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
        <p className="font-bold">Error loading model</p>
        <p>{status.error}</p>
        <p className="mt-2 text-sm">
          Please ensure the model files (model.json and .bin) are in the public folder.
        </p>
      </div>
    );
  }

  if (status.loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-50 rounded mb-4">
        <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Loading TensorFlow model...</span>
      </div>
    );
  }

  if (status.loaded) {
    return (
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4">
        <p className="font-bold">Model loaded successfully</p>
        <p>The sign language detection model is ready to use.</p>
      </div>
    );
  }

  return null;
};

export default ModelLoader;