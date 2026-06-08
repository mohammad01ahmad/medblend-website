'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import DnaParticles from './DnaParticles';

type DnaCanvasProps = {
  className?: string;
  /** Tuned for smaller containers (e.g. LandingHero purple card) */
  embedded?: boolean;
  /** Subtle background use (e.g. footer) — fewer particles, softer motion */
  muted?: boolean;
};

export default function DnaCanvas({ className, embedded = false, muted = false }: DnaCanvasProps) {
  const compact = embedded || muted;

  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{
          position: muted ? [1.4, 0, 6.5] : compact ? [1.2, 0, 5.5] : [2, 0, 8],
          fov: compact ? 52 : 45,
        }}
        gl={{ alpha: true, antialias: false }}
        style={{ width: '100%', height: '100%' }}
        dpr={muted ? [1, 1] : compact ? [1, 1.25] : [1, 1.5]}
      >
        <Float
          speed={muted ? 0.9 : compact ? 1.2 : 1.5}
          rotationIntensity={0}
          floatIntensity={muted ? 0.4 : compact ? 0.8 : 1.5}
          floatingRange={muted ? [-0.15, 0.15] : compact ? [-0.25, 0.25] : [-0.5, 0.5]}
        >
          <group
            scale={muted ? 0.7 : compact ? 0.55 : 1}
            position={compact ? [0.8, 0, 0] : [0, 0, 0]}
          >
            <DnaParticles embedded={compact} muted={muted} />
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
