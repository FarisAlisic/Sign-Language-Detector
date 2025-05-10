import React, { useState, useCallback } from 'react';
import { Fingerprint } from 'lucide-react';

import Instructions from './components/Instructions';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import ModelLoader from './components/ModelLoader';

import { predictSign } from './services/modelService';
import { PredictionResult, ModelStatus } from './types';

function App() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus>({
    loaded: false,
    loading: true,
    error: null
  });

  const handleModelStatusChange = useCallback((status: ModelStatus) => {
    setModelStatus(status);
  }, []);

  // 🔁 Called when landmark data is ready (from ImageUpload or webcam)
  const handleLandmarkInput = async (landmarks: any) => {
    if (!modelStatus.loaded) return;
    setIsProcessing(true);

    try {
      const label = await predictSign(landmarks);
      if (label) {
        setResult({ label, confidence: 1.0 });
      } else {
        setResult({ label: 'No prediction', confidence: 0 });
      }
    } catch (error) {
      console.error("Prediction failed:", error);
      setResult({ label: 'Error', confidence: 0 });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
        <Fingerprint className="w-10 h-10 text-blue-500" />
        Sign Language Detector
      </h1>

      <ModelLoader onModelStatusChange={handleModelStatusChange} />
      <Instructions />
      <ImageUpload onProcess={handleLandmarkInput} />
      <ResultDisplay result={result} loading={isProcessing} />
    </div>
  );
}

export default App;