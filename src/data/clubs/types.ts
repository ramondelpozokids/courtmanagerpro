export type ClubSlug = 'rmb' | 'fcb' | 'fbat' | 'vbc';

export interface ClubBlogMilestone {
  year: string;
  title: string;
  description: string;
}

export interface ClubNewsItem {
  id: string;
  title: string;
  tag: string;
  image: string;
  description: string;
  date: string;
}

export interface ClubEquipacionItem {
  name: string;
  price: string;
  image: string;
}

export interface ClubBranding {
  slug: ClubSlug;
  teamId: string;
  name: string;
  shortName: string;
  tagline: string;
  venue: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  heroUrl: string;
  blogHeroUrl: string;
}

export interface ClubBlogContent {
  portalTitle: string;
  portalSubtitle: string;
  historyTitle: string;
  historySubtitle: string;
  historyIntro: string[];
  milestones: ClubBlogMilestone[];
  timeline: { title: string; description: string }[];
  palmares: { label: string; count: number; detail: string }[];
  equipacionTitle: string;
  equipacionDescription: string;
  equipacionItems: ClubEquipacionItem[];
}

export interface ClubDemoPack {
  branding: ClubBranding;
  blog: ClubBlogContent;
  news: ClubNewsItem[];
  players: any[];
  coachingStaff: any[];
  inventory: any[];
  requests: any[];
  trips: any[];
  laundry: any[];
  alerts: any[];
}
