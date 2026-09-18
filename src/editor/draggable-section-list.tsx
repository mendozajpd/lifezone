import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Section } from '@/schema/types';

// `cursor` is a web-only CSS property; core RN's ViewStyle type doesn't list it.
const GRAB_CURSOR = { cursor: 'grab' } as object;

const ROW_HEIGHT = 54;
const ROW_GAP = 3;
const SLOT = ROW_HEIGHT + ROW_GAP;

/**
 * The page outline, reorderable by dragging.
 *
 * Rows are absolutely positioned on a fixed pitch so a drag only has to move
 * one row and shift the others by whole slots — far simpler and smoother than
 * measuring variable heights mid-gesture. The reorder is committed once, on
 * release.
 */
export function DraggableSectionList({
  sections,
  selectedSectionId,
  onSelect,
  onReorder,
  onToggleVisible,
}: {
  sections: Section[];
  selectedSectionId: string | null;
  onSelect: (sectionId: string) => void;
  onReorder: (from: number, to: number) => void;
  onToggleVisible: (sectionId: string) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const dragIndex = useRef(0);

  const beginDrag = useCallback((id: string, index: number) => {
    dragIndex.current = index;
    setDraggingId(id);
    setHoverIndex(index);
  }, []);

  const endDrag = useCallback(
    (to: number) => {
      const from = dragIndex.current;
      if (from !== to) onReorder(from, to);
      setDraggingId(null);
      setHoverIndex(null);
    },
    [onReorder]
  );

  return (
    <View style={[styles.list, { height: sections.length * SLOT }]}>
      {sections.map((section, index) => (
        <Row
          key={section.id}
          section={section}
          index={index}
          count={sections.length}
          selected={section.id === selectedSectionId}
          dragging={section.id === draggingId}
          // Rows other than the dragged one slide to make room.
          displacement={displacementFor(index, dragIndex.current, hoverIndex, draggingId !== null)}
          onSelect={() => onSelect(section.id)}
          onToggleVisible={() => onToggleVisible(section.id)}
          onDragStart={() => beginDrag(section.id, index)}
          onDragMove={setHoverIndex}
          onDragEnd={endDrag}
        />
      ))}
    </View>
  );
}

/** How far a static row shifts while another row is being dragged over it. */
function displacementFor(
  index: number,
  from: number,
  hover: number | null,
  active: boolean
): number {
  if (!active || hover === null || index === from) return 0;
  if (from < hover && index > from && index <= hover) return -SLOT;
  if (from > hover && index < from && index >= hover) return SLOT;
  return 0;
}

function Row({
  section,
  index,
  count,
  selected,
  dragging,
  displacement,
  onSelect,
  onToggleVisible,
  onDragStart,
  onDragMove,
  onDragEnd,
}: {
  section: Section;
  index: number;
  count: number;
  selected: boolean;
  dragging: boolean;
  displacement: number;
  onSelect: () => void;
  onToggleVisible: () => void;
  onDragStart: () => void;
  onDragMove: (hover: number) => void;
  onDragEnd: (to: number) => void;
}) {
  const offset = useSharedValue(0);
  const lifted = useSharedValue(0);

  const pan = Gesture.Pan()
    .activateAfterLongPress(120)
    .onStart(() => {
      lifted.value = withTiming(1, { duration: 120 });
      runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      offset.value = event.translationY;
      const target = Math.max(
        0,
        Math.min(count - 1, index + Math.round(event.translationY / SLOT))
      );
      runOnJS(onDragMove)(target);
    })
    .onEnd((event) => {
      const target = Math.max(
        0,
        Math.min(count - 1, index + Math.round(event.translationY / SLOT))
      );
      offset.value = withSpring(0, { damping: 20, stiffness: 200 });
      lifted.value = withTiming(0, { duration: 140 });
      runOnJS(onDragEnd)(target);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    top: index * SLOT,
    transform: [
      { translateY: dragging ? offset.value : withSpring(displacement, { damping: 22, stiffness: 220 }) },
      { scale: 1 + lifted.value * 0.02 },
    ],
    zIndex: dragging ? 10 : 1,
    opacity: 1 - lifted.value * 0.08,
  }));

  return (
    <Animated.View style={[styles.rowWrapper, animatedStyle]}>
      <Pressable
        onPress={onSelect}
        style={[styles.row, selected && styles.rowSelected, dragging && styles.rowDragging]}>
        <GestureDetector gesture={pan}>
          <View style={[styles.handle, GRAB_CURSOR]} accessibilityLabel="Drag to reorder">
            <Text style={styles.handleGlyph}>⠿</Text>
          </View>
        </GestureDetector>

        <View style={styles.main}>
          <Text numberOfLines={1} style={[styles.label, !section.visible && styles.labelHidden]}>
            {section.label}
          </Text>
          <Text style={styles.type}>{section.type}</Text>
        </View>

        <Pressable
          onPress={onToggleVisible}
          accessibilityLabel={section.visible ? 'Hide section' : 'Show section'}
          style={({ pressed }) => [styles.eye, pressed && styles.eyePressed]}>
          <Text style={styles.eyeGlyph}>{section.visible ? '👁' : '🚫'}</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: {
    position: 'relative',
    paddingHorizontal: Spacing.sm,
  },
  rowWrapper: {
    position: 'absolute',
    left: Spacing.sm,
    right: Spacing.sm,
    height: ROW_HEIGHT,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingRight: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: {
    borderColor: Colors.text,
    backgroundColor: Colors.background,
  },
  rowDragging: {
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  handle: {
    width: 28,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleGlyph: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.textMuted,
  },
  main: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
  },
  labelHidden: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  type: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    color: Colors.textMuted,
  },
  eye: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  eyePressed: {
    backgroundColor: Colors.border,
  },
  eyeGlyph: {
    fontSize: 13,
  },
});
