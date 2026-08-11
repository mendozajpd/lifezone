import type { ImageSourcePropType } from 'react-native';

export type NavItem = {
  id: string;
  label: string;
};

export type MinistryPillar = {
  title: string;
  description: string;
  image: ImageSourcePropType;
};

export type GalleryImage = {
  id: string;
  source: ImageSourcePropType;
  width: number;
  height: number;
  caption: string;
};

export type SocialLink = {
  label: string;
  handle: string;
  url: string;
};

export type ContactInfo = {
//   email: string;
//   phone: string;
  address: string;
  social: SocialLink[];
};
