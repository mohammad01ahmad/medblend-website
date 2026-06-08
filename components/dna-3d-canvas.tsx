import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const createGasTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
};

const createCircleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (context) {
    context.beginPath();
    context.arc(16, 16, 16, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
  }
  return new THREE.CanvasTexture(canvas);
};

const DnaParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const gasRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  const isMobile = viewport.width < 10;

  const count = 75000;
  const gasCount = 6000;
  const radius = 2.5;

  const gasTexture = useMemo(() => createGasTexture(), []);
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const { basePositions, colors, initialVelocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    const color1 = new THREE.Color('#2DD4BF');
    const color2 = new THREE.Color('#38BDF8');
    const color3 = new THREE.Color('#1E40AF');

    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      const t = Math.random();
      const angle = t * Math.PI * 2 * 12;
      const baseY = (t - 0.5) * 80;

      let px, pz, py;
      const tempColor = new THREE.Color();

      if (typeRand < 0.4) {
        const spread = Math.random() * 1.2;
        px = Math.cos(angle) * (radius + (Math.random() - 0.5) * spread);
        pz = Math.sin(angle) * (radius + (Math.random() - 0.5) * spread);
        tempColor.copy(color1);
        py = baseY;
      } else if (typeRand < 0.8) {
        const spread = Math.random() * 1.2;
        px = Math.cos(angle + Math.PI) * (radius + (Math.random() - 0.5) * spread);
        pz = Math.sin(angle + Math.PI) * (radius + (Math.random() - 0.5) * spread);
        tempColor.copy(color2);
        py = baseY;
      } else {
        const step = Math.floor(t * 40) / 40;
        const stepAngle = step * Math.PI * 2 * 12;
        const stepY = (step - 0.5) * 80;

        const mix = Math.random();
        const startX = Math.cos(stepAngle) * radius;
        const startZ = Math.sin(stepAngle) * radius;
        const endX = Math.cos(stepAngle + Math.PI) * radius;
        const endZ = Math.sin(stepAngle + Math.PI) * radius;

        const noise = 0.6;
        px = THREE.MathUtils.lerp(startX, endX, mix) + (Math.random() - 0.5) * noise;
        const myY = stepY + (Math.random() - 0.5) * noise;
        pz = THREE.MathUtils.lerp(startZ, endZ, mix) + (Math.random() - 0.5) * noise;

        tempColor.copy(Math.random() > 0.5 ? color3 : color1);
        py = stepY;
        pos[i * 3 + 1] = myY;
      }

      if (typeRand < 0.8) {
        pos[i * 3 + 1] = baseY;
      }

      pos[i * 3] = px;
      pos[i * 3 + 2] = pz;

      const currentY = pos[i * 3 + 1];
      const absY = Math.abs(currentY);
      const fade = absY > 25 ? Math.max(0, (40 - absY) / 15) : 1.0;

      col[i * 3] = tempColor.r * fade;
      col[i * 3 + 1] = tempColor.g * fade;
      col[i * 3 + 2] = tempColor.b * fade;

      vel[i * 3] = 0; vel[i * 3 + 1] = 0; vel[i * 3 + 2] = 0;
    }
    return { basePositions: pos, colors: col, initialVelocities: vel };
  }, [count, radius, isMobile]);

  const { gasBasePositions, gasColors, gasInitialVelocities } = useMemo(() => {
    const pos = new Float32Array(gasCount * 3);
    const col = new Float32Array(gasCount * 3);
    const vel = new Float32Array(gasCount * 3);

    const color1 = new THREE.Color('#2DD4BF');
    const color2 = new THREE.Color('#38BDF8');

    for (let i = 0; i < gasCount; i++) {
      const type = Math.random();
      const t = Math.random();
      const angle = t * Math.PI * 2 * 12;
      const y = (t - 0.5) * 80;

      const spread = Math.random() * 2;
      const px = Math.cos(angle + (type > 0.5 ? Math.PI : 0)) * (radius + (Math.random() - 0.5) * spread);
      const pz = Math.sin(angle + (type > 0.5 ? Math.PI : 0)) * (radius + (Math.random() - 0.5) * spread);

      pos[i * 3] = px;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = pz;

      const tempColor = type > 0.5 ? color2 : color1;
      
      const absY = Math.abs(y);
      const fade = absY > 25 ? Math.max(0, (40 - absY) / 15) : 1.0;

      col[i * 3] = tempColor.r * fade;
      col[i * 3 + 1] = tempColor.g * fade;
      col[i * 3 + 2] = tempColor.b * fade;

      vel[i * 3] = 0; vel[i * 3 + 1] = 0; vel[i * 3 + 2] = 0;
    }
    return { gasBasePositions: pos, gasColors: col, gasInitialVelocities: vel };
  }, [gasCount, radius, isMobile]);

  const currentPositions = useMemo(() => new Float32Array(basePositions), [basePositions]);
  const velocities = useMemo(() => new Float32Array(initialVelocities), [initialVelocities]);

  const gasCurrentPositions = useMemo(() => new Float32Array(gasBasePositions), [gasBasePositions]);
  const gasVelocities = useMemo(() => new Float32Array(gasInitialVelocities), [gasInitialVelocities]);

  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const prevMouseWorld = useMemo(() => new THREE.Vector3(), []);
  const mouseVelocity = useMemo(() => new THREE.Vector3(), []);
  const inverseQ = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !gasRef.current) return;

    const time = state.clock.elapsedTime;
    const dt = Math.max(delta, 0.016);

    const rotX = 0;
    const rotY = time * 0.2;
    const rotZ = 0;

    pointsRef.current.rotation.set(rotX, rotY, rotZ);
    gasRef.current.rotation.set(rotX, rotY, rotZ);

    // Fixed vertical position so it doesn't drift when scrolling
    const targetY = -15;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.1;
    gasRef.current.position.y += (targetY - gasRef.current.position.y) * 0.1;

    const velX = (mouse.x - prevMouseWorld.x) / dt;
    const velY = (mouse.y - prevMouseWorld.y) / dt;
    prevMouseWorld.set(mouse.x, mouse.y, 0);

    mouseVelocity.set(velX * viewport.width / 2, velY * viewport.height / 2, 0);
    inverseQ.copy(pointsRef.current.quaternion).invert();
    mouseVelocity.applyQuaternion(inverseQ);

    let D = mouseVelocity.x;
    let O = mouseVelocity.y;
    let k = mouseVelocity.z;
    const vMagSq = D * D + O * O + k * k;
    if (vMagSq > 400) {
      const mult = 20 / Math.sqrt(vMagSq);
      D *= mult; O *= mult; k *= mult;
    }

    mouseWorld.set(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2, 0);
    pointsRef.current.worldToLocal(mouseWorld);

    const processPhysics = (
      _count: number,
      _basePos: Float32Array,
      _currPos: Float32Array,
      _vel: Float32Array,
      _geometryRef: React.RefObject<THREE.Points | null>,
      isGas: boolean
    ) => {
      const positions = _geometryRef.current!.geometry.attributes.position.array as Float32Array;

      for (let a = 0; a < _count; a++) {
        const e = a * 3;
        const u = _basePos[e];
        const d = _basePos[e + 1];
        const f = _basePos[e + 2];

        const h = u;
        const g = f;

        const _v = _currPos[e];
        const v = _currPos[e + 1];
        const y = _currPos[e + 2];

        const b = _v - mouseWorld.x;
        const S = v - mouseWorld.y;
        const C = y - mouseWorld.z;
        const w = b * b + S * S + C * C;

        if (isGas ? a % 3 !== 0 : a % 7 === 0) {
          // Chaotic/swirling particles
          const targetVx = -g * 0.5;
          const targetVz = h * 0.5;
          _vel[e] += (targetVx - _vel[e]) * 0.02;
          _vel[e + 1] += (0.5 - _vel[e + 1]) * 0.02;
          _vel[e + 2] += (targetVz - _vel[e + 2]) * 0.02;

          const swirlA = Math.sin(v * 3.1 + time * 1.5) * 0.5 + Math.cos(y * 2.1 - time * 1.1) * 0.5;
          const swirlS = Math.cos(_v * 2.7 + time * 1.7) * 0.5 + Math.sin(y * 3.5 + time * 1.2) * 0.5;
          const swirlP = Math.sin(_v * 4.2 - time * 1.3) * 0.5 + Math.cos(v * 1.9 + time * 1.4) * 0.5;

          const strength = isGas ? 0.08 : 0.04;
          _vel[e] += swirlA * strength;
          _vel[e + 1] += swirlS * strength * 0.5;
          _vel[e + 2] += swirlP * strength;

          const outward = isGas ? 0.01 : 0.005;
          _vel[e] += h * outward;
          _vel[e + 2] += g * outward;

          if (w < 25) {
            const distF = (25 - w) / 25;
            _vel[e] += D * distF * (isGas ? 0.08 : 0.05);
            _vel[e + 1] += O * distF * (isGas ? 0.08 : 0.05);
            _vel[e + 2] += k * distF * (isGas ? 0.08 : 0.05);
            _vel[e] += b * distF * 0.1;
            _vel[e + 1] += S * distF * 0.1;
            _vel[e + 2] += C * distF * 0.1;
          }

          _currPos[e] += _vel[e] * dt;
          _currPos[e + 1] += _vel[e + 1] * dt;
          _currPos[e + 2] += _vel[e + 2] * dt;

          _vel[e] *= 0.95;
          _vel[e + 1] *= 0.95;
          _vel[e + 2] *= 0.95;

          if (Math.pow(_currPos[e] - u, 2) + Math.pow(_currPos[e + 1] - d, 2) + Math.pow(_currPos[e + 2] - f, 2) > 300) {
            _currPos[e] = u; _currPos[e + 1] = d; _currPos[e + 2] = f;
            _vel[e] = 0; _vel[e + 1] = 0; _vel[e + 2] = 0;
          }
        } else {
          // Rigid DNA backbone
          const targetX = u;
          const targetY = d;
          const targetZ = f;

          _vel[e] += (targetX - _currPos[e]) * 0.2;
          _vel[e + 1] += (targetY - _currPos[e + 1]) * 0.2;
          _vel[e + 2] += (targetZ - _currPos[e + 2]) * 0.2;

          _vel[e] *= 0.5;
          _vel[e + 1] *= 0.5;
          _vel[e + 2] *= 0.5;

          _currPos[e] += _vel[e];
          _currPos[e + 1] += _vel[e + 1];
          _currPos[e + 2] += _vel[e + 2];
        }

        positions[e] = _currPos[e];
        positions[e + 1] = _currPos[e + 1];
        positions[e + 2] = _currPos[e + 2];
      }
      _geometryRef.current!.geometry.attributes.position.needsUpdate = true;
    };

    processPhysics(count, basePositions, currentPositions, velocities, pointsRef, false);
    processPhysics(gasCount, gasBasePositions, gasCurrentPositions, gasVelocities, gasRef, true);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} args={[currentPositions, 3]} />
          <bufferAttribute attach="attributes-color" count={count} args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          map={circleTexture}
          vertexColors={true}
          transparent={true}
          opacity={0.9}
          sizeAttenuation={true}
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
          size={1.5}
          map={gasTexture}
          vertexColors={true}
          transparent={true}
          opacity={0.15}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
};

export default function Dna3DCanvas({ className = '', embedded = false, muted = false }: { className?: string, embedded?: boolean, muted?: boolean }) {
  return (
    <div className={`dna-container ${className}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }} gl={{ alpha: true, antialias: false }}>
        <group scale={1.25} rotation={[0, 0, -Math.PI * (52.5 / 180)]}>
          <DnaParticles />
        </group>
      </Canvas>
    </div>
  );
}
