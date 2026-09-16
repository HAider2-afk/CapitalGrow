import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface ThreeCoinCelebrationProps {
  title: string;
  subtitle: string;
  amount?: string;
  onClose: () => void;
}

export const ThreeCoinCelebration: React.FC<ThreeCoinCelebrationProps> = ({
  title,
  subtitle,
  amount,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let handleResize: () => void;

    try {
      const width = window.innerWidth || 800;
      const height = window.innerHeight || 600;

      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0, 0, 10);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffd700, 2.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x18c8b5, 3, 15);
    pointLight.position.set(-3, -2, 5);
    scene.add(pointLight);

    // Coin Mesh Geometries (Golden cylinders with beveled look)
    const coinGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 24);
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0
    });

    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x18c8b5,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 0.8
    });

    const purpleMat = new THREE.MeshPhysicalMaterial({
      color: 0x635bff,
      metalness: 0.8,
      roughness: 0.25,
      clearcoat: 0.8
    });

    const materials = [goldMat, emeraldMat, purpleMat];

    interface CoinParticle {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      rotX: number;
      rotY: number;
      rotZ: number;
    }

    const coins: CoinParticle[] = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(coinGeom, mat);

      // Start clustered near center
      mesh.position.set(
        (Math.random() - 0.5) * 2,
        -1 + (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 2
      );

      // Random initial explosive velocities upward and outward
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.0;

      scene.add(mesh);
      coins.push({
        mesh,
        vx: Math.cos(angle) * (speed * 0.7),
        vy: 4.5 + Math.random() * 6.5,
        vz: Math.sin(angle) * (speed * 0.7),
        rotX: (Math.random() - 0.5) * 0.2,
        rotY: (Math.random() - 0.5) * 0.2,
        rotZ: (Math.random() - 0.5) * 0.2
      });
    }

    // Sparkle particles
    const sparkleGeom = new THREE.BufferGeometry();
    const sPositions = new Float32Array(120 * 3);
    for (let i = 0; i < 120 * 3; i++) {
      sPositions[i] = (Math.random() - 0.5) * 12;
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sPositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xfff07c,
      transparent: true,
      opacity: 0.85
    });
    const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
    scene.add(sparkles);

    let lastTime = performance.now();

    const animate = (time: number) => {
      animIdRef.current = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Update physics for each 3D coin
      coins.forEach((c) => {
        c.vy -= 9.8 * dt; // gravity
        c.mesh.position.x += c.vx * dt;
        c.mesh.position.y += c.vy * dt;
        c.mesh.position.z += c.vz * dt;

        c.mesh.rotation.x += c.rotX;
        c.mesh.rotation.y += c.rotY;
        c.mesh.rotation.z += c.rotZ;

        // Floor bounce
        if (c.mesh.position.y < -5.5) {
          c.mesh.position.y = -5.5;
          c.vy = -c.vy * 0.45;
          c.vx *= 0.8;
          c.vz *= 0.8;
        }
      });

      sparkles.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animIdRef.current = requestAnimationFrame(animate);

      handleResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        if (handleResize) window.removeEventListener('resize', handleResize);
        try {
          if (renderer) renderer.dispose();
          if (scene) scene.clear();
        } catch {}
      };
    } catch (e) {
      console.warn('ThreeCoinCelebration WebGL note:', e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* 3D WebGL Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating Center Card */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-[24px] bg-[#1a1b41]/90 border border-white/20 text-white shadow-2xl backdrop-blur-xl text-center space-y-5 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#18C8B5]/20 border border-[#18C8B5]/40 flex items-center justify-center text-[#8FE3B0] shadow-lg animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/15 text-[#F59E0B]">
            <Sparkles className="w-3.5 h-3.5" />
            3D Transaction Settlement
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold">{title}</h3>
          <p className="text-xs sm:text-sm text-[#89A0AF] leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        {amount && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-[11px] font-mono text-[#89A0AF]">Committed Amount</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-[#8FE3B0] mt-0.5">
              {amount}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#18C8B5] to-[#129A8B] text-[#0B1026] font-bold text-sm shadow-lg hover:brightness-110 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
