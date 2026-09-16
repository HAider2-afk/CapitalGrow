import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, ShieldCheck, Zap } from 'lucide-react';

interface BankNode {
  name: string;
  city: string;
  lat: number;
  lng: number;
  status: 'online' | 'settling';
  latency: string;
}

const GLOBAL_HUBS: BankNode[] = [
  { name: 'Standard Chartered', city: 'London', lat: 51.5074, lng: -0.1278, status: 'online', latency: '4ms' },
  { name: 'Emirates NBD Escrow', city: 'Dubai', lat: 25.2048, lng: 55.2708, status: 'online', latency: '6ms' },
  { name: 'DBS Treasury', city: 'Singapore', lat: 1.3521, lng: 103.8198, status: 'online', latency: '12ms' },
  { name: 'JPMorgan Chase', city: 'New York', lat: 40.7128, lng: -74.006, status: 'online', latency: '8ms' },
  { name: 'Meezan Islamic Hub', city: 'Karachi', lat: 24.8607, lng: 67.0011, status: 'online', latency: '2ms' },
  { name: 'UBS Wealth Custody', city: 'Zurich', lat: 47.3769, lng: 8.5417, status: 'online', latency: '5ms' }
];

export const ThreeGlobalGlobe: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedHub, setSelectedHub] = useState<BankNode>(GLOBAL_HUBS[4]); // default Karachi / Meezan
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let resizeObserver: ResizeObserver;
    let animId: number;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 280;
    const aspect = height > 0 ? width / height : 16 / 9;

    try {
      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
      camera.position.set(0, 0, 5.2);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner wireframe sphere
    const sphereGeom = new THREE.SphereGeometry(1.7, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x635bff,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    globeGroup.add(sphere);

    // Lat/Long to Vector3 helper on sphere of radius r
    const latLngToVector = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Bank Hub Markers
    const markersGroup = new THREE.Group();
    const nodeVectors: THREE.Vector3[] = [];

    GLOBAL_HUBS.forEach((hub) => {
      const pos = latLngToVector(hub.lat, hub.lng, 1.72);
      nodeVectors.push(pos);

      // Marker pin
      const markerGeom = new THREE.SphereGeometry(0.045, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x18c8b5 });
      const markerMesh = new THREE.Mesh(markerGeom, markerMat);
      markerMesh.position.copy(pos);
      markersGroup.add(markerMesh);

      // Marker pulse halo
      const haloGeom = new THREE.RingGeometry(0.06, 0.08, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x8fe3b0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const haloMesh = new THREE.Mesh(haloGeom, haloMat);
      haloMesh.position.copy(pos);
      haloMesh.lookAt(0, 0, 0);
      markersGroup.add(haloMesh);
    });

    globeGroup.add(markersGroup);

    // Connecting Bezier Arcs between Financial Hubs
    for (let i = 0; i < nodeVectors.length; i++) {
      const nextIdx = (i + 1) % nodeVectors.length;
      const v1 = nodeVectors[i];
      const v2 = nodeVectors[nextIdx];

      // Calculate midpoint elevated above surface for an arc
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const dist = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(1.7 + dist * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(32);
      const curveGeom = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x18c8b5 : 0xa78bfa,
        transparent: true,
        opacity: 0.55
      });
      const arc = new THREE.Line(curveGeom, curveMat);
      globeGroup.add(arc);
    }

    // Outer atmospheric halo
    const atmosGeom = new THREE.SphereGeometry(1.85, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x18c8b5,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const atmos = new THREE.Mesh(atmosGeom, atmosMat);
    globeGroup.add(atmos);

    // Initial globe tilt
    globeGroup.rotation.x = 0.3;
    globeGroup.rotation.y = 1.2;

    let animId: number;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    // Resize observer
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

    // Drag rotation
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      globeGroup.rotation.y += dx * 0.008;
      globeGroup.rotation.x += dy * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

      return () => {
        if (animId) cancelAnimationFrame(animId);
        if (resizeObserver) resizeObserver.disconnect();
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        try {
          if (renderer) renderer.dispose();
          if (scene) scene.clear();
        } catch {}
      };
    } catch (err) {
      console.warn('ThreeGlobalGlobe WebGL init note:', err);
      setWebGLFailed(true);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[260px] sm:h-[300px] rounded-[20px] bg-gradient-to-br from-[#181842] via-[#0E1230] to-[#080B1F] border border-white/10 p-4 shadow-xl overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing ${webGLFailed ? 'hidden' : 'block'}`}
      />

      {/* Fallback CSS 3D Animated Globe if WebGL fails */}
      {webGLFailed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#18C8B5]/30 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-4 rounded-full border border-dashed border-[#635BFF]/40 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#18C8B5]/20 to-[#635BFF]/30 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Globe className="w-10 h-10 text-[#18C8B5] animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Top Overlay */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#8FE3B0]">
            <Globe className="w-3.5 h-3.5" />
            <span>3D Liquidity Mesh</span>
          </div>
          <h5 className="font-heading text-sm font-bold text-white mt-0.5">
            Global Custody & Escrow Nodes
          </h5>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#18C8B5]/20 text-[#8FE3B0] border border-[#18C8B5]/30">
          6 Nodes Active
        </span>
      </div>

      {/* Bottom Hub Selector */}
      <div className="relative z-10 pt-2 pointer-events-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = selectedHub.city === hub.city;
            return (
              <button
                key={hub.city}
                onClick={() => setSelectedHub(hub)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#18C8B5]/20 text-[#8FE3B0] border-[#18C8B5]/50 shadow-sm'
                    : 'bg-black/40 text-[#89A0AF] border-white/10 hover:text-white'
                }`}
              >
                {hub.city} ({hub.latency})
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] font-mono bg-black/40 backdrop-blur-sm p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-1.5 text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-[#18C8B5]" />
            <span>{selectedHub.name} ({selectedHub.city})</span>
          </div>
          <span className="text-[#8FE3B0] flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#F59E0B]" />
            {selectedHub.latency} Clearing Latency
          </span>
        </div>
      </div>
    </div>
  );
};
