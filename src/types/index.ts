export interface PredictionResult {
  label: string;
  confidence: number;
  index: number;
}

export interface ModelStatus {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}