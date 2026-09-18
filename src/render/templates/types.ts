import type { ComponentType } from 'react';

import type { Section, SectionType } from '@/schema/types';

export type TemplateProps = {
  section: Section;
};

export type TemplateComponent = ComponentType<TemplateProps>;

export type TemplateDefinition = {
  /** Registry key, e.g. `cards.grid`. */
  id: string;
  type: SectionType;
  /** Shown in the editor's template picker. */
  name: string;
  description: string;
  component: TemplateComponent;
};
