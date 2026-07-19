import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Torus, ContactShadows, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function PremiumComposition() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle constant rotation
      groupRef.current.rotation.y += delta * 0.1;
      
      // Mouse parallax
      const targetX = pointer.y * -0.15;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, delta * 2);
    }
  });

  // Extremely safe and performant materials
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    thickness: 2,
    transparent: true,
    opacity: 1,
  }), []);

  const chromeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1,
  }), []);

  const matteBlackMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#111827',
    metalness: 0.2,
    roughness: 0.8,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#6366f1',
    metalness: 0.4,
    roughness: 0.2,
    emissive: '#6366f1',
    emissiveIntensity: 0.5,
  }), []);

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.2, 0.2]}>
        
        {/* Center: Frosted Glass Sphere */}
        <Sphere args={[1.4, 64, 64]} position={[0, 0, 0]}>
          <primitive object={glassMaterial} attach="material" />
        </Sphere>

        {/* Orbiting Chrome Ring */}
        <Torus args={[1.9, 0.04, 32, 100]} position={[0, 0, 0]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <primitive object={chromeMaterial} attach="material" />
        </Torus>

        {/* Orbiting Accent Ring */}
        <Torus args={[2.3, 0.02, 16, 100]} position={[0, 0, 0]} rotation={[-Math.PI / 4, Math.PI / 2, 0]}>
          <primitive object={accentMaterial} attach="material" />
        </Torus>

        {/* Floating Matte Black Capsule */}
        <Cylinder args={[0.3, 0.3, 1.2, 32]} position={[1.8, 1.2, -1]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <primitive object={matteBlackMaterial} attach="material" />
        </Cylinder>

        {/* Floating Chrome Sphere */}
        <Sphere args={[0.4, 32, 32]} position={[-1.5, -1, 1.5]}>
          <primitive object={chromeMaterial} attach="material" />
        </Sphere>

        {/* Small glowing accent dot */}
        <Sphere args={[0.1, 16, 16]} position={[1.2, -1.5, 0.8]}>
          <primitive object={accentMaterial} attach="material" />
        </Sphere>

      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full relative" style={{ pointerEvents: 'auto' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        {/* Strong Lighting Setup so we don't rely purely on the Environment Map if it fails to load */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#eef2ff" />
        <pointLight position={[0, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[5, 0, -5]} intensity={1} color="#6366f1" />

        {/* The 3D Composition */}
        <PremiumComposition />
        
        {/* Soft, beautiful floor shadow */}
        <ContactShadows 
          position={[0, -2.8, 0]} 
          opacity={0.6} 
          scale={15} 
          blur={2.5} 
          far={5} 
          color="#1a1a1a" 
        />
      </Canvas>
    </div>
  );
}
