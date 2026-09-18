import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { AddSectionModal } from '@/editor/add-section-modal';
import { Canvas } from '@/editor/canvas';
import { DraggableSectionList } from '@/editor/draggable-section-list';
import { Inspector } from '@/editor/inspector';
import { SlotPanel } from '@/editor/slot-panel';
import { TopBar } from '@/editor/top-bar';
import { useEditorDocument } from '@/editor/use-editor-document';
import type { EditorTarget } from '@/render/editor-context';
import type { TemplateDefinition } from '@/render/templates/types';
import { createSection } from '@/schema/section-factory';
import type { Breakpoint } from '@/schema/types';

export function EditorScreen({
  email,
  onSignOut,
}: {
  email: string | null;
  onSignOut: () => void;
}) {
  const doc = useEditorDocument();
  const [device, setDevice] = useState<Breakpoint>('desktop');
  const [selected, setSelected] = useState<EditorTarget | null>(null);
  const [adding, setAdding] = useState(false);

  const selectSection = useCallback((sectionId: string) => setSelected({ sectionId }), []);

  const { dirty, saveNow } = doc;

  // Autosave is debounced, so a tab closed mid-edit would drop the last change.
  // Flush when the tab is hidden, and warn if a write is still outstanding.
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const flush = () => {
      if (document.visibilityState === 'hidden') saveNow();
    };
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    document.addEventListener('visibilitychange', flush);
    window.addEventListener('beforeunload', warn);
    return () => {
      document.removeEventListener('visibilitychange', flush);
      window.removeEventListener('beforeunload', warn);
    };
  }, [dirty, saveNow]);

  const handleAdd = useCallback(
    (template: TemplateDefinition) => {
      const section = createSection(template.type, template.id);
      doc.dispatch({
        type: 'addSection',
        section,
        afterSectionId: selected?.sectionId,
      });
      setSelected({ sectionId: section.id });
      setAdding(false);
    },
    [doc, selected?.sectionId]
  );

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      doc.dispatch({ type: 'removeSection', sectionId });
      setSelected(null);
    },
    [doc]
  );

  if (doc.loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Couldn’t load your saves</Text>
        <Text style={styles.error}>{doc.loadError}</Text>
      </View>
    );
  }

  return (
    // Scoped to the editor rather than the root layout: gesture-handler is
    // ~1MB and only the drag-to-reorder needs it, so hosting it here keeps it
    // inside this lazily loaded chunk instead of every visitor's bundle.
    <GestureHandlerRootView style={styles.screen}>
      <TopBar
        email={email}
        device={device}
        onDeviceChange={setDevice}
        saveStatus={doc.saveStatus}
        saveError={doc.saveError}
        dirty={doc.dirty}
        canUndo={doc.canUndo}
        canRedo={doc.canRedo}
        onUndo={() => doc.dispatch({ type: 'undo' })}
        onRedo={() => doc.dispatch({ type: 'redo' })}
        onSignOut={onSignOut}
      />

      <View style={styles.body}>
        <ScrollView style={styles.rail} contentContainerStyle={styles.railContent}>
          <SlotPanel
            slots={doc.slots}
            activeSlotId={doc.activeSlotId}
            liveSlotId={doc.liveSlotId}
            publishStatus={doc.publishStatus}
            publishError={doc.publishError}
            busy={doc.loading}
            onSelect={doc.selectSlot}
            onAdd={(name) => void doc.addSlot(name)}
            onDuplicate={(name) => void doc.duplicateActiveSlot(name)}
            onRename={(name) => void doc.renameActiveSlot(name)}
            onDelete={(slotId) => void doc.deleteSlot(slotId)}
            onPublish={() => void doc.publishActiveSlot()}
          />

          <View style={styles.sectionsHeader}>
            <Text style={styles.railHeading}>Sections</Text>
            <Pressable
              accessibilityLabel="Add a section"
              onPress={() => setAdding(true)}
              style={({ pressed }) => [styles.add, pressed && styles.addPressed]}>
              <Text style={styles.addLabel}>+</Text>
            </Pressable>
          </View>

          {doc.loading ? (
            <View style={styles.railLoading}>
              <ActivityIndicator color={Colors.text} />
            </View>
          ) : (
            <DraggableSectionList
              sections={doc.version.sections}
              selectedSectionId={selected?.sectionId ?? null}
              onSelect={selectSection}
              onReorder={(from, to) => doc.dispatch({ type: 'reorderSections', from, to })}
              onToggleVisible={(sectionId) => {
                const section = doc.version.sections.find((s) => s.id === sectionId);
                if (!section) return;
                doc.dispatch({
                  type: 'patchSection',
                  sectionId,
                  patch: { visible: !section.visible },
                });
              }}
            />
          )}

          <Text style={styles.hint}>Drag the ⠿ handle to reorder.</Text>
        </ScrollView>

        {doc.loading ? (
          <View style={styles.canvasLoading}>
            <ActivityIndicator color={Colors.text} />
            <Text style={styles.message}>Opening this save…</Text>
          </View>
        ) : (
          <Canvas
            version={doc.version}
            device={device}
            selected={selected}
            onSelect={setSelected}
          />
        )}

        <Inspector
          version={doc.version}
          selected={selected}
          dispatch={doc.dispatch}
          onDeleteSection={handleDeleteSection}
        />
      </View>

      <AddSectionModal visible={adding} onClose={() => setAdding(false)} onAdd={handleAdd} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  rail: {
    width: 272,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 272,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  railContent: {
    paddingBottom: Spacing.xl,
  },
  sectionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  railHeading: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  add: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPressed: {
    backgroundColor: Colors.border,
  },
  addLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 18,
    color: Colors.text,
  },
  railLoading: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  hint: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  canvasLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.text,
  },
  message: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    color: Colors.textMuted,
  },
  error: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 21,
    color: '#F87171',
    maxWidth: 520,
    textAlign: 'center',
  },
});
