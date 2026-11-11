'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { LivingObjectId } from './types';
import { LIVING_OBJECTS } from './data';

interface LivingWorldContextType {
  activeObjectId: LivingObjectId | null;
  currentStage: 1 | 2 | 3;
  isInteracting: boolean;
  discoveredObjects: string[];
  isDiscoveryModalOpen: boolean;
  isAudioPlaying: boolean;
  isMuted: boolean;
  selectObject: (id: LivingObjectId) => void;
  skipToExperience: () => void;
  closeInteraction: () => void;
  toggleAudio: () => void;
  toggleMute: () => void;
  openDiscoveryModal: () => void;
  closeDiscoveryModal: () => void;
  navigateToSection: (sectionId: string) => void;
}

const LivingWorldContext = createContext<LivingWorldContextType | null>(null);

export function LivingWorldProvider({ children }: { children: React.ReactNode }) {
  const [activeObjectId, setActiveObjectId] = useState<LivingObjectId | null>(null);
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [isInteracting, setIsInteracting] = useState(false);
  const [discoveredObjects, setDiscoveredObjects] = useState<string[]>([]);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const stageTimerRef = useRef<NodeJS.Timeout[]>([]);

  // Load persisted discoveries
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('synora_discovered_3d');
      if (stored) {
        setDiscoveredObjects(JSON.parse(stored));
      }
    } catch {
      // Ignore sessionStorage restrictions
    }
  }, []);

  const clearTimers = useCallback(() => {
    stageTimerRef.current.forEach((t) => clearTimeout(t));
    stageTimerRef.current = [];
  }, []);

  // Stop any active Web Speech when closing
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAudioPlaying(false);
  }, []);

  const closeInteraction = useCallback(() => {
    clearTimers();
    stopAudio();
    setActiveObjectId(null);
    setIsInteracting(false);
    setCurrentStage(1);
  }, [clearTimers, stopAudio]);

  const selectObject = useCallback(
    (id: LivingObjectId) => {
      clearTimers();
      stopAudio();
      setActiveObjectId(id);
      setIsInteracting(true);
      setCurrentStage(1);

      // Record discovery
      setDiscoveredObjects((prev) => {
        if (!prev.includes(id)) {
          const next = [...prev, id];
          try {
            sessionStorage.setItem('synora_discovered_3d', JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        }
        return prev;
      });

      // Stage 1 -> 2 after 1000ms
      const t1 = setTimeout(() => {
        setCurrentStage(2);
      }, 1000);

      // Stage 2 -> 3 after 3200ms
      const t2 = setTimeout(() => {
        setCurrentStage(3);
      }, 3200);

      stageTimerRef.current = [t1, t2];
    },
    [clearTimers, stopAudio]
  );

  const skipToExperience = useCallback(() => {
    clearTimers();
    setCurrentStage(3);
  }, [clearTimers]);

  const toggleAudio = useCallback(() => {
    if (!activeObjectId || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const meta = LIVING_OBJECTS[activeObjectId];
      if (!meta) return;

      const utterance = new SpeechSynthesisUtterance(meta.narrationText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select gentle natural voice if present
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.name.includes('Natural') || v.name.includes('Serena') || v.lang.startsWith('en')
      );
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsAudioPlaying(true);
    }
  }, [activeObjectId, isAudioPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev && isAudioPlaying) {
        stopAudio();
      }
      return !prev;
    });
  }, [isAudioPlaying, stopAudio]);

  const openDiscoveryModal = useCallback(() => setIsDiscoveryModalOpen(true), []);
  const closeDiscoveryModal = useCallback(() => setIsDiscoveryModalOpen(false), []);

  const navigateToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      stopAudio();
    };
  }, [clearTimers, stopAudio]);

  return (
    <LivingWorldContext.Provider
      value={{
        activeObjectId,
        currentStage,
        isInteracting,
        discoveredObjects,
        isDiscoveryModalOpen,
        isAudioPlaying,
        isMuted,
        selectObject,
        skipToExperience,
        closeInteraction,
        toggleAudio,
        toggleMute,
        openDiscoveryModal,
        closeDiscoveryModal,
        navigateToSection,
      }}
    >
      {children}
    </LivingWorldContext.Provider>
  );
}

export function useLivingWorld() {
  const context = useContext(LivingWorldContext);
  if (!context) {
    throw new Error('useLivingWorld must be used within a LivingWorldProvider');
  }
  return context;
}
