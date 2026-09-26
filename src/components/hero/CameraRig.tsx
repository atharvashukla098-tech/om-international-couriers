/* eslint-disable react-hooks/immutability */
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 2.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 8 + (-pointer.y * 1.5), 0.05);
    camera.lookAt(0, 1.5, 0);
  });

  return null;
}
