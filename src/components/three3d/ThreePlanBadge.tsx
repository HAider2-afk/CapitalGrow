import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreePlanBadgeProps {
  planType: string;
  color?: string;
  size?: number;
}

export const ThreePlanBadge: React.FC<ThreePlanBadgeProps> = ({
  planType,
  color = '#635BFF',
  size = 52
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current || useFallback) return;
    const canvas = canvasRef.current;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;

    try {
      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 3.8);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(1);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 2);
      dirLight.position.set(3, 4, 3);
      scene.add(dirLight);

      const hexColor = parseInt(color.replace('#', '0x'), 16) || 0x635bff;

      // Pick unique 3D shape based on plan type
      let geom: THREE.BufferGeometry;
      const typeLower = planType.toLowerCase();

      if (typeLower.includes('starter') || typeLower.includes('basic')) {
        geom = new THREE.OctahedronGeometry(1.2, 0);
      } else if (typeLower.includes('pro') || typeLower.includes('growth')) {
        geom = new THREE.IcosahedronGeometry(1.15, 0);
      } else if (typeLower.includes('high') || typeLower.includes('yield')) {
        geom = new THREE.DodecahedronGeometry(1.1, 0);
      } else if (typeLower.includes('institutional') || typeLower.includes('vip') || typeLower.includes('elite')) {
        geom = new THREE.TorusKnotGeometry(0.75, 0.25, 32, 12);
      } else {
        geom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      }

      const material = new THREE.MeshStandardMaterial({
        color: hexColor,
        roughness: 0.2,
        metalness: 0.7,
        transparent: true,
        opacity: 0.95
      });

      const mesh = new THREE.Mesh(geom, material);
      scene.add(mesh);

      // Wireframe accent
      const wire = new THREE.Mesh(
        geom.clone(),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.35
        })
      );
      wire.scale.set(1.08, 1.08, 1.08);
      scene.add(wire);

      let hoverSpeed = 0.015;

      const animate = () => {
        animIdRef.current = requestAnimationFrame(animate);
        mesh.rotation.y += hoverSpeed;
        mesh.rotation.x += hoverSpeed * 0.5;
        wire.rotation.y += hoverSpeed;
        wire.rotation.x += hoverSpeed * 0.5;
        if (renderer && scene) {
          renderer.render(scene, camera);
        }
      };

      animIdRef.current = requestAnimationFrame(animate);

      const onMouseEnter = () => {
        hoverSpeed = 0.04;
      };
      const onMouseLeave = () => {
        hoverSpeed = 0.015;
      };

      canvas.addEventListener('mouseenter', onMouseEnter);
      canvas.addEventListener('mouseleave', onMouseLeave);

      return () => {
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        canvas.removeEventListener('mouseenter', onMouseEnter);
        canvas.removeEventListener('mouseleave', onMouseLeave);
        try {
          if (renderer) renderer.dispose();
          if (scene) scene.clear();
        } catch {}
      };
    } catch (e) {
      console.warn('ThreePlanBadge WebGL fallback triggered:', e);
      setUseFallback(true);
    }
  }, [planType, color, size, useFallback]);

  // Fallback: Elegant CSS 3D faceted crystal badge
  if (useFallback) {
    return (
      <div
        className="inline-flex items-center justify-center relative shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-sm group"
        style={{ width: size, height: size }}
        title={`${planType} Strategy`}
      >
        <div
          className="w-6 h-6 rounded-md transform rotate-45 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110 shadow-inner flex items-center justify-center border border-white/30"
          style={{
            background: `linear-gradient(135deg, ${color}, #0B1026)`,
            boxShadow: `0 0 12px ${color}40`
          }}
        >
          <div className="w-2.5 h-2.5 rounded-sm bg-white/40 transform -rotate-45" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="inline-block relative shrink-0 cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/10 p-0.5 shadow-sm"
      style={{ width: size, height: size }}
      title={`3D Interactive ${planType} Gem`}
    >
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
    </div>
  );
};
