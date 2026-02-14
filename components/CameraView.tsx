
import React, { useRef, useEffect, useState } from 'react';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الأذونات اللازمة.");
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-600">
        {error ? (
          <div className="flex items-center justify-center h-full text-white p-4 text-center">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-full bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition"
        >
          إلغاء
        </button>
        <button
          disabled={!!error}
          onClick={handleCapture}
          className="px-8 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-lg disabled:opacity-50"
        >
          التقاط الصورة ✨
        </button>
      </div>
    </div>
  );
};
