import { Edges, Text, TextProps, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

import { useGalleryStore, useMusicStore, usePortalStore, useVideoStore } from "@stores";
import { Project } from "@types";
import { publicPath } from "../../../utils/publicPath";

interface ProjectTileProps {
  project: Project;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  activeId: number | null;
  onClick: () => void;
}

const ProjectTile = ({ project, index, position, rotation, activeId, onClick }: ProjectTileProps) => {
  const WATCH_VIDEO_URL = "https://www.youtube.com/watch?v=P3wJ2MQcXvg";
  const hasImage = !!project.image;
  const IMAGE_BOX_WIDTH = 3.75;
  const IMAGE_BOX_HEIGHT = 2.05;
  const IMAGE_BOX_X = 0;
  const IMAGE_BOX_Y = 0.2;
  const projectRef = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Object3D>(null);
  const actionsRef = useRef<THREE.Group>(null);
  const imageMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const hoverAnimRef = useRef<gsap.core.Timeline | null>(null);
  const [hovered, setHovered] = useState(false);
  const [imagePlaneSize, setImagePlaneSize] = useState<[number, number]>([IMAGE_BOX_WIDTH, IMAGE_BOX_HEIGHT]);
  const isProjectSectionActive = usePortalStore((state) => state.activePortalId === "projects");
  const openGalleryModal = useGalleryStore((state) => state.openGallery);
  const openVideoModal = useVideoStore((state) => state.openVideo);
  const requestMusicPause = useMusicStore((state) => state.requestPause);
  const previewTexture = useTexture(publicPath(project.image ?? "/project-1.png"));
  const galleryImages = useMemo(() => {
    if (project.gallery && project.gallery.length > 0) return project.gallery;
    if (project.image) return [project.image];
    return ["/project-1.png"];
  }, [project.gallery, project.image]);

  const titleProps = useMemo(() => ({
    font: "./soria-font.ttf",
    color: "black",
  }), []);

  const subtitleProps: Partial<TextProps> = useMemo(() => ({
    font: "./Vercetti-Regular.woff",
    color: "black",
    anchorX: "left",
    anchorY: "top",
  }), []);

  useEffect(() => {
    if (!hasImage) return;
    const image = previewTexture.image as { width?: number; height?: number } | undefined;
    if (!image?.width || !image?.height) return;
    const imageAspect = image.width / image.height;
    const panelAspect = IMAGE_BOX_WIDTH / IMAGE_BOX_HEIGHT;

    let width = IMAGE_BOX_WIDTH;
    let height = IMAGE_BOX_HEIGHT;
    if (imageAspect > panelAspect) {
      height = IMAGE_BOX_WIDTH / imageAspect;
    } else {
      width = IMAGE_BOX_HEIGHT * imageAspect;
    }
    setImagePlaneSize([width, height]);

    previewTexture.wrapS = THREE.ClampToEdgeWrapping;
    previewTexture.wrapT = THREE.ClampToEdgeWrapping;
    previewTexture.repeat.set(1, 1);
    previewTexture.offset.set(0, 0);
    previewTexture.needsUpdate = true;
  }, [previewTexture, hasImage, IMAGE_BOX_WIDTH, IMAGE_BOX_HEIGHT]);

  useEffect(() => {
    if (!projectRef.current) return;
    hoverAnimRef.current?.kill();
    const [mesh] = projectRef.current.children;

    hoverAnimRef.current = gsap.timeline();
    hoverAnimRef.current
      .to(projectRef.current.position, { z: hovered ? 1 : 0, duration: 0.2 }, 0)
      .to(projectRef.current.position, { y: hovered ? 0.4 : 0 }, 0)
      .to(projectRef.current.scale, {
        x: hovered ? 1.3 : 1,
        y: hovered ? 1.08 : 1,
        z: hovered ? 1.3 : 1,
      }, 0)
      .to(titleRef.current?.position ?? {}, { y: hovered ? 1.72 : 1.62 }, 0)
      .to(mesh.scale, { y: hovered ? 1.08 : 1 }, 0)
      .to((mesh as THREE.Mesh).material, { opacity: hovered ? 0.95 : 0.3 }, 0)
      .to(mesh.position, { y: hovered ? 1 : 0 }, 0);

    if (imageMaterialRef.current) {
      hoverAnimRef.current.to(imageMaterialRef.current, { opacity: hovered ? 0.95 : 0, duration: 0.25 }, 0);
    }

    hoverAnimRef.current.to(actionsRef.current?.scale ?? {}, { y: hovered ? 1 : 0, x: hovered ? 1 : 0 }, 0);
    hoverAnimRef.current.to(actionsRef.current?.position ?? {}, { z: hovered ? 0.3 : -1 }, 0);
  }, [hovered]);

  useEffect(() => {
    if (isMobile) {
      setHovered(activeId === index);
    }
  }, [isMobile, activeId]);

  useEffect(() => {
    if (projectRef.current) {
      gsap.to(projectRef.current.position, {
        y: isProjectSectionActive ? 0 : -10,
        duration: 1,
        delay: isProjectSectionActive ? index * 0.1 : 0,
      });
    }
  }, [isProjectSectionActive]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const button = e.eventObject;
    const watchUrl = project.videoUrl ?? WATCH_VIDEO_URL;
    requestMusicPause();
    gsap.to(button.position, { z: 0, duration: 0.1 })
      .then(() => gsap.to(button.position, { z: 0.3, duration: 0.3 }));
    openVideoModal({ title: `${project.title} Video`, url: watchUrl });
  };

  const openGallery = (e: ThreeEvent<MouseEvent>) => {
    e.nativeEvent.preventDefault();
    e.stopPropagation();
    openGalleryModal({ title: project.title, description: project.subtext, images: galleryImages });
  };

  const stopClickPropagation = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => !isMobile && isProjectSectionActive && setHovered(true)}
      onPointerOut={() => !isMobile && isProjectSectionActive && setHovered(false)}>
      <group ref={projectRef}>
        <mesh>
          <planeGeometry args={[4.2, 3.4, 1]} />
          <meshBasicMaterial color="#FFF" transparent opacity={0.3} />
          {/* <meshPhysicalMaterial transmission={1} roughness={0.3} /> */}
          <Edges color="black" lineWidth={1.5} />
        </mesh>
        {hasImage ? (
          <mesh position={[IMAGE_BOX_X, IMAGE_BOX_Y, 0.06]}>
            <planeGeometry args={[imagePlaneSize[0], imagePlaneSize[1], 1]} />
            <meshBasicMaterial ref={imageMaterialRef} map={previewTexture} transparent opacity={0} />
          </mesh>
        ) : null}
        <Text
          ref={titleRef}
          {...titleProps}
          position={[-1.9, 1.62, 0.101]}
          anchorX="left"
          anchorY="bottom"
          maxWidth={4}
          fontSize={0.72}>
          {project.title}
        </Text>
        <group
          ref={actionsRef}
          position={[1.52, 1.62, -1]}
          scale={[0, 0, 1]}
          onPointerDown={stopClickPropagation}
          onClick={stopClickPropagation}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {project.url ? (
            <group onPointerDown={stopClickPropagation} onClick={handleClick}>
              <mesh visible={false}>
                <boxGeometry args={[1.5, 0.7, 0.35]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
              <mesh>
                <boxGeometry args={[1.1, 0.4, 0.2]} />
                <meshBasicMaterial color="#222" />
                <Edges color="white" lineWidth={1} />
              </mesh>
              <Text
                {...subtitleProps}
                color="white"
                position={[-0.4, 0.15, 0.2]}
                fontSize={0.25}>
                İzle ↗
              </Text>
            </group>
          ) : null}

          <group position={[0, -0.55, 0]} onPointerDown={stopClickPropagation} onClick={openGallery}>
            <mesh visible={false}>
              <boxGeometry args={[1.5, 0.7, 0.35]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh>
              <boxGeometry args={[1.1, 0.4, 0.2]} />
              <meshBasicMaterial color="#222" />
              <Edges color="white" lineWidth={1} />
            </mesh>
            <Text
              {...subtitleProps}
              color="white"
              position={[-0.43, 0.15, 0.2]}
              fontSize={0.22}>
              Galeri ↗
            </Text>
          </group>
        </group>
      </group>
    </group>
  );
};

export default ProjectTile;
