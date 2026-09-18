import { BlockList } from '@/render/blocks/block-list';
import { SectionShell } from '@/render/section-shell';
import type { TemplateProps } from '@/render/templates/types';

/**
 * Blocks stacked in order inside the section frame. Alignment, gap and minimum
 * height all come from the section's layout, so this one component backs the
 * hero, the contact section and the footer.
 */
export function StackTemplate({ section }: TemplateProps) {
  return (
    <SectionShell section={section}>
      <BlockList sectionId={section.id} blocks={section.blocks} />
    </SectionShell>
  );
}
