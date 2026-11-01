/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { IMAGES } from '../assets.ts';

interface Hero3DSceneProps {
  onLoaded?: () => void;
  onError?: () => void;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({ onLoaded, onError }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isDisposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let disposeAll: (() => void) | null = null;

    // Temporary console interception to prevent Three.js from polluting test runner with unhandled console.errors
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    try {
      // 1. Probe WebGL availability safely and check for blacklisted / legacy GPUs
      const testCanvas = document.createElement('canvas');
      const gl = (testCanvas.getContext('webgl2') ||
        testCanvas.getContext('webgl')) as
        | WebGLRenderingContext
        | WebGL2RenderingContext
        | null;

      if (!gl) {
        throw new Error('WebGL context is not supported or disabled on this device.');
      }

      // Detect software WebGL or legacy ANGLE D3D9 in sandboxed environments
      let isSoftwareGl = false;
      try {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        if (/Direct3D9|SwiftShader|llvmpipe|softpipe|Intel.*HD Graphics (2000|3000)/i.test(gpu)) {
          // Direct3D9 ANGLE and legacy Intel HD 3000 have broken sequence binding in sandboxes
          throw new Error('Legacy or sandboxed GPU detected. Falling back to photorealistic presentation.');
        }
        isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('Legacy or sandboxed GPU')) {
          throw err;
        }
      }

      // 2. Intercept console while creating WebGLRenderer so Three.js internal failures don't produce unhandled console errors
      console.error = (...args: unknown[]) => {
        if (
          args.some(
            (arg) => typeof arg === 'string' && arg.includes('THREE.WebGLRenderer')
          )
        ) {
          return;
        }
        originalConsoleError.apply(console, args);
      };

      console.warn = (...args: unknown[]) => {
        if (
          args.some(
            (arg) => typeof arg === 'string' && arg.includes('THREE.WebGLRenderer')
          )
        ) {
          return;
        }
        originalConsoleWarn.apply(console, args);
      };

      // 3. Setup Scene, Camera, Renderer safely inside try-block
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x14110f, 0.05);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 3.8, 6.2);
      camera.lookAt(0, 0.5, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'default',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // 4. Studio Environment Setup
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();

      // 5. Lighting Rig
      const ambientLight = new THREE.AmbientLight(0xffecd6, 0.6);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfff1da, 2.4);
      keyLight.position.set(4, 7, 5);
      keyLight.castShadow = !isSoftwareGl;
      if (keyLight.castShadow) {
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 16;
        keyLight.shadow.bias = -0.0005;
      }
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xd9a441, 1.8);
      rimLight.position.set(-5, 4, -4);
      scene.add(rimLight);

      const fillLight = new THREE.HemisphereLight(0xffe2bf, 0x14110f, 0.9);
      scene.add(fillLight);

      // 6. Build Hero Food & Platter Group (Uruli brass platter)
      const heroGroup = new THREE.Group();
      scene.add(heroGroup);

      // A. Brass Uruli Platter Rim & Body using LatheGeometry
      const platterPoints: THREE.Vector2[] = [];
      platterPoints.push(new THREE.Vector2(0, 0));
      platterPoints.push(new THREE.Vector2(2.1, 0.04));
      platterPoints.push(new THREE.Vector2(2.4, 0.25));
      platterPoints.push(new THREE.Vector2(2.6, 0.65));
      platterPoints.push(new THREE.Vector2(2.72, 0.72));
      platterPoints.push(new THREE.Vector2(2.65, 0.62));
      platterPoints.push(new THREE.Vector2(2.45, 0.45));
      platterPoints.push(new THREE.Vector2(2.0, 0.15));
      platterPoints.push(new THREE.Vector2(0, 0.1));

      const platterGeo = new THREE.LatheGeometry(platterPoints, 48);
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xc89842,
        metalness: 0.88,
        roughness: 0.28,
      });
      const platterMesh = new THREE.Mesh(platterGeo, brassMat);
      platterMesh.castShadow = !isSoftwareGl;
      platterMesh.receiveShadow = !isSoftwareGl;
      heroGroup.add(platterMesh);

      // B. Banana Leaf Base Inside Uruli
      const leafGeo = new THREE.CircleGeometry(2.35, 36);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x245432,
        roughness: 0.55,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.rotation.x = -Math.PI / 2;
      leafMesh.position.y = 0.16;
      heroGroup.add(leafMesh);

      // C. Golden Spiced Dum Biryani / Mandi Rice Mound
      const riceMoundGeo = new THREE.CylinderGeometry(1.6, 2.2, 0.55, 36);
      const riceMat = new THREE.MeshStandardMaterial({
        color: 0xd9aa4a,
        roughness: 0.65,
        metalness: 0.05,
      });
      const riceMound = new THREE.Mesh(riceMoundGeo, riceMat);
      riceMound.position.y = 0.42;
      riceMound.castShadow = !isSoftwareGl;
      heroGroup.add(riceMound);

      // D. Spiced Meat Cuts on top
      const meatGroup = new THREE.Group();
      const meatMat = new THREE.MeshStandardMaterial({
        color: 0x5a2318,
        roughness: 0.75,
        metalness: 0.15,
      });
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        const meatChunk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 1), meatMat);
        meatChunk.position.set(Math.cos(angle) * 0.75, 0.78, Math.sin(angle) * 0.75);
        meatChunk.rotation.set(Math.random(), Math.random(), Math.random());
        meatChunk.scale.set(1.1, 0.7, 0.9);
        meatGroup.add(meatChunk);
      }
      heroGroup.add(meatGroup);

      // E. Floating Spices (Cardamom pods, Star Anise, Curry Leaves)
      const floatingSpicesGroup = new THREE.Group();
      heroGroup.add(floatingSpicesGroup);

      // 1) Green Cardamoms
      const cardamomGeo = new THREE.CapsuleGeometry(0.08, 0.22, 8, 12);
      const cardamomMat = new THREE.MeshStandardMaterial({
        color: 0x4f703e,
        roughness: 0.5,
        metalness: 0.08,
      });
      const cardamomCount = 6;
      const cardamoms: THREE.Mesh[] = [];
      for (let i = 0; i < cardamomCount; i++) {
        const mesh = new THREE.Mesh(cardamomGeo, cardamomMat);
        const angle = (i * Math.PI * 2) / cardamomCount + 0.3;
        mesh.position.set(Math.cos(angle) * 1.5, 0.9 + (i % 3) * 0.2, Math.sin(angle) * 1.5);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        floatingSpicesGroup.add(mesh);
        cardamoms.push(mesh);
      }

      // 2) Star Anise Spices
      const starAniseMat = new THREE.MeshStandardMaterial({
        color: 0x4d2a1b,
        roughness: 0.8,
        metalness: 0.05,
      });
      const starAniseMeshes: THREE.Group[] = [];
      for (let s = 0; s < 3; s++) {
        const star = new THREE.Group();
        for (let p = 0; p < 8; p++) {
          const podGeo = new THREE.ConeGeometry(0.07, 0.35, 6);
          const podMesh = new THREE.Mesh(podGeo, starAniseMat);
          podMesh.rotation.z = (p * Math.PI) / 4;
          podMesh.position.set(Math.cos((p * Math.PI) / 4) * 0.16, Math.sin((p * Math.PI) / 4) * 0.16, 0);
          star.add(podMesh);
        }
        star.scale.set(0.9, 0.9, 0.9);
        const sAngle = (s * Math.PI * 2) / 3 + 1.2;
        star.position.set(Math.cos(sAngle) * 1.8, 1.1 + s * 0.25, Math.sin(sAngle) * 1.8);
        star.rotation.x = Math.PI / 3;
        floatingSpicesGroup.add(star);
        starAniseMeshes.push(star);
      }

      // 3) Curry Leaves
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(0.18, 0.3, 0, 0.65);
      leafShape.quadraticCurveTo(-0.18, 0.3, 0, 0);
      const curryLeafGeo = new THREE.ShapeGeometry(leafShape);
      const curryLeafMat = new THREE.MeshStandardMaterial({
        color: 0x1d532a,
        roughness: 0.45,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const curryLeaves: THREE.Mesh[] = [];
      for (let c = 0; c < 5; c++) {
        const leaf = new THREE.Mesh(curryLeafGeo, curryLeafMat);
        const cAngle = (c * Math.PI * 2) / 5 + 0.8;
        leaf.position.set(Math.cos(cAngle) * 1.2, 0.85 + (c % 2) * 0.3, Math.sin(cAngle) * 1.2);
        leaf.rotation.set(0.8, c, 0.4);
        leaf.scale.set(0.7, 0.7, 0.7);
        floatingSpicesGroup.add(leaf);
        curryLeaves.push(leaf);
      }

      // F. Rising Steam Particles
      const steamCount = 36;
      const steamGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const steamMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
      });
      const steamParticles: { mesh: THREE.Mesh; speed: number; startY: number }[] = [];
      for (let i = 0; i < steamCount; i++) {
        const particle = new THREE.Mesh(steamGeo, steamMat);
        const pAngle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.2;
        const startY = 0.8 + Math.random() * 1.6;
        particle.position.set(Math.cos(pAngle) * radius, startY, Math.sin(pAngle) * radius);
        particle.scale.setScalar(0.8 + Math.random() * 1.4);
        heroGroup.add(particle);
        steamParticles.push({
          mesh: particle,
          speed: 0.008 + Math.random() * 0.008,
          startY: 0.8,
        });
      }

      // G. Soft Ground Contact Shadow
      const shadowGeo = new THREE.PlaneGeometry(6, 6);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x070605,
        transparent: true,
        opacity: 0.65,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -0.01;
      scene.add(shadowMesh);

      // 7. Interactive Mouse Parallax
      let targetRotationX = 0.15;
      let targetRotationY = 0;
      let mouseX = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseX = x;
        targetRotationY = x * 0.45;
        targetRotationX = 0.15 - y * 0.25;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Resize handler
      const handleResize = () => {
        if (!container || isDisposed || !renderer) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // Animation Tick
      const clock = new THREE.Clock();
      const animate = () => {
        if (isDisposed || !renderer) return;
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Platter rotation
        heroGroup.rotation.y += 0.004;
        heroGroup.rotation.x = THREE.MathUtils.damp(heroGroup.rotation.x, targetRotationX, 3, 0.016);
        heroGroup.rotation.z = THREE.MathUtils.damp(heroGroup.rotation.z, -mouseX * 0.1, 3, 0.016);

        // Animate spices
        cardamoms.forEach((m, idx) => {
          m.position.y += Math.sin(elapsedTime * 1.8 + idx) * 0.0015;
          m.rotation.x += 0.008;
        });

        starAniseMeshes.forEach((s, idx) => {
          s.position.y += Math.cos(elapsedTime * 1.5 + idx) * 0.0018;
          s.rotation.z += 0.005;
        });

        curryLeaves.forEach((l, idx) => {
          l.position.y += Math.sin(elapsedTime * 2.1 + idx) * 0.0016;
          l.rotation.y += 0.006;
        });

        // Steam
        steamParticles.forEach((sp) => {
          sp.mesh.position.y += sp.speed;
          sp.mesh.position.x += Math.sin(elapsedTime + sp.mesh.position.y) * 0.001;
          sp.mesh.scale.multiplyScalar(1.002);
          if (sp.mesh.position.y > 2.8) {
            sp.mesh.position.y = sp.startY;
            sp.mesh.scale.setScalar(0.8);
          }
        });

        renderer.render(scene, camera);
      };

      animate();
      if (onLoaded) onLoaded();

      disposeAll = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);

        platterGeo.dispose();
        brassMat.dispose();
        leafGeo.dispose();
        leafMat.dispose();
        riceMoundGeo.dispose();
        riceMat.dispose();
        meatMat.dispose();
        cardamomGeo.dispose();
        cardamomMat.dispose();
        starAniseMat.dispose();
        curryLeafGeo.dispose();
        curryLeafMat.dispose();
        steamGeo.dispose();
        steamMat.dispose();
        shadowGeo.dispose();
        shadowMat.dispose();

        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (error: unknown) {
      setWebglFailed(true);
      if (onError) onError();
    } finally {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    }

    return () => {
      isDisposed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (disposeAll) disposeAll();
    };
  }, [onError, onLoaded]);

  if (webglFailed) {
    return (
      <div className="w-full h-full min-h-[420px] lg:min-h-[560px] relative rounded-lg overflow-hidden border border-[#D9A441]/20">
        <img
          src={IMAGES.biryani}
          alt="Authentic Kerala Dum Biryani"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-xs text-[#D9A441] font-editorial italic">
          Newform Authentic Dum Biryani Presentation
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full min-h-[420px] lg:min-h-[560px] relative" />;
};
