'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLivingWorld } from './LivingWorldContext';
import {
  createMaterials,
  buildKnowledgeOrb,
  buildEvidencePrism,
  buildResearchCompass,
  buildKnowledgeFragment,
  buildTimeCapsule,
  buildExplorerMountain,
  buildContinuousGoldenRibbon,
  LivingObject3DInstance,
} from './builder';
import { LivingObjectId } from './types';

// Spatial anchors placed in the open margins and deep in Z (-2.0)
// so they stay behind cards, text, and interactive elements
const OBJECT_BASE_POSITIONS: Record<LivingObjectId, THREE.Vector3> = {
  'knowledge-orb': new THREE.Vector3(4.5, 2.2, -2.0),      // Hero right margin
  'research-compass': new THREE.Vector3(-4.8, -1.8, -2.2),  // Research Journey left margin
  'knowledge-fragment': new THREE.Vector3(5.0, -5.2, -2.0), // Product Demo right margin
  'evidence-prism': new THREE.Vector3(-5.0, -8.6, -2.2),    // Intelligence Core left margin
  'time-capsule': new THREE.Vector3(4.8, -12.2, -2.0),      // Learning Ecosystem right margin
  'explorer': new THREE.Vector3(-4.6, -15.4, -2.2),         // Security & Solutions left margin
};

export default function LivingWorldCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeObjectId, currentStage, selectObject } = useLivingWorld();

  const activeObjRef = useRef<LivingObjectId | null>(null);
  const currentStageRef = useRef<number>(1);

  useEffect(() => {
    activeObjRef.current = activeObjectId;
  }, [activeObjectId]);

  useEffect(() => {
    currentStageRef.current = currentStage;
  }, [currentStage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2.0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.4);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffedd0, 2.2);
    mainSun.position.set(6, 12, 8);
    scene.add(mainSun);

    const fillLight = new THREE.DirectionalLight(0xdceae3, 0.9);
    fillLight.position.set(-6, -4, -4);
    scene.add(fillLight);

    // 3. Materials & Procedural Object Construction
    const mats = createMaterials();

    const objects: LivingObject3DInstance[] = [
      buildKnowledgeOrb(mats),
      buildEvidencePrism(mats),
      buildResearchCompass(mats),
      buildKnowledgeFragment(mats),
      buildTimeCapsule(mats),
      buildExplorerMountain(mats),
    ];

    const hitBoxes: THREE.Mesh[] = [];
    objects.forEach((obj) => {
      const base = OBJECT_BASE_POSITIONS[obj.id];
      obj.group.position.copy(base);
      scene.add(obj.group);
      hitBoxes.push(obj.hitBox);
    });

    // 4. Continuous Golden Ribbon & Floating Beads (in background behind content)
    const ribbon = buildContinuousGoldenRibbon(scene, mats);

    // 5. Scroll and Mouse Tracking
    let targetCameraY = 2.0;
    const mouse = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updateCameraFromScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      const scrollRatio = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

      // Map scroll down 18 world units to seamlessly track with landing page sections
      targetCameraY = 2.0 - scrollRatio * 18.5;
    };

    updateCameraFromScroll();

    const handleScroll = () => {
      updateCameraFromScroll();
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      pointer.x = mouse.x;
      pointer.y = mouse.y;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(hitBoxes);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
      } else if (document.body.style.cursor === 'pointer') {
        document.body.style.cursor = 'default';
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(hitBoxes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const objId = hit.userData?.id as LivingObjectId;
        if (objId) {
          selectObject(objId);
        }
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation towards scroll target
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraY, 0.08);

      if (!prefersReducedMotion) {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.25, 0.05);
      }

      // Update golden ribbon beads
      ribbon.update(time);

      const currentActive = activeObjRef.current;
      const stage = currentStageRef.current;

      objects.forEach((obj, idx) => {
        const isFocused = currentActive === obj.id;
        const base = OBJECT_BASE_POSITIONS[obj.id];

        if (isFocused) {
          // Position beside the open experience panel, slightly forward
          const isMobile = window.innerWidth < 768;
          const targetX = isMobile ? 0 : -2.2;
          const targetY = camera.position.y + (isMobile ? 1.0 : 0);
          const targetZ = 3.5;

          obj.group.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08);
        } else {
          // Ambient roaming movement around base anchor in background
          if (!prefersReducedMotion) {
            const roamSpeedX = 0.4 + (idx % 3) * 0.12;
            const roamSpeedY = 0.6 + (idx % 2) * 0.15;
            const roamAmpX = 0.25;
            const roamAmpY = 0.2;

            const targetX = base.x + Math.sin(time * roamSpeedX + idx) * roamAmpX;
            const targetY = base.y + Math.cos(time * roamSpeedY + idx) * roamAmpY;
            const targetZ = base.z + Math.sin(time * 0.3 + idx) * 0.1;

            obj.group.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.06);
          } else {
            obj.group.position.copy(base);
          }
        }

        obj.update(time, isFocused, stage, mouse);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      document.body.style.cursor = 'default';

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectObject]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
