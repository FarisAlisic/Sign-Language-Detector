import * as tf from '@tensorflow/tfjs';
import { SIGN_LABELS } from '../utils/constants';
import { PredictionResult } from '../types';

let model: tf.LayersModel | null = null;
let hands: any = null;

export async function loadModel(): Promise<tf.LayersModel> {
  if (model) return model;
  
  try {
    // Load TensorFlow.js model
    model = await tf.loadLayersModel('/model.json');
    
    // Initialize MediaPipe Hands
    const { Hands } = await import('@mediapipe/hands');
    hands = new Hands({
      locateFile: (file: string) => {
        if (file.endsWith('wasm')) {
          return `/node_modules/@mediapipe/hands/${file}`;
        }
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
      }
    });

    await hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    return model;
  } catch (error) {
    console.error("Failed to load model or MediaPipe Hands:", error);
    throw error;
  }
}

export function processLandmarks(landmarks: any): number[] | null {
  if (!landmarks || landmarks.length !== 21) return null;

  const flat: number[] = [];
  for (const lm of landmarks) {
    flat.push(lm.x, lm.y, lm.z);
  }

  return flat;
}

export async function predictSign(landmarks: any): Promise<string | null> {
  const input = processLandmarks(landmarks);
  if (!input || !model) return null;

  const tensor = tf.tensor2d([input], [1, 63]);
  const prediction = model.predict(tensor) as tf.Tensor;
  const predictionArray = await prediction.array();
  const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

  return SIGN_LABELS[predictedIndex] || null;
}