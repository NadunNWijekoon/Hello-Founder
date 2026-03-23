"use client";

import { useSettings } from '@/contexts/settings-context';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SettingsPanel({ isOpen, onOpenChange }: SettingsPanelProps) {
  const { state, dispatch } = useSettings();

  const handleThemeToggle = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="glassmorphism">
        <SheetHeader>
          <SheetTitle>System Settings</SheetTitle>
          <SheetDescription>
            Configure the real-time analysis and display parameters.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-mode">Theme</Label>
            <Button onClick={handleThemeToggle} variant="outline" size="icon">
                {state.theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-objects">Show Object Detections</Label>
            <Switch
              id="show-objects"
              checked={state.showObjects}
              onCheckedChange={(checked) => dispatch({ type: 'SET_SHOW_OBJECTS', payload: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-faces">Show Face Detections</Label>
            <Switch
              id="show-faces"
              checked={state.showFaces}
              onCheckedChange={(checked) => dispatch({ type: 'SET_SHOW_FACES', payload: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-text">Show Text (OCR)</Label>
            <Switch
              id="show-text"
              checked={state.showText}
              onCheckedChange={(checked) => dispatch({ type: 'SET_SHOW_TEXT', payload: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-voice">Voice Feedback</Label>
            <Switch
              id="enable-voice"
              checked={state.enableVoice}
              onCheckedChange={(checked) => dispatch({ type: 'SET_ENABLE_VOICE', payload: checked })}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="confidence-threshold">Confidence Threshold ({state.confidenceThreshold}%)</Label>
            <Slider
              id="confidence-threshold"
              min={0}
              max={100}
              step={5}
              value={[state.confidenceThreshold]}
              onValueChange={(value) => dispatch({ type: 'SET_CONFIDENCE_THRESHOLD', payload: value[0] })}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
