export type LivingObjectId =
  | 'knowledge-orb'
  | 'evidence-prism'
  | 'research-compass'
  | 'knowledge-fragment'
  | 'time-capsule'
  | 'explorer';

export interface LivingObjectMeta {
  id: LivingObjectId;
  name: string;
  category: string;
  tagline: string;
  personalityQuote: string;
  homeSectionId: string;
  sectionLabel: string;
  color: string;
  accentColor: string;
  narrationText: string;
  stage1Title: string;
  stage1Desc: string;
  stage2Title: string;
  stage2Desc: string;
  stage3Title: string;
  stage3Desc: string;
}

export interface ObjectTransform3D {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}
