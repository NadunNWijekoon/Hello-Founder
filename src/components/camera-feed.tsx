"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraFeedProps {
  onFrame: (dataUri: string) => void;
  isProcessing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function CameraFeed({ onFrame, isProcessing, videoRef }: CameraFeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const animationFrameId = useRef<number>();

  const processFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current && !isProcessing && videoRef.current.readyState >= 2) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg', 0.5);
        onFrame(dataUri);
      }
    }
    animationFrameId.current = requestAnimationFrame(processFrame);
  }, [isProcessing, onFrame, videoRef]);

  const startCamera = useCallback(async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
        };
      }
      animationFrameId.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('Error accessing camera:', err);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
            setPermissionError('No camera found. Please ensure a camera is connected and available.');
        } else {
            setPermissionError('Could not access the camera. Please check your device and browser settings.');
        }
      } else {
        setPermissionError('An unknown error occurred while accessing the camera.');
      }
    }
  }, [processFrame, videoRef]);


  useEffect(() => {
    startCamera();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera, videoRef]);

  if (permissionError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-4 z-10">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Camera Access Error</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-md">{permissionError}</p>
        <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas ref={canvasRef} className="hidden" />
      {!isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center">
                <Camera className="w-16 h-16 text-primary animate-pulse" />
                <p className="mt-4 text-lg text-primary-foreground">Initializing camera...</p>
            </div>
        </div>
      )}
    </>
  );
}
