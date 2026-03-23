"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

type Theme = 'light' | 'dark';

type SettingsState = {
  theme: Theme;
  showObjects: boolean;
  showFaces: boolean;
  showText: boolean;
  enableVoice: boolean;
  confidenceThreshold: number;
};

type SettingsAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_SHOW_OBJECTS'; payload: boolean }
  | { type: 'SET_SHOW_FACES'; payload: boolean }
  | { type: 'SET_SHOW_TEXT'; payload: boolean }
  | { type: 'SET_ENABLE_VOICE'; payload: boolean }
  | { type: 'SET_CONFIDENCE_THRESHOLD'; payload: number };

const initialState: SettingsState = {
  theme: 'dark',
  showObjects: true,
  showFaces: true,
  showText: false,
  enableVoice: false,
  confidenceThreshold: 40,
};

const SettingsContext = createContext<{
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
} | undefined>(undefined);

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_SHOW_OBJECTS':
      return { ...state, showObjects: action.payload };
    case 'SET_SHOW_FACES':
      return { ...state, showFaces: action.payload };
    case 'SET_SHOW_TEXT':
      return { ...state, showText: action.payload };
    case 'SET_ENABLE_VOICE':
      return { ...state, enableVoice: action.payload };
    case 'SET_CONFIDENCE_THRESHOLD':
        return { ...state, confidenceThreshold: action.payload };
    default:
      return state;
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
