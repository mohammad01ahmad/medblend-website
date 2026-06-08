import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type DnaParticlesProps = {
  embedded?: boolean;
  muted?: boolean;
};

export default function DnaParticles({ embedded = false, muted = false }: DnaParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const gasRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 10;

  const count = muted ? 6000 : embedded ? 14000 : 35000;
  const gasCount = muted ? 200 : embedded ? 500 : 1000;
  const radius = 2.5;
  const height = 45;
  const turns = 5;

  // --- CORE PARTICLES SETUP ---
  const { basePositions, colors, initialVelocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      const isStrand1 = i % 2 === 0;
      const isRung = Math.random() < 0.15;

      let x, z;
      const baseY = y;

      if (isRung) {
        const rungT = Math.random();
        const startX = Math.cos(angle) * radius;
        const startZ = Math.sin(angle) * radius;
        const endX = Math.cos(angle + Math.PI) * radius;
        const endZ = Math.sin(angle + Math.PI) * radius;

        x = startX + (endX - startX) * rungT;
        z = startZ + (endZ - startZ) * rungT;

        col[i * 3] = 0.08;
        col[i * 3 + 1] = 0.55 + Math.random() * 0.35;
        col[i * 3 + 2] = 0.35 + Math.random() * 0.25;
      } else {
        const phase = isStrand1 ? 0 : Math.PI;
        const scatter = (Math.random() - 0.5) * 0.4;

        x = Math.cos(angle + phase) * radius + scatter;
        z = Math.sin(angle + phase) * radius + scatter;

        col[i * 3] = 0.04;
        col[i * 3 + 1] = 0.72 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.42 + Math.random() * 0.15;
      }

      const type = Math.random();
      if (type < 0.8) pos[i * 3 + 1] = y;

      const curveX = 0
      const curveZ = 0
      pos[i * 3] = x + curveX;
      pos[i * 3 + 2] = z + curveZ;
      if (type >= 0.8) pos[i * 3 + 1] = y;

      vel[i * 3] = 0; vel[i * 3 + 1] = 0; vel[i * 3 + 2] = 0;
    }
    return { basePositions: pos, colors: col, initialVelocities: vel };
  }, [count, height, radius, turns, isMobile]);

  // --- GAS PARTICLES SETUP ---
  const { gasBasePositions, gasColors, gasInitialVelocities } = useMemo(() => {
    const pos = new Float32Array(gasCount * 3);
    const col = new Float32Array(gasCount * 3);
    const vel = new Float32Array(gasCount * 3);

    for (let i = 0; i < gasCount; i++) {
      const t = Math.random();
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      const noise = Math.random() * 0.4;
      const type = Math.random();

      const x = Math.cos(angle + (type > 0.5 ? Math.PI : 0)) * (radius + (Math.random() - 0.5) * noise);
      const z = Math.sin(angle + (type > 0.5 ? Math.PI : 0)) * (radius + (Math.random() - 0.5) * noise);

      const curveX = Math.sin(y * 0.08) * (isMobile ? 1.5 : 4.0);
      const curveZ = Math.cos(y * 0.08) * (isMobile ? 1.0 : 2.0);

      pos[i * 3] = x + curveX;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z + curveZ;

      col[i * 3] = 0.12;
      col[i * 3 + 1] = 0.45 + Math.random() * 0.25;
      col[i * 3 + 2] = 0.35 + Math.random() * 0.2;

      vel[i * 3] = 0; vel[i * 3 + 1] = 0; vel[i * 3 + 2] = 0;
    }
    return { gasBasePositions: pos, gasColors: col, gasInitialVelocities: vel };
  }, [gasCount, height, radius, turns, isMobile]);

  const currentPositions = useMemo(() => new Float32Array(basePositions), [basePositions]);
  const velocities = useMemo(() => new Float32Array(initialVelocities), [initialVelocities]);
  const gasCurrentPositions = useMemo(() => new Float32Array(gasBasePositions), [gasBasePositions]);
  const gasVelocities = useMemo(() => new Float32Array(gasInitialVelocities), [gasInitialVelocities]);

  // --- PHYSICS ENGINE ---
  useFrame((state) => {
    if (!pointsRef.current || !gasRef.current) return;
    const time = state.clock.getElapsedTime();

    const scrollOffset = embedded ? 0 : window.scrollY * 0.025;
    const targetY = embedded ? -2 : scrollOffset - 15;

    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.1;
    gasRef.current.position.y += (targetY - gasRef.current.position.y) * 0.1;

    // Gentle global rotation
    const rotX = Math.sin(time * 0.5) * 0.15;
    const rotY = time * 0.35;
    const rotZ = Math.cos(time * 0.3) * 0.08;

    pointsRef.current.rotation.set(rotX, rotY, rotZ);
    gasRef.current.rotation.set(rotX, rotY, rotZ);

    const processPhysics = (
      _count: number,
      _basePos: Float32Array,
      _currPos: Float32Array,
      _vel: Float32Array,
      _geometryRef: React.RefObject<THREE.Points | null>,
      isGas: boolean
    ) => {
      const positions = _geometryRef.current!.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < _count; i++) {
        const idx = i * 3;
        const bx = _basePos[idx];
        const by = _basePos[idx + 1];
        const bz = _basePos[idx + 2];

        const px = _currPos[idx];
        const py = _currPos[idx + 1];
        const pz = _currPos[idx + 2];

        const noiseAmplitude = isGas ? 0.15 : 0.02;
        const noiseFreq = isGas ? 2.0 : 5.0;
        const noiseX = Math.sin(time * noiseFreq + py) * noiseAmplitude;
        const noiseZ = Math.cos(time * noiseFreq + py) * noiseAmplitude;

        const targetVx = (bx + noiseX - px) * 0.15;
        const targetVy = (by - py) * 0.15;
        const targetVz = (bz + noiseZ - pz) * 0.15;

        _vel[idx] += (targetVx - _vel[idx]) * 0.02;
        _vel[idx + 1] += (targetVy - _vel[idx + 1]) * 0.02;
        _vel[idx + 2] += (targetVz - _vel[idx + 2]) * 0.02;

        const swirlX = Math.sin(py * 3.1 + time * 1.5) * 0.5 + Math.cos(pz * 2.1 - time * 1.1) * 0.5;
        const swirlY = Math.cos(px * 2.7 + time * 1.7) * 0.5 + Math.sin(pz * 3.5 + time * 1.2) * 0.5;
        const swirlZ = Math.sin(px * 4.2 - time * 1.3) * 0.5 + Math.cos(py * 1.9 + time * 1.4) * 0.5;

        const strength = isGas ? 0.01 : 0.00005;

        _vel[idx] += swirlX * strength;
        _vel[idx + 1] += swirlY * strength * 0.5;
        _vel[idx + 2] += swirlZ * strength;

        _vel[idx] *= 0.95;
        _vel[idx + 1] *= 0.95;
        _vel[idx + 2] *= 0.95;

        positions[idx] += _vel[idx];
        positions[idx + 1] += _vel[idx + 1];
        positions[idx + 2] += _vel[idx + 2];

        _currPos[idx] = positions[idx];
        _currPos[idx + 1] = positions[idx + 1];
        _currPos[idx + 2] = positions[idx + 2];
      }

      _geometryRef.current!.geometry.attributes.position.needsUpdate = true;
    };

    processPhysics(count, basePositions, currentPositions, velocities, pointsRef, false);
    processPhysics(gasCount, gasBasePositions, gasCurrentPositions, gasVelocities, gasRef, true);
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} args={[currentPositions, 3]} />
          <bufferAttribute attach="attributes-color" count={count} args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={muted ? 0.08 : embedded ? 0.09 : 0.12}
          vertexColors
          transparent
          opacity={muted ? 0.45 : embedded ? 0.75 : 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>



      <points ref={gasRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={gasCount} args={[gasCurrentPositions, 3]} />
          <bufferAttribute attach="attributes-color" count={gasCount} args={[gasColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={muted ? 0.22 : embedded ? 0.28 : 0.4}
          vertexColors
          transparent
          opacity={muted ? 0.06 : embedded ? 0.12 : 0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}
