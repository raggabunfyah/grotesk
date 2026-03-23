'use client';

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, Preload, ScrollControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { useThemeStore } from "@stores";

import Preloader from "./Preloader";
import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";
import MobileMenu from "./MobileMenu";
import MusicPlayer from "./MusicPlayer";
import ThemeSwitcher from "./ThemeSwitcher";
import GalleryModal from "./GalleryModal";
import VideoModal from "./VideoModal";
// import {Perf} from "r3f-perf"

const CanvasLoader = (props: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const backgroundColor = useThemeStore((state) => state.color);
  const { progress } = useProgress();
  const isDayTheme = backgroundColor === "#0690d4";
  const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 1,
    overflow: "hidden",
  });

  useEffect(() => {
    if (!isMobile) {
      const borderStyle = {
        inset: '1rem',
        width: 'calc(100% - 2rem)',
        height: 'calc(100% - 2rem)',
      };
      setCanvasStyle({ ...canvasStyle, ...borderStyle })
    }
  }, [isMobile]);

  useGSAP(() => {
    gsap.to(ref.current, {
      backgroundColor: backgroundColor,
      duration: 1,
    });
    gsap.to(canvasRef.current, {
      backgroundColor: backgroundColor,
      duration: 1,
    });
    gsap.to(noiseRef.current, {
      opacity: isDayTheme ? 0.2 : 0.24,
      duration: 1,
    });
  }, [backgroundColor, isDayTheme]);

  useGSAP(() => {
    if (!noiseRef.current) return;

    gsap.set(noiseRef.current, { backgroundPosition: "0px 0px" });
    gsap.to(noiseRef.current, {
      backgroundPosition: "180px 140px",
      duration: 7,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  const noiseOverlayStyle = {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "100px",
    backgroundPosition: "0px 0px",
  };

  return (
    <div className="h-[100dvh] wrapper relative">
      <div className="h-[100dvh] relative" ref={ref}>
        <Canvas className="base-canvas"
          shadows
          style={canvasStyle}
          ref={canvasRef}
          dpr={[1, 2]}>
          {/* <Perf/> */}
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />

            <ScrollControls pages={4} damping={0.4} maxSpeed={1} distance={1} style={{ zIndex: 1 }}>
              {props.children}
              <Preloader />
            </ScrollControls>

            <Preload all />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>
        <div
          ref={noiseRef}
          className="pointer-events-none absolute inset-0"
          style={{
            ...noiseOverlayStyle,
            mixBlendMode: isDayTheme ? "soft-light" : "soft-light",
            opacity: isDayTheme ? 0.2 : 0.24,
          }}
        />
        <ProgressLoader progress={progress} />
      </div>
      <ThemeSwitcher />
      <MobileMenu />
      <MusicPlayer autoStart />
      <GalleryModal />
      <VideoModal />
      <ScrollHint />
    </div>
  );
};

export default CanvasLoader;
