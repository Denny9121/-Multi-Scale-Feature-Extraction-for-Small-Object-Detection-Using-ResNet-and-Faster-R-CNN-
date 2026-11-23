import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import { Stars } from "@react-three/drei";

const ParticleField = lazy(() => import("../../three/ParticleField"));

export default function ParticleBackground({ count = 3000 }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas aria-hidden="true" camera={{ position: [0, 0, 6], fov: 60 }}>
        <Suspense fallback={null}>
          <ParticleField count={count} />
          <Stars radius={90} depth={40} count={800} factor={3} fade speed={0.8} />
        </Suspense>
      </Canvas>
    </div>
  );
}
