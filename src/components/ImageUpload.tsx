import React, { useRef, useEffect, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Hands } from '@mediapipe/hands';

interface ImageUploadProps {
  onProcess: (landmarks: any) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onProcess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const cameraRef = useRef<{ stop: () => void } | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(async (results) => {
      if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0
      ) {
        drawLandmarks(results.multiHandLandmarks[0]);

        if (!isProcessingRef.current) {
          isProcessingRef.current = true;
          await onProcess(results.multiHandLandmarks[0]);
          setTimeout(() => {
            isProcessingRef.current = false;
          }, 1000);
        }
      } else {
        console.warn("❌ No hand landmarks detected");
      }
    });

    handsRef.current = hands;

    if (videoRef.current && isCameraOn) {
      const video = videoRef.current;
      video.width = 640;
      video.height = 480;

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();

        const interval = setInterval(async () => {
          if (handsRef.current && video.readyState === 4) {
            try {
              await handsRef.current.send({ image: video });
            } catch (err) {
              console.error("❌ Error while processing video frame:", err);
            }
          }
        }, 1000); // 1 frame per second

        cameraRef.current = { stop: () => clearInterval(interval) };
      });
    }

    return () => {
      cameraRef.current?.stop();
    };
  }, [onProcess, isCameraOn]);

  const drawLandmarks = (landmarks: any[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const video = videoRef.current;
    if (ctx && canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'lime';
      for (const lm of landmarks) {
        ctx.beginPath();
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !handsRef.current) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        await handsRef.current!.send({ image: img });
      } catch (error) {
        console.error("❌ MediaPipe send failed:", error);
      }
    };

    img.onerror = () => {
      console.error("❌ Image failed to load or is not valid");
    };
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <div className="relative w-full">
        {isCameraOn ? (
          <video ref={videoRef} className="rounded shadow w-full" autoPlay muted />
        ) : (
          <div className="rounded shadow w-full aspect-video bg-gray-100 flex items-center justify-center text-sm text-gray-500">
            Image preview area
          </div>
        )}
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
      </div>

      <div className="flex gap-4 mt-2">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setIsCameraOn(true)}
        >
          <Camera className="w-5 h-5" />
          Use Webcam
        </button>
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow"
          onClick={() => {
            setIsCameraOn(false);
            fileInputRef.current?.click();
          }}
        >
          <Upload className="w-5 h-5" />
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;