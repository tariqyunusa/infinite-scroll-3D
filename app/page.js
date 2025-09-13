"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const Images = [
  "/gradient-1.jpg",
  "/gradient-2.jpg",
  "/gradient-3.jpg",
  "/gradient-4.jpg",
  "/gradient-5.jpg"
];

function CarouselImage({ url }) {
  const texture = useTexture(url);
  return (
    <mesh>
      <planeGeometry args={[2, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function InfiniteCarousel() {
  const groupRef = useRef();
  const velocityRef = useRef(0);
  const offsetRef = useRef(0);
  const { viewport } = useThree();

  const spacing = 3;
  const numVisible = Images.length;
  const totalWidth = spacing * numVisible;

  useFrame(() => {
    offsetRef.current += velocityRef.current;
    velocityRef.current *= 0.92; 

    const speed = Math.abs(velocityRef.current);

    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (!child.isMesh) return; 

        const centeredOffset = offsetRef.current - totalWidth / 2;
        const x =
          ((i * spacing + centeredOffset) % totalWidth + totalWidth) %
            totalWidth -
          totalWidth / 2;

        child.position.x = x;

        const targetScale = THREE.MathUtils.mapLinear(
          Math.min(speed, 1), 
          0,
          1,
          1.0, 
          0.5  
        );

        const newScale = THREE.MathUtils.lerp(child.scale.x, targetScale, 0.1);
        child.scale.set(newScale, newScale, 1);
      });
    }
  });

  const handleWheel = (e) => {
    velocityRef.current += e.deltaY * -0.01;
  };

  return (
    <group ref={groupRef}>

      <mesh onWheel={handleWheel} position={[0, 0, -2]}>
        <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {Images.map((url, i) => (
        <CarouselImage key={i} url={url} />
      ))}
    </group>
  );
}

export default function Home() {
  return (
    <section className="w-full h-screen  relative">
      <nav className="absolute font-bebas top-0 left-0 w-full flex justify-between items-center p-4  bg-opacity-70 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold p-4">Tariq</h1>
        <h1 className="text-xl font-bold p-4">Infinite Carousel</h1>

      </nav>
      <Canvas >
        <InfiniteCarousel />
      </Canvas>
    </section>
  );
}
