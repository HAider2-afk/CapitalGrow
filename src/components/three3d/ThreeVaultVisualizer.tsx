import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3D, Sparkles, Eye, Maximize2, Shield, Activity, RefreshCw } from 'lucide-react';

export type GeometryType = 'icosahedron' | 'dodecahedron' | 'torusKnot' | 'gem';

interface ThreeVaultVisualizerProps {
  portfolioValue?: string;
  profitRate?: string;
  className?: string;
}

export const ThreeVaultVisualizer: React.FC<ThreeVaultVisualizerProps> = ({
  portfolioValue = 'Rs. 2,450,000',
  profitRate = '+14.2%',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeGeo, setActiveGeo] = useState<GeometryType>('icosahedron');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [particleCount, setParticleCount] = useState<number>(350);
  const [fps, setFps] = useState<number>(60);
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainMeshRef = useRef<THREE.Mesh | null>(null);
  const wireMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let resizeObserver: ResizeObserver;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 320;
    const aspect = height > 0 ? width / height : 16 / 9;

    try {
      // Scene
      scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
      camera.position.set(0, 0, 7.5);

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      rendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Directional Lights
    const dirLight1 = new THREE.DirectionalLight(0x635bff, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x18c8b5, 2.0);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xa78bfa, 3, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Root Group for 3D Asset
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // Geometry generator helper
    const buildMesh = (type: GeometryType) => {
      let geom: THREE.BufferGeometry;
      let color = 0x635bff;

      switch (type) {
        case 'icosahedron':
          geom = new THREE.IcosahedronGeometry(1.6, 0);
          color = 0x18c8b5;
          break;
        case 'dodecahedron':
          geom = new THREE.DodecahedronGeometry(1.5, 0);
          color = 0xf59e0b;
          break;
        case 'torusKnot':
          geom = new THREE.TorusKnotGeometry(1.1, 0.35, 120, 24);
          color = 0xa78bfa;
          break;
        case 'gem':
          geom = new THREE.OctahedronGeometry(1.7, 1);
          color = 0x2dd4bf;
          break;
        default:
          geom = new THREE.IcosahedronGeometry(1.6, 0);
      }

      // Main reflective material
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.15,
        metalness: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.88,
        wireframe: wireframeMode
      });

      const mesh = new THREE.Mesh(geom, mat);

      // Outer Wireframe Cage
      const wireGeom = geom.clone();
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const wireMesh = new THREE.Mesh(wireGeom, wireMat);
      wireMesh.scale.set(1.12, 1.12, 1.12);

      return { mesh, wireMesh };
    };

    const { mesh, wireMesh } = buildMesh(activeGeo);
    mainMeshRef.current = mesh;
    wireMeshRef.current = wireMesh;
    vaultGroup.add(mesh);
    vaultGroup.add(wireMesh);

    // Orbital Rings
    const ringsGroup = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x89a0af,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.02, 16, 100), ringMat);
    ring1.rotation.x = Math.PI / 3;
    ringsGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.9, 0.02, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x18c8b5, wireframe: true, transparent: true, opacity: 0.4 })
    );
    ring2.rotation.y = Math.PI / 4;
    ringsGroup.add(ring2);

    vaultGroup.add(ringsGroup);
    ringsRef.current = ringsGroup;

    // Orbital Particle Swarm
    const pCount = particleCount;
    const pPositions = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const radius = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Gold & Emerald gradient colors
      if (i % 3 === 0) {
        pColors[i * 3] = 0.09; // #18C8B5
        pColors[i * 3 + 1] = 0.78;
        pColors[i * 3 + 2] = 0.71;
      } else if (i % 3 === 1) {
        pColors[i * 3] = 0.96; // #F59E0B
        pColors[i * 3 + 1] = 0.62;
        pColors[i * 3 + 2] = 0.04;
      } else {
        pColors[i * 3] = 0.39; // #635BFF
        pColors[i * 3 + 1] = 0.36;
        pColors[i * 3 + 2] = 1.0;
      }
    }

    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeom.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeom, pMat);
    vaultGroup.add(particles);
    particlesRef.current = particles;

    // Animation Loop
    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsAccumulator = 0;

    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      frameCounter++;
      fpsAccumulator += delta;
      if (fpsAccumulator >= 0.5) {
        setFps(Math.round(frameCounter / fpsAccumulator));
        frameCounter = 0;
        fpsAccumulator = 0;
      }

      if (isRotating && !isDraggingRef.current) {
        vaultGroup.rotation.y += 0.007;
        vaultGroup.rotation.x = Math.sin(time * 0.001) * 0.15;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y -= 0.003;
        particlesRef.current.rotation.z += 0.001;
      }

      if (ringsRef.current) {
        ringsRef.current.rotation.x += 0.004;
        ringsRef.current.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // Mouse Drag Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      vaultGroup.rotation.y += deltaX * 0.008;
      vaultGroup.rotation.x += deltaY * 0.008;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch Controls
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;

      vaultGroup.rotation.y += deltaX * 0.01;
      vaultGroup.rotation.x += deltaY * 0.01;

      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

      // Cleanup
      return () => {
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
        if (resizeObserver) resizeObserver.disconnect();
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);

        try {
          if (renderer) renderer.dispose();
          if (scene) scene.clear();
        } catch {}
      };
    } catch (err) {
      console.warn('ThreeVaultVisualizer WebGL init note:', err);
      setWebGLFailed(true);
    }
  }, [activeGeo, wireframeMode, particleCount]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[280px] sm:h-[320px] rounded-[22px] bg-gradient-to-br from-[#121139] via-[#0B0F28] to-[#07091B] border border-white/10 shadow-2xl overflow-hidden group select-none ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing ${webGLFailed ? 'hidden' : 'block'}`}
      />

      {/* Fallback CSS 3D Animated Crystal if WebGL is unavailable */}
      {webGLFailed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#635BFF]/30 animate-ping opacity-25" />
            <div className="absolute inset-3 rounded-full border border-[#18C8B5]/40 animate-pulse" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#635BFF] via-[#8B5CF6] to-[#18C8B5] transform rotate-45 animate-spin shadow-[0_0_40px_rgba(99,91,255,0.4)] opacity-90" style={{ animationDuration: '12s' }} />
            <div className="absolute w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm transform -rotate-12 border border-white/50" />
          </div>
        </div>
      )}

      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#635BFF]/15 via-transparent to-transparent" />

      {/* Top Left Floating Information */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-[#8FE3B0] mb-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#18C8B5] animate-pulse" />
          3D Interactive Asset Vault
        </div>
        <h4 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight drop-shadow-md">
          {portfolioValue}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono font-semibold text-[#8FE3B0] bg-[#18C8B5]/15 px-2 py-0.5 rounded-full border border-[#18C8B5]/30">
            {profitRate} Accrual
          </span>
          <span className="text-[11px] text-[#89A0AF] font-mono">Real-Time WebGL</span>
        </div>
      </div>

      {/* Top Right Mode Switchers */}
      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
        <button
          onClick={() => {
            const types: GeometryType[] = ['icosahedron', 'dodecahedron', 'torusKnot', 'gem'];
            const nextIdx = (types.indexOf(activeGeo) + 1) % types.length;
            setActiveGeo(types[nextIdx]);
          }}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-1.5 transition-all shadow"
          title="Switch 3D Geometry"
        >
          <Rotate3D className="w-3.5 h-3.5 text-[#18C8B5]" />
          <span className="hidden sm:inline capitalize">{activeGeo}</span>
        </button>

        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`p-1.5 rounded-lg border text-xs transition-all shadow backdrop-blur-md ${
            wireframeMode
              ? 'bg-[#635BFF] text-white border-[#635BFF]'
              : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
          }`}
          title="Toggle Wireframe Matrix"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-lg border text-xs transition-all shadow backdrop-blur-md ${
            isRotating
              ? 'bg-[#18C8B5]/20 text-[#8FE3B0] border-[#18C8B5]/40'
              : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
          }`}
          title={isRotating ? 'Pause Rotation' : 'Resume Auto-Rotate'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bottom Floating Telemetry Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none text-[10px] sm:text-[11px] font-mono text-[#89A0AF]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/5">
            <Activity className="w-3 h-3 text-[#18C8B5]" />
            {fps} FPS
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/5">
            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
            {particleCount} Particle Nodes
          </span>
        </div>

        <div className="bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-white/5 flex items-center gap-1.5 text-white/80">
          <span>Click & Drag to Inspect 3D Vault</span>
        </div>
      </div>
    </div>
  );
};
