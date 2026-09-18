import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { ScrollProvider, useScroll } from '@/context/scroll-context';
import { SiteRenderProvider } from '@/render/context';
import { EditorProvider, type EditorApi, type EditorTarget } from '@/render/editor-context';
import { SiteRenderer } from '@/render/site-renderer';
import type { Breakpoint, SiteVersion } from '@/schema/types';

/** Canvas width per device preview. `null` means fill the available space. */
const DEVICE_WIDTH: Record<Breakpoint, number | null> = {
  desktop: null,
  tablet: 768,
  base: 390,
};

/**
 * The live page, rendered by the same components the public site uses. The only
 * difference is the editor context, which turns blocks into selection targets.
 */
export function Canvas({
  version,
  device,
  selected,
  onSelect,
}: {
  version: SiteVersion;
  device: Breakpoint;
  selected: EditorTarget | null;
  onSelect: (target: EditorTarget) => void;
}) {
  const editor = useMemo<EditorApi>(() => ({ selected, select: onSelect }), [selected, onSelect]);
  const width = DEVICE_WIDTH[device];

  return (
    <View style={styles.stage}>
      <View style={[styles.frame, width !== null && { width, alignSelf: 'center' }]}>
        {/*
          Its own ScrollProvider so section offsets register against the canvas
          rather than the page behind it, and its own forced breakpoint so the
          device preview is independent of the browser window size.
        */}
        <ScrollProvider>
          <SiteRenderProvider version={version} forcedBreakpoint={device}>
            <EditorProvider value={editor}>
              <CanvasScroll />
            </EditorProvider>
          </SiteRenderProvider>
        </ScrollProvider>
      </View>
    </View>
  );
}

function CanvasScroll() {
  const { scrollRef } = useScroll();

  return (
    <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SiteRenderer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  frame: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
});
