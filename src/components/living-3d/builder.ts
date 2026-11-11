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
    thickness: 0.6,
    transparent: true,
    opacity: 0.92,
    ior: 1.45,
    reflectivity: 0.6,
  });

  const brushedGold = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xd4af37),
    metalness: 0.85,
    roughness: 0.25,
  });

  const softBronze = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x9a7b4f),
    metalness: 0.8,
    roughness: 0.35,
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
    transmission: 0.9,
    thickness: 0.85,
    transparent: true,
    opacity: 0.9,
    ior: 1.58,
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

  // Core glass sphere
  const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
  const sphere = new THREE.Mesh(sphereGeo, mats.champagneGlass);
  group.add(sphere);

  // Inner floating particle swarm
  const particleCount = 70;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 0.35 * Math.cbrt(Math.random());
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
  const ringGeo1 = new THREE.TorusGeometry(0.78, 0.016, 16, 64);
  const ring1 = new THREE.Mesh(ringGeo1, mats.brushedGold);
  ring1.rotation.x = Math.PI / 4;
  group.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(0.92, 0.014, 16, 64);
  const ring2 = new THREE.Mesh(ringGeo2, mats.softBronze);
  ring2.rotation.y = Math.PI / 3;
  group.add(ring2);

  // Invisible hitBox for robust raycasting
  const hitBoxGeo = new THREE.SphereGeometry(1.05, 12, 12);
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
        const targetScale = stage >= 2 ? 1.25 : 1.1;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.y += 0.006;
        group.rotation.x = Math.sin(time * 0.8) * 0.15 + mouse.y * 0.1;
        group.rotation.z = Math.cos(time * 0.6) * 0.1 + mouse.x * 0.1;
        ring1.rotation.x += 0.008;
        ring2.rotation.y -= 0.006;
        particles.rotation.y += 0.008;
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(1, 1, 1);
    },
  };
}

export function buildEvidencePrism(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'evidence-prism';

  // 3 crystal prism slices that can separate on focus
  const slices: THREE.Mesh[] = [];
  const sliceHeights = [0.35, 0.45, 0.35];
  const sliceOffsets = [-0.42, 0, 0.42];

  for (let i = 0; i < 3; i++) {
    const geo = new THREE.CylinderGeometry(0.48 - i * 0.04, 0.54 - i * 0.04, sliceHeights[i], 6);
    const mesh = new THREE.Mesh(geo, mats.crystalPrismMat);
    mesh.position.y = sliceOffsets[i];
    mesh.castShadow = true;
    group.add(mesh);
    slices.push(mesh);

    // Subtle gold trim ring between slices
    if (i < 2) {
      const ringGeo = new THREE.TorusGeometry(0.52 - i * 0.04, 0.012, 8, 32);
      const ring = new THREE.Mesh(ringGeo, mats.brushedGold);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = sliceOffsets[i] + sliceHeights[i] / 2;
      group.add(ring);
    }
  }

  // Inner floating core
  const coreGeo = new THREE.OctahedronGeometry(0.18, 0);
  const core = new THREE.Mesh(coreGeo, mats.brushedGold);
  group.add(core);

  const hitBoxGeo = new THREE.BoxGeometry(1.2, 1.6, 1.2);
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
        // Explode slices outward in stage 2/3
        const spread = stage >= 2 ? 0.32 : 0.12;
        slices[0].position.y = THREE.MathUtils.lerp(slices[0].position.y, sliceOffsets[0] - spread, 0.05);
        slices[1].position.y = THREE.MathUtils.lerp(slices[1].position.y, 0, 0.05);
        slices[2].position.y = THREE.MathUtils.lerp(slices[2].position.y, sliceOffsets[2] + spread, 0.05);
        core.rotation.x += 0.03;
        core.rotation.y += 0.02;
        group.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.05);
      } else {
        group.rotation.y += 0.007;
        group.rotation.x = Math.sin(time * 0.7) * 0.12;
        group.rotation.z = Math.cos(time * 0.5) * 0.08;
        slices[0].position.y = THREE.MathUtils.lerp(slices[0].position.y, sliceOffsets[0], 0.05);
        slices[1].position.y = THREE.MathUtils.lerp(slices[1].position.y, 0, 0.05);
        slices[2].position.y = THREE.MathUtils.lerp(slices[2].position.y, sliceOffsets[2], 0.05);
        core.rotation.y += 0.01;
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    },
    resetFocus: () => {
      slices[0].position.y = sliceOffsets[0];
      slices[1].position.y = 0;
      slices[2].position.y = sliceOffsets[2];
      group.scale.set(1, 1, 1);
    },
  };
}

export function buildResearchCompass(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'research-compass';

  // Outer bezel
  const bezelGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.1, 40);
  const bezel = new THREE.Mesh(bezelGeo, mats.brushedGold);
  bezel.rotation.x = Math.PI / 2;
  group.add(bezel);

  // Inner dial
  const dialGeo = new THREE.CylinderGeometry(0.64, 0.64, 0.04, 40);
  const dial = new THREE.Mesh(dialGeo, mats.ceramicIvory);
  dial.rotation.x = Math.PI / 2;
  dial.position.z = 0.04;
  group.add(dial);

  // Compass Needle
  const needleGroup = new THREE.Group();
  needleGroup.position.z = 0.08;

  // North needle (gold)
  const northGeo = new THREE.ConeGeometry(0.09, 0.52, 4);
  const north = new THREE.Mesh(northGeo, mats.brushedGold);
  north.position.y = 0.26;
  needleGroup.add(north);

  // South needle (bronze)
  const southGeo = new THREE.ConeGeometry(0.09, 0.52, 4);
  const south = new THREE.Mesh(southGeo, mats.softBronze);
  south.position.y = -0.26;
  south.rotation.z = Math.PI;
  needleGroup.add(south);

  // Central brass pivot
  const pivotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
  const pivot = new THREE.Mesh(pivotGeo, mats.brushedGold);
  pivot.rotation.x = Math.PI / 2;
  needleGroup.add(pivot);

  group.add(needleGroup);

  const hitBoxGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 16);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.rotation.x = Math.PI / 2;
  hitBox.userData = { id: 'research-compass' };
  group.add(hitBox);

  let targetNeedleAngle = 0;

  return {
    id: 'research-compass',
    group,
    hitBox,
    update: (time, isFocused, stage) => {
      if (isFocused) {
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.2, 0.05);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, 0.05);
        // Needle snaps deliberately in stages
        targetNeedleAngle = stage >= 2 ? Math.PI * 0.75 : Math.sin(time * 6) * 0.4;
        needleGroup.rotation.z = THREE.MathUtils.lerp(needleGroup.rotation.z, targetNeedleAngle, 0.08);
        group.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.05);
      } else {
        group.rotation.x = Math.sin(time * 0.6) * 0.25 + 0.3;
        group.rotation.y = Math.cos(time * 0.5) * 0.2;
        group.rotation.z = Math.sin(time * 0.4) * 0.1;
        // Hunting needle wobble
        needleGroup.rotation.z = Math.sin(time * 2.2) * 0.35 + Math.sin(time * 0.8) * 0.8;
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(1, 1, 1);
    },
  };
}

export function buildKnowledgeFragment(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'knowledge-fragment';

  // Faceted icosahedron origami body
  const bodyGeo = new THREE.IcosahedronGeometry(0.62, 0);
  const body = new THREE.Mesh(bodyGeo, mats.warmLimestone);
  group.add(body);

  // Wireframe gold creases
  const wireGeo = new THREE.WireframeGeometry(bodyGeo);
  const wireMat = new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 1.5 });
  const wire = new THREE.LineSegments(wireGeo, wireMat);
  group.add(wire);

  // Inner floating crystalline kernel
  const innerGeo = new THREE.OctahedronGeometry(0.24, 0);
  const inner = new THREE.Mesh(innerGeo, mats.brushedGold);
  group.add(inner);

  const hitBoxGeo = new THREE.SphereGeometry(1.0, 12, 12);
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
        const breath = Math.sin(time * 4) * 0.05;
        const targetScale = (stage >= 2 ? 1.25 : 1.1) + breath;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.x += 0.005;
        group.rotation.y += 0.008;
        group.rotation.z = Math.sin(time * 0.7) * 0.15;
        inner.rotation.y += 0.01;
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(1, 1, 1);
    },
  };
}

export function buildTimeCapsule(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'time-capsule';

  // Glass Hourglass (Top bulb, bottom bulb, neck)
  const topBulbGeo = new THREE.ConeGeometry(0.48, 0.55, 24);
  const topBulb = new THREE.Mesh(topBulbGeo, mats.champagneGlass);
  topBulb.position.y = 0.32;
  topBulb.rotation.x = Math.PI;
  group.add(topBulb);

  const botBulbGeo = new THREE.ConeGeometry(0.48, 0.55, 24);
  const botBulb = new THREE.Mesh(botBulbGeo, mats.champagneGlass);
  botBulb.position.y = -0.32;
  group.add(botBulb);

  // Brass Endcaps
  const capGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.07, 24);
  const topCap = new THREE.Mesh(capGeo, mats.brushedGold);
  topCap.position.y = 0.62;
  group.add(topCap);

  const botCap = new THREE.Mesh(capGeo, mats.brushedGold);
  botCap.position.y = -0.62;
  group.add(botCap);

  // 3 Thin Brass Columns connecting the caps
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const colGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.24, 8);
    const col = new THREE.Mesh(colGeo, mats.softBronze);
    col.position.x = Math.cos(angle) * 0.44;
    col.position.z = Math.sin(angle) * 0.44;
    group.add(col);
  }

  // Internal glowing gold particles (sand trickle)
  const sandCount = 60;
  const sandGeo = new THREE.BufferGeometry();
  const sandPos = new Float32Array(sandCount * 3);
  for (let i = 0; i < sandCount * 3; i += 3) {
    sandPos[i] = (Math.random() - 0.5) * 0.15;
    sandPos[i + 1] = (Math.random() - 0.5) * 0.6;
    sandPos[i + 2] = (Math.random() - 0.5) * 0.15;
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

  const hitBoxGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 16);
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
        // Slow vertical flip on stage 2
        const targetRotZ = stage >= 2 ? Math.PI : 0;
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotZ, 0.04);
        group.rotation.y += 0.01;
        sand.rotation.y += 0.03;
        group.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.05);
      } else {
        group.rotation.y += 0.007;
        group.rotation.x = Math.sin(time * 0.8) * 0.15;
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, 0.05);
        sand.rotation.y += 0.01;
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    },
    resetFocus: () => {
      group.rotation.z = 0;
      group.scale.set(1, 1, 1);
    },
  };
}

export function buildExplorerMountain(mats: ReturnType<typeof createMaterials>): LivingObject3DInstance {
  const group = new THREE.Group();
  group.name = 'explorer';

  // 4 tiered architectural limestone mountain tiers
  const tierHeights = [0.22, 0.22, 0.22, 0.22];
  const tierRadii = [0.72, 0.54, 0.38, 0.24];
  const tiers: THREE.Mesh[] = [];

  let currentY = -0.35;
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.CylinderGeometry(tierRadii[i] * 0.82, tierRadii[i], tierHeights[i], 6);
    const mesh = new THREE.Mesh(geo, mats.warmLimestone);
    mesh.position.y = currentY + tierHeights[i] / 2;
    group.add(mesh);
    tiers.push(mesh);
    currentY += tierHeights[i];
  }

  // Golden summit peak cairn
  const summitGeo = new THREE.ConeGeometry(0.18, 0.28, 4);
  const summit = new THREE.Mesh(summitGeo, mats.brushedGold);
  summit.position.y = currentY + 0.14;
  group.add(summit);

  // Orbiting satellite bead
  const satGeo = new THREE.SphereGeometry(0.06, 16, 16);
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
      sat.position.x = Math.cos(satAngle) * 0.8;
      sat.position.z = Math.sin(satAngle) * 0.8;
      sat.position.y = Math.sin(time * 3) * 0.15 + 0.3;

      if (isFocused) {
        group.rotation.y += 0.008;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.2, 0.05);
        const targetScale = stage >= 2 ? 1.25 : 1.1;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      } else {
        group.rotation.y += 0.005;
        group.rotation.x = Math.sin(time * 0.7) * 0.12;
        group.rotation.z = Math.cos(time * 0.6) * 0.08;
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    },
    resetFocus: () => {
      group.scale.set(1, 1, 1);
    },
  };
}

export function buildContinuousGoldenRibbon(scene: THREE.Scene, mats: ReturnType<typeof createMaterials>) {
  // Sinuous 3D CatmullRom spline weaving gracefully down through the sections
  // matching the flowing golden ribbon in the user's reference image
  const curvePoints = [
    new THREE.Vector3(5.5, 3.5, -2),    // Hero right high
    new THREE.Vector3(2.5, 1.8, 0.5),   // Hero center dip
    new THREE.Vector3(-4.5, -0.2, -1),  // Journey left swing
    new THREE.Vector3(-1.5, -2.5, 1.5), // Journey center loop
    new THREE.Vector3(4.8, -4.8, -0.5), // Product Demo right curve
    new THREE.Vector3(1.2, -7.2, 1.8),  // Intelligence Core center
    new THREE.Vector3(-4.2, -9.5, -1),  // Intelligence Core left swing
    new THREE.Vector3(2.8, -12.0, 1.2), // Learning Ecosystem right
    new THREE.Vector3(-1.0, -14.5, 0),  // Security & Solutions center
    new THREE.Vector3(4.5, -17.0, -2),  // Final CTA horizon
  ];

  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const tubeGeo = new THREE.TubeGeometry(curve, 180, 0.024, 8, false);
  const ribbonMesh = new THREE.Mesh(tubeGeo, mats.brushedGold);
  scene.add(ribbonMesh);

  // 14 floating golden beads gliding along the ribbon
  const beadCount = 14;
  const beadGeo = new THREE.SphereGeometry(0.08, 16, 16);
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
        const t = (time * 0.025 + offset) % 1.0;
        const point = curve.getPointAt(t);
        beads[i].position.copy(point);
      }
    },
  };
}
