import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { TEMPLATES } from '@/render/registry';
import type { TemplateDefinition } from '@/render/templates/types';
import type { SectionType } from '@/schema/types';

/** Plain-language names, so the picker doesn't ask for the schema's vocabulary. */
const TYPE_LABELS: Record<SectionType, string> = {
  hero: 'Banner',
  text: 'Text & photo',
  cards: 'Cards',
  gallery: 'Photo gallery',
  panels: 'Stacked panels',
  contact: 'Contact',
  footer: 'Footer',
};

/**
 * A rough shape-preview of each layout, drawn from plain views.
 *
 * Deliberately abstract: a real render of the template would need content that
 * does not exist yet, and a screenshot would go stale the moment a template
 * changes.
 */
function Preview({ templateId }: { templateId: string }) {
  const bar = (width: string | number, height = 6) => (
    <View style={[styles.pvBar, { width: width as never, height }]} />
  );

  switch (templateId) {
    case 'hero.centered':
      return (
        <View style={[styles.preview, styles.pvCentered]}>
          <View style={styles.pvImageFill} />
          <View style={styles.pvCenterStack}>
            {bar('55%', 9)}
            {bar('40%')}
            {bar(34, 10)}
          </View>
        </View>
      );
    case 'text.media-split':
      return (
        <View style={[styles.preview, styles.pvRow]}>
          <View style={styles.pvImageHalf} />
          <View style={styles.pvCol}>
            {bar('70%', 8)}
            {bar('100%')}
            {bar('85%')}
          </View>
        </View>
      );
    case 'text.stacked':
      return (
        <View style={styles.preview}>
          {bar('55%', 8)}
          {bar('100%')}
          {bar('92%')}
          {bar('80%')}
        </View>
      );
    case 'cards.grid':
      return (
        <View style={styles.preview}>
          {bar('45%', 8)}
          <View style={styles.pvRow}>
            <View style={styles.pvCard} />
            <View style={styles.pvCard} />
          </View>
        </View>
      );
    case 'gallery.grid':
      return (
        <View style={styles.preview}>
          {bar('40%', 8)}
          <View style={styles.pvGrid}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <View key={n} style={styles.pvTile} />
            ))}
          </View>
        </View>
      );
    case 'panels.stacked':
      return (
        <View style={styles.preview}>
          {bar('45%', 8)}
          <View style={styles.pvPanel}>
            {bar('60%')}
            {bar('90%')}
          </View>
          <View style={styles.pvPanel}>
            {bar('55%')}
            {bar('85%')}
          </View>
        </View>
      );
    case 'contact.standard':
      return (
        <View style={styles.preview}>
          {bar('50%', 8)}
          {bar('90%')}
          <View style={styles.pvField} />
          <View style={styles.pvField} />
          {bar(40, 9)}
        </View>
      );
    case 'footer.simple':
      return (
        <View style={[styles.preview, styles.pvCentered]}>
          <View style={styles.pvCenterStack}>
            {bar(26, 8)}
            {bar('40%')}
          </View>
        </View>
      );
    default:
      return <View style={styles.preview} />;
  }
}

export function AddSectionModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (template: TemplateDefinition) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);

  const close = () => {
    setChosen(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        {/* Swallow clicks inside the sheet so they don't dismiss it. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Add a section</Text>
              <Text style={styles.subtitle}>Pick how it should look. You can change this later.</Text>
            </View>
            <Pressable onPress={close} style={styles.close} accessibilityLabel="Close">
              <Text style={styles.closeGlyph}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.grid}>
            {TEMPLATES.map((template) => {
              const selected = chosen === template.id;
              return (
                <Pressable
                  key={template.id}
                  onPress={() => setChosen(template.id)}
                  style={[styles.option, selected && styles.optionSelected]}>
                  <Preview templateId={template.id} />
                  <Text style={styles.optionKind}>{TYPE_LABELS[template.type]}</Text>
                  <Text style={styles.optionName}>{template.name}</Text>
                  <Text style={styles.optionDescription}>{template.description}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={close} style={styles.cancel}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={!chosen}
              onPress={() => {
                const template = TEMPLATES.find((t) => t.id === chosen);
                if (template) onAdd(template);
                setChosen(null);
              }}
              style={({ pressed }) => [
                styles.confirm,
                !chosen && styles.confirmDisabled,
                pressed && chosen && styles.confirmPressed,
              ]}>
              <Text style={styles.confirmLabel}>Add section</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 880,
    maxHeight: '86%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  close: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeGlyph: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  option: {
    width: 246,
    gap: 4,
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  optionSelected: {
    borderColor: Colors.text,
  },
  optionKind: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  optionName: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  optionDescription: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancel: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.text,
  },
  confirm: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: Colors.text,
  },
  confirmDisabled: {
    opacity: 0.35,
  },
  confirmPressed: {
    opacity: 0.85,
  },
  confirmLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.background,
  },

  /* Preview primitives */
  preview: {
    height: 104,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    gap: 5,
    overflow: 'hidden',
  },
  pvCentered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pvRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pvCol: {
    flex: 1,
    gap: 5,
  },
  pvBar: {
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  pvImageFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1F1F1F',
  },
  pvCenterStack: {
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
  pvImageHalf: {
    width: '42%',
    borderRadius: 4,
    backgroundColor: '#1F1F1F',
  },
  pvCard: {
    flex: 1,
    height: 58,
    borderRadius: 5,
    backgroundColor: '#1F1F1F',
  },
  pvGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  pvTile: {
    width: '31%',
    height: 27,
    borderRadius: 4,
    backgroundColor: '#1F1F1F',
  },
  pvPanel: {
    gap: 4,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
  },
  pvField: {
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
