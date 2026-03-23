"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

import { detectObjects } from '@/ai/flows/object-detection-flow';
import { detectFaces } from '@/ai/flows/face-detection-flow';
import { recognizeTextOCR } from '@/ai/flows/ocr-recognition-flow';
import { Detections } from '@/types';
import { useSpeech } from '@/hooks/use-speech';
import { SettingsProvider, useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { CameraFeed } from '@/components/camera-feed';
import { HudOverlay } from '@/components/hud-overlay';
import { SettingsPanel } from '@/components/settings-panel';
import { HelloFounderLogo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

const MainApp = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detections, setDetections] = useState<Detections>({ objects: [], faces: [], texts: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [videoRect, setVideoRect] = useState<DOMRect | null>(null);

  const [fps, setFps] = useState(0);
  const fpsRef = useRef<{ frameCount: number, lastTime: number }>({ frameCount: 0, lastTime: performance.now() });

  const { state } = useSettings();
  const { speak } = useSpeech();
  const announcedObjects = useRef(new Set<string>());
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setVideoRect(videoRef.current.getBoundingClientRect());
      }
      const now = performance.now();
      const Fps = (fpsRef.current.frameCount / (now - fpsRef.current.lastTime)) * 1000;
      setFps(Fps);
      fpsRef.current = { frameCount: 0, lastTime: now };
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFrame = useCallback(async (dataUri: string) => {
    fpsRef.current.frameCount++;
    if (isProcessing) return;
    if (!state.showObjects && !state.showFaces && !state.showText) {
        setDetections({ objects: [], faces: [], texts: [] });
        return;
    }

    setIsProcessing(true);
    try {
      const objectPromise = state.showObjects 
        ? detectObjects({ photoDataUri: dataUri }) 
        : Promise.resolve({ detections: [] });

      const facePromise = state.showFaces 
        ? detectFaces({ photoDataUri: dataUri }) 
        : Promise.resolve({ facesDetected: false, boundingBoxes: [] });

      const textPromise = state.showText 
        ? recognizeTextOCR({ imageDataUri: dataUri }) 
        : Promise.resolve({ recognizedTexts: [] });

      const [objectResult, faceResult, textResult] = await Promise.all([
        objectPromise,
        facePromise,
        textPromise,
      ]);
      
      const newDetections: Detections = {
        objects: objectResult.detections || [],
        faces: faceResult.boundingBoxes || [],
        texts: textResult.recognizedTexts || []
      };

      setDetections(newDetections);
      
      if (state.enableVoice) {
        const newObjects = newDetections.objects.filter(
          (obj) => obj.confidence > state.confidenceThreshold && !announcedObjects.current.has(obj.label)
        );
        if (newObjects.length > 0) {
          const objectToAnnounce = newObjects[0];
          speak(`${objectToAnnounce.label} detected.`);
          announcedObjects.current.add(objectToAnnounce.label);
          // Reset announced objects after a delay to allow re-announcement
          setTimeout(() => announcedObjects.current.delete(objectToAnnounce.label), 5000);
        }
      }

    } catch (error) {
      console.error("AI processing error:", error);
      toast({
        title: "AI Processing Error",
        description: "Could not analyze the camera feed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, state.showObjects, state.showFaces, state.showText, state.enableVoice, state.confidenceThreshold, speak, toast]);

  return (
    <main className="w-full h-screen overflow-hidden bg-black relative">
      <CameraFeed onFrame={handleFrame} isProcessing={isProcessing} videoRef={videoRef} />
      <HudOverlay detections={detections} isProcessing={isProcessing} videoRect={videoRect} fps={fps} />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-20 glassmorphism hover:bg-primary/20"
        onClick={() => setIsSettingsOpen(true)}
      >
        <Settings className="w-5 h-5 text-primary-foreground glow-primary" />
      </Button>
      <SettingsPanel isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </main>
  );
};


const SplashScreen = () => (
    <div className="w-full h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <HelloFounderLogo className="w-96 h-auto animate-boot-up" />
        </motion.div>
    </div>
);


export default function ClientPage() {
    const [isBooting, setIsBooting] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsBooting(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SettingsProvider>
            <AnimatePresence mode="wait">
                {isBooting ? (
                    <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                        <SplashScreen />
                    </motion.div>
                ) : (
                    <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <MainApp />
                    </motion.div>
                )}
            </AnimatePresence>
        </SettingsProvider>
    );
}
