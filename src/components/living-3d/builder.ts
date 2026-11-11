import * as THREE from 'three';
import { LivingObjectId } from './types';

export interface LivingObject3DInstance {
  id: LivingObjectId;
  group: THREE.Group;
  hitBox: THREE.Mesh;
  update: (time: number, isFocused: boolean, stage: number, mouse: { x: number; y: number }) => void;
  resetFocus: () => void;
}

export function createMaterials() {
  const champagneGlass = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xfcf6eb),
    roughness: 0.12,
    metalness: 0.05,
    transmission: 0.88,
    thickness: 0.5,
    transparent: true,
    opacity: 0.9,
    ior: 1.45,
    reflectivity: 0.6,
  });

  const brushedGold = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xd4af37),
    metalness: 0.9,
    roughness: 0.22,
  });

  const softBronze = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x9a7b4f),
    metalness: 0.82,
    roughness: 0.32,
  });

  const warmLimestone = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xeee9df),
    roughness: 0.75,
    metalness: 0.05,
    flatShading: true,
  });

  const ceramicIvory = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xfaf7f0),
    roughness: 0.4,
    metalness: 0.1,
  });

  const crystalPrismMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xebf5ee),
    roughness: 0.08,
    metalness: 0.1,
    transmission: 0.92,
    thickness: 0.7,
    transparent: true,
    opacity: 0.88,
    ior: 1.55,
    clearcoat: 1.0,
  });

  return {
    champagneGlass,
    brushedGold,
    softBronze,
    warmLimestone,
    ceramicIvory,
    crystalPrismMat,
  };
}

export function buildKnowledgeOrb(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'knowledge-orb';

  // Delicate scale
  const baseScale = 0.38;
  group.scale.set(baseScale, baseScale, baseScale);

  // Core glass sphere
  const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const sphere = new THREE.Mesh(sphereGeo, mats.champagneGlass);
  group.add(sphere);

  // Inner floating particle swarm
  const particleCount = 45;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 0.32 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePos[i] = r * Math.sin(phi) * Math.cos(theta);
    particlePos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePos[i + 2] = r * Math.cos(phi);
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xe8c872,
    size: 0.035,
    transparent: true,
    opacity: 0.85,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // Gimbal orbital rings
  const ringGeo1 = new THREE.TorusGeometry(0.72, 0.014, 16, 64);
  const ring1 = new THREE.Mesh(ringGeo1, mats.brushedGold);
  ring1.rotation.x = Math.PI / 4;
  group.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(0.85, 0.012, 16, 64);
  const ring2 = new THREE.Mesh(ringGeo2, mats.softBronze);
  ring2.rotation.y = Math.PI / 3;
  group.add(ring2);

  const hitBoxGeo = new THREE.SphereGeometry(1.2, 12, 12);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.userData = { id: 'knowledge-orb' };
  group.add(hitBox);

  return {
    id: 'knowledge-orb',
    group,
    hitBox,
    update: (time, isFocused, stage, mouse) => {
      if (isFocused) {
        group.rotation.y += 0.008;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, mouse.y * 0.3, 0.05);
        ring1.rotation.z += 0.015;
        ring2.rotation.x += 0.012;
        particles.rotation.y += 0.02;
        const targetScale = baseScale * (stage >= 2 ? 1.4 : 1.2);
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.y += 0.006;
        group.rotation.x = Math.sin(time * 0.8) * 0.15 + mouse.y * 0.08;
        group.rotation.z = Math.cos(time * 0.6) * 0.1 + mouse.x * 0.08;
        ring1.rotation.x += 0.008;
        ring2.rotation.y -= 0.006;
        particles.rotation.y += 0.008;
        group.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(baseScale, baseScale, baseScale);
    },
  };
}

export function buildEvidencePrism(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'evidence-prism';

  const baseScale = 0.36;
  group.scale.set(baseScale, baseScale, baseScale);

  const slices: THREE.Mesh[] = [];
  const sliceHeights = [0.32, 0.4, 0.32];
  const sliceOffsets = [-0.38, 0, 0.38];

  for (let i = 0; i < 3; i++) {
    const geo = new THREE.CylinderGeometry(0.44 - i * 0.03, 0.5 - i * 0.03, sliceHeights[i], 6);
    const mesh = new THREE.Mesh(geo, mats.crystalPrismMat);
    mesh.position.y = sliceOffsets[i];
    group.add(mesh);
    slices.push(mesh);

    if (i < 2) {
      const ringGeo = new THREE.TorusGeometry(0.48 - i * 0.03, 0.01, 8, 32);
      const ring = new THREE.Mesh(ringGeo, mats.brushedGold);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = sliceOffsets[i] + sliceHeights[i] / 2;
      group.add(ring);
    }
  }

  const coreGeo = new THREE.OctahedronGeometry(0.16, 0);
  const core = new THREE.Mesh(coreGeo, mats.brushedGold);
  group.add(core);

  const hitBoxGeo = new THREE.BoxGeometry(1.4, 1.8, 1.4);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.userData = { id: 'evidence-prism' };
  group.add(hitBox);

  return {
    id: 'evidence-prism',
    group,
    hitBox,
    update: (time, isFocused, stage) => {
      if (isFocused) {
        group.rotation.y += 0.005;
        const spread = stage >= 2 ? 0.3 : 0.12;
        slices[0].position.y = THREE.MathUtils.lerp(slices[0].position.y, sliceOffsets[0] - spread, 0.05);
        slices[1].position.y = THREE.MathUtils.lerp(slices[1].position.y, 0, 0.05);
        slices[2].position.y = THREE.MathUtils.lerp(slices[2].position.y, sliceOffsets[2] + spread, 0.05);
        core.rotation.x += 0.03;
        core.rotation.y += 0.02;
        const targetScale = baseScale * 1.35;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.y += 0.007;
        group.rotation.x = Math.sin(time * 0.7) * 0.12;
        group.rotation.z = Math.cos(time * 0.5) * 0.08;
        slices[0].position.y = THREE.MathUtils.lerp(slices[0].position.y, sliceOffsets[0], 0.05);
        slices[1].position.y = THREE.MathUtils.lerp(slices[1].position.y, 0, 0.05);
        slices[2].position.y = THREE.MathUtils.lerp(slices[2].position.y, sliceOffsets[2], 0.05);
        core.rotation.y += 0.01;
        group.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.05);
      }
    },
    resetFocus: () => {
      slices[0].position.y = sliceOffsets[0];
      slices[1].position.y = 0;
      slices[2].position.y = sliceOffsets[2];
      group.scale.set(baseScale, baseScale, baseScale);
    },
  };
}

export function buildResearchCompass(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'research-compass';

  const baseScale = 0.36;
  group.scale.set(baseScale, baseScale, baseScale);

  const bezelGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.09, 36);
  const bezel = new THREE.Mesh(bezelGeo, mats.brushedGold);
  bezel.rotation.x = Math.PI / 2;
  group.add(bezel);

  const dialGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.035, 36);
  const dial = new THREE.Mesh(dialGeo, mats.ceramicIvory);
  dial.rotation.x = Math.PI / 2;
  dial.position.z = 0.035;
  group.add(dial);

  const needleGroup = new THREE.Group();
  needleGroup.position.z = 0.07;

  const northGeo = new THREE.ConeGeometry(0.08, 0.48, 4);
  const north = new THREE.Mesh(northGeo, mats.brushedGold);
  north.position.y = 0.24;
  needleGroup.add(north);

  const southGeo = new THREE.ConeGeometry(0.08, 0.48, 4);
  const south = new THREE.Mesh(southGeo, mats.softBronze);
  south.position.y = -0.24;
  south.rotation.z = Math.PI;
  needleGroup.add(south);

  const pivotGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16);
  const pivot = new THREE.Mesh(pivotGeo, mats.brushedGold);
  pivot.rotation.x = Math.PI / 2;
  needleGroup.add(pivot);

  group.add(needleGroup);

  const hitBoxGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.4, 16);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.rotation.x = Math.PI / 2;
  hitBox.userData = { id: 'research-compass' };
  group.add(hitBox);

  return {
    id: 'research-compass',
    group,
    hitBox,
    update: (time, isFocused, stage) => {
      if (isFocused) {
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.2, 0.05);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, 0.05);
        const targetNeedleAngle = stage >= 2 ? Math.PI * 0.75 : Math.sin(time * 6) * 0.4;
        needleGroup.rotation.z = THREE.MathUtils.lerp(needleGroup.rotation.z, targetNeedleAngle, 0.08);
        const targetScale = baseScale * 1.35;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.x = Math.sin(time * 0.6) * 0.25 + 0.3;
        group.rotation.y = Math.cos(time * 0.5) * 0.2;
        group.rotation.z = Math.sin(time * 0.4) * 0.1;
        needleGroup.rotation.z = Math.sin(time * 2.2) * 0.35 + Math.sin(time * 0.8) * 0.8;
        group.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(baseScale, baseScale, baseScale);
    },
  };
}

export function buildKnowledgeFragment(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'knowledge-fragment';

  const baseScale = 0.36;
  group.scale.set(baseScale, baseScale, baseScale);

  const bodyGeo = new THREE.IcosahedronGeometry(0.55, 0);
  const body = new THREE.Mesh(bodyGeo, mats.warmLimestone);
  group.add(body);

  const wireGeo = new THREE.WireframeGeometry(bodyGeo);
  const wireMat = new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 1.5 });
  const wire = new THREE.LineSegments(wireGeo, wireMat);
  group.add(wire);

  const innerGeo = new THREE.OctahedronGeometry(0.2, 0);
  const inner = new THREE.Mesh(innerGeo, mats.brushedGold);
  group.add(inner);

  const hitBoxGeo = new THREE.SphereGeometry(1.1, 12, 12);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.userData = { id: 'knowledge-fragment' };
  group.add(hitBox);

  return {
    id: 'knowledge-fragment',
    group,
    hitBox,
    update: (time, isFocused, stage) => {
      if (isFocused) {
        group.rotation.y += 0.005;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.1, 0.05);
        inner.rotation.y += 0.02;
        inner.rotation.z += 0.015;
        const breath = Math.sin(time * 4) * 0.04;
        const targetScale = baseScale * (stage >= 2 ? 1.35 : 1.2) + breath;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.x += 0.005;
        group.rotation.y += 0.008;
        group.rotation.z = Math.sin(time * 0.7) * 0.15;
        inner.rotation.y += 0.01;
        group.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(baseScale, baseScale, baseScale);
    },
  };
}

export function buildTimeCapsule(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'time-capsule';

  const baseScale = 0.36;
  group.scale.set(baseScale, baseScale, baseScale);

  const topBulbGeo = new THREE.ConeGeometry(0.44, 0.5, 24);
  const topBulb = new THREE.Mesh(topBulbGeo, mats.champagneGlass);
  topBulb.position.y = 0.28;
  topBulb.rotation.x = Math.PI;
  group.add(topBulb);

  const botBulbGeo = new THREE.ConeGeometry(0.44, 0.5, 24);
  const botBulb = new THREE.Mesh(botBulbGeo, mats.champagneGlass);
  botBulb.position.y = -0.28;
  group.add(botBulb);

  const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.06, 24);
  const topCap = new THREE.Mesh(capGeo, mats.brushedGold);
  topCap.position.y = 0.55;
  group.add(topCap);

  const botCap = new THREE.Mesh(capGeo, mats.brushedGold);
  botCap.position.y = -0.55;
  group.add(botCap);

  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const colGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.1, 8);
    const col = new THREE.Mesh(colGeo, mats.softBronze);
    col.position.x = Math.cos(angle) * 0.4;
    col.position.z = Math.sin(angle) * 0.4;
    group.add(col);
  }

  const sandCount = 45;
  const sandGeo = new THREE.BufferGeometry();
  const sandPos = new Float32Array(sandCount * 3);
  for (let i = 0; i < sandCount * 3; i += 3) {
    sandPos[i] = (Math.random() - 0.5) * 0.12;
    sandPos[i + 1] = (Math.random() - 0.5) * 0.5;
    sandPos[i + 2] = (Math.random() - 0.5) * 0.12;
  }
  sandGeo.setAttribute('position', new THREE.BufferAttribute(sandPos, 3));
  const sandMat = new THREE.PointsMaterial({
    color: 0xe5c158,
    size: 0.03,
    transparent: true,
    opacity: 0.9,
  });
  const sand = new THREE.Points(sandGeo, sandMat);
  group.add(sand);

  const hitBoxGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.3, 16);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.userData = { id: 'time-capsule' };
  group.add(hitBox);

  return {
    id: 'time-capsule',
    group,
    hitBox,
    update: (time, isFocused, stage) => {
      if (isFocused) {
        const targetRotZ = stage >= 2 ? Math.PI : 0;
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotZ, 0.04);
        group.rotation.y += 0.01;
        sand.rotation.y += 0.03;
        const targetScale = baseScale * 1.35;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.y += 0.007;
        group.rotation.x = Math.sin(time * 0.8) * 0.15;
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, 0.05);
        sand.rotation.y += 0.01;
        group.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.05);
      }
    },
    resetFocus: () => {
      group.rotation.z = 0;
      group.scale.set(baseScale, baseScale, baseScale);
    },
  };
}

export function buildExplorerMountain(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'explorer';

  const baseScale = 0.36;
  group.scale.set(baseScale, baseScale, baseScale);

  const tierHeights = [0.18, 0.18, 0.18, 0.18];
  const tierRadii = [0.65, 0.48, 0.34, 0.22];

  let currentY = -0.3;
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.CylinderGeometry(tierRadii[i] * 0.8, tierRadii[i], tierHeights[i], 6);
    const mesh = new THREE.Mesh(geo, mats.warmLimestone);
    mesh.position.y = currentY + tierHeights[i] / 2;
    group.add(mesh);
    currentY += tierHeights[i];
  }

  const summitGeo = new THREE.ConeGeometry(0.16, 0.24, 4);
  const summit = new THREE.Mesh(summitGeo, mats.brushedGold);
  summit.position.y = currentY + 0.12;
  group.add(summit);

  const satGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const sat = new THREE.Mesh(satGeo, mats.brushedGold);
  group.add(sat);

  const hitBoxGeo = new THREE.ConeGeometry(0.9, 1.4, 8);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.position.y = 0.1;
  hitBox.userData = { id: 'explorer' };
  group.add(hitBox);

  return {
    id: 'explorer',
    group,
    hitBox,
    update: (time, isFocused, stage) => {
      const satAngle = time * 2;
      sat.position.x = Math.cos(satAngle) * 0.7;
      sat.position.z = Math.sin(satAngle) * 0.7;
      sat.position.y = Math.sin(time * 3) * 0.12 + 0.25;

      if (isFocused) {
        group.rotation.y += 0.008;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.2, 0.05);
        const targetScale = baseScale * (stage >= 2 ? 1.35 : 1.2);
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.y += 0.005;
        group.rotation.x = Math.sin(time * 0.7) * 0.12;
        group.rotation.z = Math.cos(time * 0.6) * 0.08;
        group.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(baseScale, baseScale, baseScale);
    },
  };
}

export function buildContinuousGoldenRibbon(scene: THREE.Scene, mats: ReturnType<typeof createMaterials>) {
  // Graceful 3D CatmullRom spline weaving behind sections with negative Z coordinates
  // so it never obstructs or comes in front of any content
  const curvePoints = [
    new THREE.Vector3(4.8, 2.5, -2.5),    // Hero right high (near mountain)
    new THREE.Vector3(2.2, 1.2, -1.8),    // Hero mid
    new THREE.Vector3(-4.8, -0.6, -2.8),  // Journey left gutter
    new THREE.Vector3(-1.8, -2.6, -2.2),  // Journey center behind cards
    new THREE.Vector3(5.2, -4.8, -2.5),   // Product Demo right gutter
    new THREE.Vector3(1.8, -7.2, -2.0),   // Intelligence Core center behind cards
    new THREE.Vector3(-4.8, -9.6, -2.8),  // Intelligence Core left gutter
    new THREE.Vector3(3.2, -12.0, -2.2),  // Learning Ecosystem right gutter
    new THREE.Vector3(-1.2, -14.4, -2.5), // Security center behind cards
    new THREE.Vector3(4.5, -16.8, -3.0),  // Final CTA horizon
  ];

  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const tubeGeo = new THREE.TubeGeometry(curve, 220, 0.016, 8, false);
  const ribbonMesh = new THREE.Mesh(tubeGeo, mats.brushedGold);
  scene.add(ribbonMesh);

  // 18 delicate floating golden beads (small luxury pearls, radius 0.048)
  const beadCount = 18;
  const beadGeo = new THREE.SphereGeometry(0.048, 16, 16);
  const beads: THREE.Mesh[] = [];

  for (let i = 0; i < beadCount; i++) {
    const bead = new THREE.Mesh(beadGeo, mats.brushedGold);
    scene.add(bead);
    beads.push(bead);
  }

  return {
    ribbonMesh,
    beads,
    curve,
    update: (time: number) => {
      for (let i = 0; i < beadCount; i++) {
        const offset = i / beadCount;
        const t = (time * 0.02 + offset) % 1.0;
        const point = curve.getPointAt(t);
        beads[i].position.copy(point);
      }
    },
  };
}
