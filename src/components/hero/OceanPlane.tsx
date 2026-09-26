"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;
  float elevation = sin(pos.x * 0.15 + uTime * 1.2) * cos(pos.y * 0.15 + uTime * 1.0) * 0.4
                  + sin(pos.x * 0.35 + uTime * 2.0) * 0.15
                  + sin(pos.y * 0.25 + uTime * 0.8) * 0.1;
  pos.z = elevation;
  vElevation = elevation;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  vec3 baseColor = vec3(0.015, 0.04, 0.12);
  vec3 deepColor = vec3(0.005, 0.015, 0.06);
  float depth = smoothstep(-0.3, 0.4, vElevation);
  vec3 color = mix(deepColor, baseColor, depth);
  
  // Caustic highlights
  float caustic = sin(vUv.x * 40.0 + uTime * 2.0) * sin(vUv.y * 40.0 + uTime * 1.5);
  caustic = smoothstep(0.3, 0.8, caustic);
  vec3 causticColor = vec3(0.0, 0.94, 1.0) * 0.35 * caustic;
  color += causticColor * (0.5 + 0.5 * depth);
  
  // Specular shimmer
  float specular = pow(max(0.0, sin(vUv.x * 80.0 + uTime * 3.0) * sin(vUv.y * 60.0 - uTime * 2.5)), 8.0);
  color += vec3(0.0, 0.94, 1.0) * specular * 0.15;
  
  gl_FragColor = vec4(color, 0.92);
}
`;

export default function OceanPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[120, 120, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}
