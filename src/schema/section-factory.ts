import { Spacing } from '@/constants/theme';
import { bundled } from '@/schema/media-registry';
import type { Section, SectionItem, SectionType } from '@/schema/types';

/** Collision-resistant enough for ids inside one document. */
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function heroSection(id: string): Section {
  return {
    id,
    type: 'hero',
    template: 'hero.centered',
    label: 'New banner',
    visible: true,
    showInNav: false,
    background: {
      kind: 'image',
      media: bundled('gallery-2', 'Background'),
      overlayColor: '#0A0A0A',
      overlayOpacity: 0.72,
    },
    layout: { minHeight: 420, gap: Spacing.lg, align: 'center' },
    blocks: [
      { id: newId('block'), kind: 'heading', level: 2, role: 'display', text: 'Your headline' },
      {
        id: newId('block'),
        kind: 'paragraph',
        role: 'lead',
        text: 'A sentence or two that sets this section up.',
      },
    ],
  };
}

function textSection(id: string, template: string): Section {
  const blocks: Section['blocks'] = [
    { id: newId('block'), kind: 'heading', level: 2, role: 'sectionTitle', text: 'New section' },
    {
      id: newId('block'),
      kind: 'paragraph',
      role: 'body',
      text: 'Write what this section is about.',
      spacing: { bottom: Spacing.md },
    },
  ];

  if (template === 'text.media-split') {
    blocks.unshift({
      id: newId('block'),
      kind: 'image',
      media: bundled('gallery-5', 'Section photo'),
      aspectRatio: 4 / 3,
      borderRadius: 16,
      grow: 1,
      basis: 280,
    });
  }

  return {
    id,
    type: 'text',
    template,
    label: 'New section',
    visible: true,
    showInNav: true,
    bordered: true,
    background: { kind: 'none' },
    blocks,
  };
}

function card(title: string, key: Parameters<typeof bundled>[0]): SectionItem {
  return {
    id: newId('item'),
    blocks: [
      { id: newId('block'), kind: 'image', media: bundled(key, title), aspectRatio: 16 / 10 },
      { id: newId('block'), kind: 'heading', level: 3, role: 'cardTitle', text: title },
      {
        id: newId('block'),
        kind: 'paragraph',
        role: 'cardBody',
        text: 'A short description of this card.',
      },
    ],
  };
}

function cardsSection(id: string): Section {
  return {
    id,
    type: 'cards',
    template: 'cards.grid',
    label: 'New cards',
    visible: true,
    showInNav: true,
    bordered: true,
    background: { kind: 'none' },
    layout: { gap: Spacing.lg },
    blocks: [
      { id: newId('block'), kind: 'heading', level: 2, role: 'sectionTitle', text: 'New cards' },
    ],
    items: [card('First card', 'gallery-4'), card('Second card', 'gallery-7')],
  };
}

function gallerySection(id: string): Section {
  const keys = ['gallery-1', 'gallery-2', 'gallery-3'] as const;
  return {
    id,
    type: 'gallery',
    template: 'gallery.grid',
    label: 'New gallery',
    visible: true,
    showInNav: true,
    bordered: true,
    background: { kind: 'none' },
    layout: { gap: Spacing.md },
    blocks: [
      { id: newId('block'), kind: 'heading', level: 2, role: 'sectionTitle', text: 'New gallery' },
    ],
    items: keys.map((key) => ({
      id: newId('item'),
      blocks: [
        {
          id: newId('block'),
          kind: 'image' as const,
          media: bundled(key, 'Gallery photo'),
          aspectRatio: 4 / 3,
          borderRadius: 12,
          transition: 200,
        },
      ],
    })),
  };
}

function panelsSection(id: string): Section {
  return {
    id,
    type: 'panels',
    template: 'panels.stacked',
    label: 'New panels',
    visible: true,
    showInNav: true,
    bordered: true,
    background: { kind: 'none' },
    layout: { gap: Spacing.xl },
    blocks: [
      { id: newId('block'), kind: 'heading', level: 2, role: 'sectionTitle', text: 'New panels' },
    ],
    items: [1, 2].map((n) => ({
      id: newId('item'),
      blocks: [
        {
          id: newId('block'),
          kind: 'heading' as const,
          level: 3 as const,
          role: 'subTitle' as const,
          text: `Panel ${n}`,
          spacing: { bottom: Spacing.xs },
        },
        {
          id: newId('block'),
          kind: 'paragraph' as const,
          role: 'bodySmall' as const,
          text: 'Describe this panel.',
        },
      ],
    })),
  };
}

function contactSection(id: string): Section {
  return {
    id,
    type: 'contact',
    template: 'contact.standard',
    label: 'New contact',
    visible: true,
    showInNav: true,
    bordered: true,
    background: { kind: 'none' },
    layout: { gap: Spacing.lg },
    blocks: [
      { id: newId('block'), kind: 'heading', level: 2, role: 'sectionTitle', text: 'Get in touch' },
      {
        id: newId('block'),
        kind: 'paragraph',
        role: 'body',
        text: 'Tell people how to reach you.',
        style: { maxWidth: 560 },
      },
      { id: newId('block'), kind: 'contactForm' },
    ],
  };
}

function footerSection(id: string): Section {
  return {
    id,
    type: 'footer',
    template: 'footer.simple',
    label: 'New footer',
    visible: true,
    showInNav: false,
    bordered: true,
    background: { kind: 'none' },
    layout: { paddingVertical: Spacing.xxl, gap: Spacing.sm, align: 'center' },
    blocks: [
      {
        id: newId('block'),
        kind: 'paragraph',
        role: 'footerFine',
        text: '© {{year}} Your organisation.',
      },
    ],
  };
}

/**
 * Builds a ready-to-edit section for a chosen template. New sections arrive
 * with real placeholder content rather than empty boxes, so the editor can see
 * what the layout does before writing anything.
 */
export function createSection(type: SectionType, template: string): Section {
  const id = newId(type);

  switch (type) {
    case 'hero':
      return heroSection(id);
    case 'text':
      return textSection(id, template);
    case 'cards':
      return cardsSection(id);
    case 'gallery':
      return gallerySection(id);
    case 'panels':
      return panelsSection(id);
    case 'contact':
      return contactSection(id);
    case 'footer':
      return footerSection(id);
  }
}
