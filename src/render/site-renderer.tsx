import { Fragment } from 'react';

import { useEditor } from '@/render/editor-context';
import { getTemplate } from '@/render/registry';
import { useSiteRender } from '@/render/context';
import type { Section } from '@/schema/types';

/**
 * Whether a section should appear to visitors right now. Scheduling lets an
 * editor queue up an announcement and have it retire on its own.
 */
export function isSectionLive(section: Section, now = new Date()): boolean {
  if (!section.visible) return false;

  const { schedule } = section;
  if (!schedule) return true;
  if (schedule.start && now < new Date(schedule.start)) return false;
  if (schedule.end && now > new Date(schedule.end)) return false;
  return true;
}

function SectionRenderer({ section }: { section: Section }) {
  const template = getTemplate(section.template);

  if (!template) {
    // An unknown template means content was authored against a newer build.
    // Dropping the section beats crashing the whole page.
    if (__DEV__) {
      console.warn(`Unknown template "${section.template}" on section "${section.id}"`);
    }
    return null;
  }

  const Component = template.component;
  return <Component section={section} />;
}

/** Renders a whole site version in order. */
export function SiteRenderer() {
  const { version } = useSiteRender();
  const editor = useEditor();

  return (
    <>
      {version.sections.map((section) => {
        if (!editor && !isSectionLive(section)) return null;
        return (
          <Fragment key={section.id}>
            <SectionRenderer section={section} />
          </Fragment>
        );
      })}
    </>
  );
}
