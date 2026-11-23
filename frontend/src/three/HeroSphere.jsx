import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

export default function HeroSphere() {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const speed = hovered ? 0.015 : 0.005;
    ref.current.rotation.y += speed;
    ref.current.rotation.x += speed * 0.6;
    ref.current.material.opacity = 0.45 + Math.sin(clock.elapsedTime * 1.6) * 0.15;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.45}>
      <mesh ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <icosahedronGeometry args={[1.4, 6]} />
        <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.6} />
      </mesh>
    </Float>
  );
}
