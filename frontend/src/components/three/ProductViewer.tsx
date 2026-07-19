import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls, RoundedBox, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface ProductModelProps {
  color?: string;
}

function ProductModel({ color = '#1a1a1a' }: ProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialColor = new THREE.Color(color);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <RoundedBox args={[2, 2, 0.5]} radius={0.25} smoothness={8}>
          <meshPhysicalMaterial
            color={materialColor}
            metalness={0.7}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        <Torus args={[1.2, 0.05, 16, 64]} position={[0, 0, 0.3]}>
          <meshPhysicalMaterial
            color="#6366f1"
            metalness={0.9}
            roughness={0.1}
            emissive="#6366f1"
            emissiveIntensity={0.2}
          />
        </Torus>

        <Sphere args={[0.12, 32, 32]} position={[0.6, 0.6, 0.35]}>
          <meshPhysicalMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
        </Sphere>
      </Float>
    </group>
  );
}

interface ProductViewerProps {
  color?: string;
  className?: string;
}

export default function ProductViewer({ color = '#1a1a1a', className = '' }: ProductViewerProps) {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#6366f1" />
        <pointLight position={[0, 3, 0]} intensity={0.4} />

        <Environment preset="studio" background={false} />

        <Suspense fallback={null}>
          <ProductModel color={color} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
