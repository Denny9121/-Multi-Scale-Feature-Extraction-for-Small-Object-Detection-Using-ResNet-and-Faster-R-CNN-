import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Cube({ position, offset }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2 + offset) * 0.07;
    ref.current.rotation.x = clock.elapsedTime * 0.2;
    ref.current.rotation.y = clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.32, 0.32, 0.32]} />
      <meshStandardMaterial color="#b6bdc6" roughness={0.4} metalness={0.8} />
    </mesh>
  );
}

export default function MetalCubeGrid() {
  const cubes = useMemo(() => {
    const out = [];
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        out.push({ position: [col * 0.5 - 1.25, row * 0.5 - 1.25, 0], offset: row + col });
      }
    }
    return out;
  }, []);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight intensity={1.2} position={[4, 5, 6]} />
      {cubes.map((cube, idx) => (
        <Cube key={idx} position={cube.position} offset={cube.offset} />
      ))}
      <OrbitControls enablePan={false} />
    </>
  );
}
