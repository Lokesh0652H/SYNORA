'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LivingWorldProvider } from './LivingWorldContext';
import FloatingExperiencePanel from './FloatingExperiencePanel';
import DiscoveryTrackerPill from './DiscoveryTrackerPill';

// Lazy-load the Three.js canvas on the client to ensure zero SSR overhead and optimal hydration
const LivingWorldCanvas = dynamic(() => import('./LivingWorldCanvas'), {
  ssr: false,
});

export default function Living3DEcosystem() {
  return (
    <LivingWorldProvider>
      <LivingWorldCanvas />
      <FloatingExperiencePanel />
      <DiscoveryTrackerPill />
    </LivingWorldProvider>
  );
}

export { useLivingWorld } from './LivingWorldContext';
