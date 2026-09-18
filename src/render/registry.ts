import { CardsGrid } from '@/render/templates/cards-grid';
import { GalleryGrid } from '@/render/templates/gallery-grid';
import { PanelsStacked } from '@/render/templates/panels-stacked';
import { StackTemplate } from '@/render/templates/stack';
import { TextMediaSplit } from '@/render/templates/text-media-split';
import type { TemplateDefinition } from '@/render/templates/types';
import type { SectionType } from '@/schema/types';

/**
 * Every layout a section can take. The editor's template picker is generated
 * from this list, so adding a design means adding one entry here — nothing else
 * in the app needs to know about it.
 */
export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'hero.centered',
    type: 'hero',
    name: 'Centered',
    description: 'Logo, headline and button centred over a full-bleed photo.',
    component: StackTemplate,
  },
  {
    id: 'text.media-split',
    type: 'text',
    name: 'Photo beside text',
    description: 'A photo on one side, headings and paragraphs on the other.',
    component: TextMediaSplit,
  },
  {
    id: 'text.stacked',
    type: 'text',
    name: 'Stacked',
    description: 'Headings and paragraphs down the page, no photo.',
    component: StackTemplate,
  },
  {
    id: 'cards.grid',
    type: 'cards',
    name: 'Card grid',
    description: 'Image-topped cards that wrap across the width.',
    component: CardsGrid,
  },
  {
    id: 'gallery.grid',
    type: 'gallery',
    name: 'Photo grid',
    description: 'Evenly sized photo tiles that wrap across the width.',
    component: GalleryGrid,
  },
  {
    id: 'panels.stacked',
    type: 'panels',
    name: 'Stacked panels',
    description: 'Full-width blocks of copy stacked down the page.',
    component: PanelsStacked,
  },
  {
    id: 'contact.standard',
    type: 'contact',
    name: 'Standard',
    description: 'Copy, details, message form and social links in one column.',
    component: StackTemplate,
  },
  {
    id: 'footer.simple',
    type: 'footer',
    name: 'Simple',
    description: 'Centred logo, address and copyright line.',
    component: StackTemplate,
  },
];

const BY_ID = new Map(TEMPLATES.map((template) => [template.id, template]));

export function getTemplate(id: string): TemplateDefinition | undefined {
  return BY_ID.get(id);
}

export function templatesForType(type: SectionType): TemplateDefinition[] {
  return TEMPLATES.filter((template) => template.type === type);
}
