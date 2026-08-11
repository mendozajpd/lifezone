import type { ContactInfo, GalleryImage, MinistryPillar, NavItem } from '@/types/content';

export const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'vision', label: 'Vision' },
  { id: 'ministry', label: 'Ministry' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'get-involved', label: 'Get Involved' },
  { id: 'contact', label: 'Contact' },
];

export const SECTION_BACKGROUNDS = {
  hero: require('@/assets/images/gallery/gallery-1.jpg'),
  contact: require('@/assets/images/gallery/gallery-8.jpg'),
};

export const ABOUT_IMAGE = require('@/assets/images/gallery/gallery-3.jpg');

export const HERO_CONTENT = {
  eyebrow: 'A ministry of Lifezone Tacloban',
  headline: 'LIFEZONE CAMPUS',
  subheadline:
    'The College Youth Community of New Life Tacloban.',
  ctaLabel: 'Learn more',
  ctaTarget: 'vision',
};

export const VISION_CONTENT = {
  title1: 'VISION',
  paragraphs1: [
    'Building a generation of college youth who know Christ, impact the campuses and influence the world.',
  ],
  title2: 'MISSION',
  paragraphs2: [
    'To lead the college youth in a life changing journey with Jesus.',
  ],
};

export const MINISTRY_CONTENT = {
  title: 'What we do',
  pillars: [
    {
    title: '𝙇𝙞𝙛𝙚𝙯𝙤𝙣𝙚 𝘾𝙖𝙢𝙥𝙪𝙨',
    description:
        'We reach college students where they are-on campus. Through campus engagements, outreach events, and personal evangelism, we share the love of Jesus and connect students to a life-giving community. Every campus mission is led by our dedicated College Crew.',
        image: require('@/assets/images/gallery/gallery-6.jpg'),
    },
    {
      title: '𝙇𝙞𝙛𝙚𝙯𝙤𝙣𝙚 𝘾𝙖𝙩𝙘𝙝 𝙐𝙥',
      description:
        'Life is better in community. Lifezone Catch Up provides a safe and welcoming space where college students can build genuine friendships, enjoy meaningful conversations, and experience authentic fellowship as they grow together in faith.',
      image: require('@/assets/images/gallery/gallery-10.jpg'),
    },
    // {
    //   title: 'Small Groups',
    //   description:
    //     'During our services, we break into groups so that we can facilitate students into conversations that help them delve deeper into the Word and apply it to their personal lives.',
    //   image: require('@/assets/images/gallery/gallery-7.jpg'),
    // },
  ] satisfies MinistryPillar[],
};

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 'gallery-1', source: require('@/assets/images/gallery/gallery-1.jpg'), width: 1439, height: 959, caption: 'Lifezone Campus community night' },
  { id: 'gallery-2', source: require('@/assets/images/gallery/gallery-2.jpg'), width: 1415, height: 961, caption: 'Lifezone Campus community night' },
  { id: 'gallery-3', source: require('@/assets/images/gallery/gallery-3.jpg'), width: 2730, height: 1820, caption: 'Lifezone Campus community night' },
  { id: 'gallery-4', source: require('@/assets/images/gallery/gallery-4.jpg'), width: 2730, height: 1820, caption: 'Lifezone Campus community night' },
  { id: 'gallery-5', source: require('@/assets/images/gallery/gallery-5.jpg'), width: 3461, height: 2595, caption: 'Lifezone Campus community night' },
  { id: 'gallery-6', source: require('@/assets/images/gallery/gallery-6.jpg'), width: 3455, height: 2591, caption: 'Lifezone Campus community night' },
  { id: 'gallery-7', source: require('@/assets/images/gallery/gallery-7.jpg'), width: 2624, height: 1749, caption: 'Lifezone Campus community night' },
  { id: 'gallery-8', source: require('@/assets/images/gallery/gallery-8.jpg'), width: 2730, height: 1820, caption: 'Lifezone Campus community night' },
  { id: 'gallery-9', source: require('@/assets/images/gallery/gallery-9.jpg'), width: 2730, height: 1820, caption: 'Lifezone Campus community night' },
  { id: 'gallery-10', source: require('@/assets/images/gallery/gallery-10.jpg'), width: 2730, height: 1820, caption: 'Lifezone Campus community night' },
  { id: 'gallery-11', source: require('@/assets/images/gallery/gallery-11.jpg'), width: 2730, height: 1820, caption: 'Lifezone Campus community night' },
  { id: 'gallery-12', source: require('@/assets/images/gallery/gallery-12.jpg'), width: 2730, height: 1820, caption: 'Lifezone Campus community night' },
];

export const GET_INVOLVED = {
  title: 'Get Involved',
  collegeCrew: {
    heading: 'Become a College Crew',
    body: 'Be part of bringing the hope of Jesus to college campuses by serving with our LZ teams.',
    campusesLabel: 'Current Campuses',
    campuses: ['ACLC', 'ADFC', 'EVSU', 'LC', 'LNU', 'RTR', 'SPSPS', 'UP'],
  },
  catchUp: {
    heading: 'Join a Lifezone Catch Up',
    body: "Whether you're looking for friends, a place to belong, or a community that will help you grow in your faith, there's a place for you at Lifezone.",
    tagline: 'Come as you are. Grow with us. Impact your campus. Influence the world.',
  },
};

export const CONTACT_CONTENT = {
  title: 'Connect With Us',
  paragraphs: [
    'Have questions? Looking for a community? Need prayer?',
    "We're just a message away. Reach out through our social media channels, and someone from our team will gladly connect with you.",
  ],
};

export const CONTACT_INFO: ContactInfo = {
  address: 'New Life Tacloban Marasbaras, Tacloban City',
  social: [
    { label: 'Instagram', handle: '@lifezone.ph', url: 'https://www.instagram.com/lifezone.ph/' },
    { label: 'Facebook', handle: 'Lifezone Campus - New Life Tacloban', url: 'https://www.facebook.com/lifezone.newlifetac' },
  ],
};
