// TypeScript types matching GROQ query shapes

export interface SanityStat {
  _id: string;
  value: string;
  label: string;
  code: string;
}

export interface SanityCapabilitySlide {
  _id: string;
  id: string;
  order: number;
  code: string;
  title: string;
  image: string;
  imageAlt: string;
  specs: { key: string; value: string }[];
}

export interface SanityInsight {
  _id: string;
  date: string;
  title: string;
  desc: string;
}

export interface SanityNewsArticle {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  date: string;
  readTime: string;
  desc: string;
  image: string;
  featured: boolean;
}

export interface SanityProduct3D {
  _id: string;
  id: string;
  order: number;
  label: string;
  title: string;
  desc: string;
  specs: { key: string; val: string }[];
}

export interface SanityProduct {
  _id: string;
  id: string;
  num: string;
  title: string;
  programme: "ISRO" | "DRDO" | "HSFC";
  img: string;
  desc: string;
  specs: { k: string; v: string }[];
}

export interface SanityProgramme {
  _id: string;
  name: string;
  client: "ISRO" | "DRDO" | "HAL";
  tag: string;
  size?: string;
  material?: string;
  desc: string;
  image: string;
}

export interface SanityJobPosition {
  _id: string;
  title: string;
  dept: string;
  type: string;
  exp: string;
  location: string;
  desc: string;
  skills: string[];
}

export interface SanityCapability {
  _id: string;
  id: string;
  label: string;
  tag: string;
  image: string;
  headline: string;
  desc: string;
  specs: { label: string; value: string }[];
  materials: string[];
  products: string[];
}

export interface SanityInfrastructure {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  specs: { key: string; value: string }[];
}

export interface SanityAboutStat {
  _id: string;
  value: string;
  label: string;
}

export interface SanityTimelineEntry {
  _id: string;
  year: string;
  text: string;
  image: string;
}

export interface SanityPlant {
  _id: string;
  name: string;
  area: string;
  plot: string;
  highlights: string[];
  image: string;
}

export interface SanityProcessStep {
  _id: string;
  step: string;
  title: string;
  desc: string;
  detail: string;
  image: string;
}

export interface SanityMachine {
  _id: string;
  name: string;
  category: "milling" | "turning" | "metrology";
  image: string;
  specs: { label: string; value: string }[];
  schematics: {
    origin: string;
    travelRatio: string;
    laserCalib: string;
    axisEngaged: string;
  };
}

export interface SanitySiteSettings {
  companyName: string;
  tagline: string;
  heroSubtext: string;
  contactEmail: string;
  contractsEmail: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pin: string;
  };
  capabilitiesTicker: string[];
}
