'use client';

import { useProgress, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { publicPath } from "../../utils/publicPath";
import CloudContainer from "../models/Cloud";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();
  const HERO_LOGO_PATH = publicPath('/logosvg.svg');
  const LOGO_WIDTH = 9;
  const LOGO_ASPECT_RATIO = 1920 / 1080;
  const LOGO_HEIGHT = LOGO_WIDTH / LOGO_ASPECT_RATIO;
  const logoTexture = useTexture(HERO_LOGO_PATH);

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: 0,
        duration: 3
      });
    }
  }, [progress]);

  return (
    <>
      <mesh position={[0, 2, -10]} ref={titleRef}>
        <planeGeometry args={[LOGO_WIDTH, LOGO_HEIGHT]} />
        <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
      </mesh>
      <CloudContainer />
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10} />
        <WindowModel receiveShadow />
        <TextWindow />
      </group>
    </>
  );
};

export default Hero;
