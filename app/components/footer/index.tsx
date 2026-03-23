import { Text, useCursor, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FOOTER_LINKS } from "../../constants";
import { FooterLink } from "../../types";

const FooterLinkItem = ({ link, isCompact }: { link: FooterLink; isCompact: boolean }) => {
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);
  const onClick = () => window.open(link.url, '_blank');
  const onPointerMove = (e: MouseEvent) => {
    if (isCompact) return;
    const hoverDiv = document.getElementById(`footer-link-${link.name}`);
    gsap.to(hoverDiv, {
      top: `${e.clientY + 14}px`,
      left: `${e.clientX}px`,
      duration: 0.6,
    });
  };

  const fontProps = {
    font: "./Vercetti-Regular.woff",
    fontSize: 0.2,
    color: 'white',
    onPointerOver,
    onPointerMove,
    onPointerOut,
    onClick,
  };

  useEffect(() => {
    if (!document.getElementById(`footer-link-${link.name}`)) {
      const hoverDiv = document.createElement('div');
      hoverDiv.id = `footer-link-${link.name}`;
      hoverDiv.textContent = link.hoverText ?? link.name.toUpperCase();
      hoverDiv.style.position = 'fixed';
      hoverDiv.style.zIndex = '2';
      hoverDiv.style.bottom = '0';
      hoverDiv.style.opacity = '0';
      hoverDiv.style.left = window.innerWidth / 2 + 'px';
      hoverDiv.style.fontSize = '0.8rem';
      hoverDiv.style.pointerEvents = 'none';
      document.body.appendChild(hoverDiv);
    }
  }, [])

  useEffect(() => {
    if (isCompact) return

    const hoverDiv = document.getElementById(`footer-link-${link.name}`);

    if (hovered) {
      gsap.fromTo(hoverDiv, { opacity: 0 }, { opacity: 0.5, delay: 0.2 });
    } else {
      gsap.to(hoverDiv, { opacity: 0 });
    }

    gsap.to(textRef.current, {
      letterSpacing: hovered ? 0.3 : 0,
      duration: 0.3,
    });

    return () => {
      gsap.killTweensOf(hoverDiv);
      gsap.killTweensOf(textRef.current);
    }
  }, [hovered]);

  useCursor(!isCompact && hovered);

  if (isCompact) {
    return (
      <Text
        font="./Vercetti-Regular.woff"
        fontSize={0.17}
        color="white"
        onClick={onClick}
        anchorX="center"
        anchorY="middle"
      >
        {link.name.toUpperCase()}
      </Text>
    );
  }

  return (
    <Text ref={textRef} {...fontProps} >
      {link.name.toUpperCase()}
    </Text>
  )
}

const Footer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useFrame(() => {
    const d = data.range(0.8, 0.2);
    if (groupRef.current) {
      groupRef.current.visible = d > 0;
    }
  });

  const getLinks = () => {
    if (isCompact) {
      const splitIndex = Math.ceil(FOOTER_LINKS.length / 2); // 5 links -> 3 + 2
      const spacingX = 0.95;
      const spacingY = 0.28;

      return FOOTER_LINKS.map((link, i) => {
        const isTopRow = i < splitIndex;
        const topCount = splitIndex;
        const bottomCount = FOOTER_LINKS.length - splitIndex;
        const colIndex = isTopRow ? i : i - splitIndex;
        const rowCenter = isTopRow ? (topCount - 1) / 2 : (bottomCount - 1) / 2;
        const bottomRowNudgeX = 0.22;
        const x = (colIndex - rowCenter) * spacingX + (isTopRow ? 0 : bottomRowNudgeX);
        const y = isTopRow ? 0 : -spacingY;

        return (
          <group key={i} position={[x, y, 0]}>
            <FooterLinkItem link={link} isCompact={isCompact} />
          </group>
        );
      });
    }

    return FOOTER_LINKS.map((link, i) => (
      <group key={i} position={[i * 2, 0, 0]}>
        <FooterLinkItem link={link} isCompact={isCompact} />
      </group>
    ));
  };

  return (
    <group position={[0, -44, 18]} rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>
      <group position={isCompact ? [0, 0.55, 0] : [-4, 0, 0]}>
        { getLinks() }
      </group>
    </group>
  );
};

export default Footer;
