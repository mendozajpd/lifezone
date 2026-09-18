import { SITE_DESCRIPTION, SITE_TITLE } from '@/constants/site-meta';
import { Spacing } from '@/constants/theme';
import { bundled } from '@/schema/media-registry';
import { DEFAULT_THEME } from '@/schema/theme';
import { SCHEMA_VERSION, type BundledMediaKey, type SiteVersion } from '@/schema/types';

const GALLERY_CAPTION = 'Lifezone Campus community night';

const GALLERY_KEYS: BundledMediaKey[] = [
  'gallery-1',
  'gallery-2',
  'gallery-3',
  'gallery-4',
  'gallery-5',
  'gallery-6',
  'gallery-7',
  'gallery-8',
  'gallery-9',
  'gallery-10',
  'gallery-11',
  'gallery-12',
];

/**
 * The site as it shipped, expressed as content.
 *
 * This is the bundled fallback the public page renders before (or instead of)
 * the published snapshot, and the document "restore to defaults" copies from.
 * Values here mirror the original hand-written components exactly — where a
 * block deviates from its themed role, the difference is an explicit override.
 */
export const DEFAULT_VERSION: SiteVersion = {
  schemaVersion: SCHEMA_VERSION,
  id: 'default',
  name: 'Original',
  isDefault: true,
  theme: DEFAULT_THEME,
  meta: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  sections: [
    {
      id: 'hero',
      type: 'hero',
      template: 'hero.centered',
      label: 'Home',
      visible: true,
      showInNav: false,
      background: {
        kind: 'image',
        media: bundled('gallery-1', 'Lifezone Campus gathering'),
        overlayColor: '#0A0A0A',
        overlayOpacity: 0.82,
      },
      layout: { minHeight: 560, gap: Spacing.lg, align: 'center' },
      blocks: [
        { id: 'hero-logo', kind: 'logo', size: 'lg', variant: 'mark' },
        {
          id: 'hero-headline',
          kind: 'heading',
          level: 1,
          role: 'display',
          text: 'LIFEZONE CAMPUS',
          // Optical centring nudge for Archivo Black's left sidebearing.
          spacing: { left: 2 },
        },
        {
          id: 'hero-subheadline',
          kind: 'paragraph',
          role: 'lead',
          text: 'The College Youth Community of New Life Tacloban.',
        },
        {
          id: 'hero-cta',
          kind: 'button',
          label: 'Learn more',
          variant: 'solid',
          action: { kind: 'scrollTo', sectionId: 'vision' },
        },
      ],
    },

    {
      id: 'vision',
      type: 'text',
      template: 'text.media-split',
      label: 'Vision',
      visible: true,
      showInNav: true,
      bordered: true,
      background: { kind: 'none' },
      blocks: [
        {
          id: 'vision-image',
          kind: 'image',
          media: bundled('gallery-3', 'Lifezone Campus community'),
          aspectRatio: 4 / 3,
          borderRadius: 16,
          grow: 1,
          basis: 280,
        },
        { id: 'vision-title-1', kind: 'heading', level: 2, role: 'sectionTitle', text: 'VISION' },
        {
          id: 'vision-body-1',
          kind: 'paragraph',
          role: 'body',
          text: 'Building a generation of college youth who know Christ, impact the campuses and influence the world.',
          spacing: { bottom: Spacing.md },
        },
        { id: 'vision-title-2', kind: 'heading', level: 2, role: 'sectionTitle', text: 'MISSION' },
        {
          id: 'vision-body-2',
          kind: 'paragraph',
          role: 'body',
          text: 'To lead the college youth in a life changing journey with Jesus.',
          spacing: { bottom: Spacing.md },
        },
      ],
    },

    {
      id: 'ministry',
      type: 'cards',
      template: 'cards.grid',
      label: 'Ministry',
      visible: true,
      showInNav: true,
      bordered: true,
      background: { kind: 'none' },
      layout: { gap: Spacing.lg },
      blocks: [
        { id: 'ministry-title', kind: 'heading', level: 2, role: 'sectionTitle', text: 'What we do' },
      ],
      items: [
        {
          id: 'ministry-campus',
          blocks: [
            {
              id: 'ministry-campus-image',
              kind: 'image',
              media: bundled('gallery-6', 'Lifezone Campus outreach'),
              aspectRatio: 16 / 10,
            },
            {
              id: 'ministry-campus-title',
              kind: 'heading',
              level: 3,
              role: 'cardTitle',
              text: '𝙇𝙞𝙛𝙚𝙯𝙤𝙣𝙚 𝘾𝙖𝙢𝙥𝙪𝙨',
            },
            {
              id: 'ministry-campus-body',
              kind: 'paragraph',
              role: 'cardBody',
              text: 'We reach college students where they are-on campus. Through campus engagements, outreach events, and personal evangelism, we share the love of Jesus and connect students to a life-giving community. Every campus mission is led by our dedicated College Crew.',
            },
          ],
        },
        {
          id: 'ministry-catch-up',
          blocks: [
            {
              id: 'ministry-catch-up-image',
              kind: 'image',
              media: bundled('gallery-10', 'Lifezone Catch Up gathering'),
              aspectRatio: 16 / 10,
            },
            {
              id: 'ministry-catch-up-title',
              kind: 'heading',
              level: 3,
              role: 'cardTitle',
              text: '𝙇𝙞𝙛𝙚𝙯𝙤𝙣𝙚 𝘾𝙖𝙩𝙘𝙝 𝙐𝙥',
            },
            {
              id: 'ministry-catch-up-body',
              kind: 'paragraph',
              role: 'cardBody',
              text: 'Life is better in community. Lifezone Catch Up provides a safe and welcoming space where college students can build genuine friendships, enjoy meaningful conversations, and experience authentic fellowship as they grow together in faith.',
            },
          ],
        },
      ],
    },

    {
      id: 'gallery',
      type: 'gallery',
      template: 'gallery.grid',
      label: 'Gallery',
      visible: true,
      showInNav: true,
      bordered: true,
      background: { kind: 'none' },
      layout: { gap: Spacing.md },
      blocks: [
        { id: 'gallery-title', kind: 'heading', level: 2, role: 'sectionTitle', text: 'Gallery' },
        {
          id: 'gallery-caption',
          kind: 'paragraph',
          role: 'caption',
          text: 'A few moments from Lifezone.',
          spacing: { bottom: Spacing.sm },
        },
      ],
      items: GALLERY_KEYS.map((key) => ({
        id: `gallery-photo-${key}`,
        blocks: [
          {
            id: `gallery-photo-${key}-image`,
            kind: 'image' as const,
            media: bundled(key, GALLERY_CAPTION),
            aspectRatio: 4 / 3,
            borderRadius: 12,
            transition: 200,
          },
        ],
      })),
    },

    {
      id: 'get-involved',
      type: 'panels',
      template: 'panels.stacked',
      label: 'Get Involved',
      visible: true,
      showInNav: true,
      bordered: true,
      background: { kind: 'none' },
      layout: { gap: Spacing.xl },
      blocks: [
        { id: 'involved-title', kind: 'heading', level: 2, role: 'sectionTitle', text: 'Get Involved' },
      ],
      items: [
        {
          id: 'involved-crew',
          blocks: [
            {
              id: 'involved-crew-heading',
              kind: 'heading',
              level: 3,
              role: 'subTitle',
              text: 'Become a College Crew',
              spacing: { bottom: Spacing.xs },
            },
            {
              id: 'involved-crew-body',
              kind: 'paragraph',
              role: 'bodySmall',
              text: 'Be part of bringing the hope of Jesus to college campuses by serving with our LZ teams.',
            },
            {
              id: 'involved-crew-label',
              kind: 'paragraph',
              role: 'eyebrow',
              text: 'Current Campuses',
              spacing: { top: Spacing.sm },
            },
            {
              id: 'involved-crew-campuses',
              kind: 'badgeList',
              role: 'chip',
              items: ['ACLC', 'ADFC', 'EVSU', 'LC', 'LNU', 'RTR', 'SPSPS', 'UP'],
            },
          ],
        },
        {
          id: 'involved-catch-up',
          blocks: [
            {
              id: 'involved-catch-up-heading',
              kind: 'heading',
              level: 3,
              role: 'subTitle',
              text: 'Join a Lifezone Catch Up',
              spacing: { bottom: Spacing.xs },
            },
            {
              id: 'involved-catch-up-body',
              kind: 'paragraph',
              role: 'bodySmall',
              text: "Whether you're looking for friends, a place to belong, or a community that will help you grow in your faith, there's a place for you at Lifezone.",
            },
            {
              id: 'involved-catch-up-tagline',
              kind: 'paragraph',
              role: 'tagline',
              text: 'Come as you are. Grow with us. Impact your campus. Influence the world.',
              spacing: { top: Spacing.xs },
            },
          ],
        },
      ],
    },

    {
      id: 'contact',
      type: 'contact',
      template: 'contact.standard',
      label: 'Contact',
      visible: true,
      showInNav: true,
      bordered: true,
      background: {
        kind: 'image',
        media: bundled('gallery-8', 'Lifezone Campus worship night'),
        overlayColor: '#0A0A0A',
        overlayOpacity: 0.82,
      },
      layout: { gap: Spacing.lg },
      blocks: [
        { id: 'contact-title', kind: 'heading', level: 2, role: 'sectionTitle', text: 'Connect With Us' },
        {
          id: 'contact-body-1',
          kind: 'paragraph',
          role: 'body',
          text: 'Have questions? Looking for a community? Need prayer?',
          style: { lineHeight: 25, maxWidth: 560 },
        },
        {
          id: 'contact-body-2',
          kind: 'paragraph',
          role: 'body',
          text: "We're just a message away. Reach out through our social media channels, and someone from our team will gladly connect with you.",
          style: { lineHeight: 25, maxWidth: 560 },
        },
        {
          id: 'contact-info',
          kind: 'infoList',
          items: [
            {
              id: 'contact-address',
              label: 'Address',
              value: 'New Life Tacloban Marasbaras, Tacloban City',
            },
          ],
        },
        { id: 'contact-form', kind: 'contactForm' },
        {
          id: 'contact-social',
          kind: 'socialLinks',
          role: 'link',
          links: [
            {
              id: 'instagram',
              label: 'Instagram',
              handle: '@lifezone.ph',
              url: 'https://www.instagram.com/lifezone.ph/',
            },
            {
              id: 'facebook',
              label: 'Facebook',
              handle: 'Lifezone Campus - New Life Tacloban',
              url: 'https://www.facebook.com/lifezone.newlifetac',
            },
          ],
        },
      ],
    },

    {
      id: 'footer',
      type: 'footer',
      template: 'footer.simple',
      label: 'Footer',
      visible: true,
      showInNav: false,
      bordered: true,
      background: { kind: 'none' },
      layout: { paddingVertical: Spacing.xxl, gap: Spacing.sm, align: 'center' },
      blocks: [
        { id: 'footer-logo', kind: 'logo', size: 'sm', variant: 'mark' },
        {
          id: 'footer-address',
          kind: 'paragraph',
          role: 'footerText',
          text: 'New Life Tacloban Marasbaras, Tacloban City',
        },
        {
          id: 'footer-copyright',
          kind: 'paragraph',
          role: 'footerFine',
          text: '© {{year}} Lifezone Tacloban. All rights reserved.',
          spacing: { top: Spacing.md },
        },
      ],
    },
  ],
};
