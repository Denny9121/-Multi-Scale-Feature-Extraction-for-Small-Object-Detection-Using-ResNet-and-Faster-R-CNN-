import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ParticleField({ count = 3000 }) {
  const points = useRef();
  const particles = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      p[i * 3] = (Math.random() - 0.5) * 18;
      p[i * 3 + 1] = (Math.random() - 0.5) * 18;
      p[i * 3 + 2] = (Math.random() - 0.5) * 18;
      const isCyan = Math.random() > 0.5;
      c[i * 3] = isCyan ? 0 : 0.48;
      c[i * 3 + 1] = isCyan ? 0.94 : 0.18;
      c[i * 3 + 2] = isCyan ? 1 : 0.75;
    }
    return { p, c };
  }, [count]);

  useFrame(({ clock, mouse }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.03;
    points.current.rotation.x = mouse.y * 0.07;
    points.current.position.x = mouse.x * 0.3;
    points.current.position.y = mouse.y * 0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particles.p} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={particles.c} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.8} />
    </points>
  );
}
