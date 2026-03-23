"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Detections, DetectedObject, FaceBoundingBox } from '@/types';
import { useSettings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { Scan, Cpu, Bot, MessageSquareText } from 'lucide-react';

interface BoundingBoxProps {
  object: DetectedObject;
  videoRect: DOMRect | null;
}

function BoundingBox({ object, videoRect }: BoundingBoxProps) {
  if (!object.boundingBox || !videoRect) return null;

  const { x, y, width, height } = object.boundingBox;

  const scaleX = videoRect.width;
  const scaleY = videoRect.height;
  
  // Mirrored video requires flipping X coordinate
  const left = videoRect.left + (1 - (x + width)) * scaleX;
  const top = videoRect.top + y * scaleY;
  const boxWidth = width * scaleX;
  const boxHeight = height * scaleY;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="absolute border-2 border-accent rounded-md"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${boxWidth}px`,
        height: `${boxHeight}px`,
      }}
    >
      <div className="absolute -top-6 left-0 bg-accent/80 text-accent-foreground px-2 py-0.5 text-xs font-bold rounded-t-md">
        {object.label} ({(object.confidence).toFixed(0)}%)
      </div>
    </motion.div>
  );
}

interface FaceBoxProps {
    box: FaceBoundingBox;
    videoRect: DOMRect | null;
}

function FaceBox({ box, videoRect }: FaceBoxProps) {
    if (!videoRect) return null;

    const { x, y, width, height } = box;

    const scaleX = videoRect.width;
    const scaleY = videoRect.height;

    const left = videoRect.left + (1 - (x + width)) * scaleX;
    const top = videoRect.top + y * scaleY;
    const boxWidth = width * scaleX;
    const boxHeight = height * scaleY;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute border-2 border-primary rounded-full"
            style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${boxWidth}px`,
                height: `${boxHeight}px`,
            }}
        >
            <div className="absolute -top-6 left-0 bg-primary/80 text-primary-foreground px-2 py-0.5 text-xs font-bold rounded-t-md">
                Face {box.confidence !== undefined && `(${(box.confidence * 100).toFixed(0)}%)`}
            </div>
        </motion.div>
    );
}

interface HudOverlayProps {
  detections: Detections;
  isProcessing: boolean;
  videoRect: DOMRect | null;
  fps: number;
}

export function HudOverlay({ detections, isProcessing, videoRect, fps }: HudOverlayProps) {
  const { state } = useSettings();

  const visibleObjects = state.showObjects
    ? detections.objects.filter(obj => obj.confidence > state.confidenceThreshold)
    : [];
    
  const visibleFaces = state.showFaces 
    ? detections.faces.filter(face => (face.confidence ?? 1.0) * 100 > state.confidenceThreshold)
    : [];

  const visibleTexts = state.showText ? detections.texts : [];
    
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 hud-border" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 hud-border" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 hud-border" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 hud-border" />

      {/* Scanner Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute w-full h-1/2 bg-primary/20 top-0 animate-scanline glow-primary" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_100%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>

      {/* Detections */}
      <AnimatePresence>
        {visibleObjects.map((obj, i) => (
          <BoundingBox key={`obj-${obj.label}-${i}`} object={obj} videoRect={videoRect} />
        ))}
        {visibleFaces.map((face, i) => (
            <FaceBox key={`face-${i}`} box={face} videoRect={videoRect} />
        ))}
      </AnimatePresence>

      {/* Recognized Text */}
      {visibleTexts.length > 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 flex flex-wrap justify-center items-center gap-2">
            {visibleTexts.map((text, i) => (
                <motion.div
                    key={`text-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="glassmorphism p-2 px-3 rounded-md text-primary-foreground text-sm font-semibold"
                >
                    {text}
                </motion.div>
            ))}
        </div>
      )}


      {/* Status Panel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glassmorphism p-2 rounded-lg flex items-center space-x-4 text-xs font-mono">
        <div className={cn("flex items-center space-x-2", isProcessing ? "text-accent" : "text-primary-foreground/70")}>
            <Scan className={cn("w-4 h-4", isProcessing && "animate-pulse")} />
            <span>STATUS: {isProcessing ? "ANALYZING" : "IDLE"}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center space-x-2 text-primary-foreground/70">
            <Cpu className="w-4 h-4" />
            <span>FPS: {fps.toFixed(1)}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center space-x-2 text-primary-foreground/70">
            <Bot className="w-4 h-4" />
            <span>OBJ: {visibleObjects.length + visibleFaces.length}</span>
        </div>
        {visibleTexts.length > 0 && <>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center space-x-2 text-primary-foreground/70">
                <MessageSquareText className="w-4 h-4" />
                <span>TXT: {visibleTexts.length}</span>
            </div>
        </>}
      </div>
    </div>
  );
}
