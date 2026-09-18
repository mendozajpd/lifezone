import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { ALL_FONTS, ensureFontLoaded, type FontOption } from '@/render/fonts';
import type { ResponsiveTextStyle, TextStyleSpec, Theme, TextRole } from '@/schema/types';

const WEIGHTS: { value: NonNullable<TextStyleSpec['fontWeight']>; label: string }[] = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra' },
  { value: '900', label: 'Black' },
];

const ALIGNMENTS: { value: NonNullable<TextStyleSpec['textAlign']>; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const TRANSFORMS: { value: NonNullable<TextStyleSpec['textTransform']>; label: string }[] = [
  { value: 'none', label: 'As typed' },
  { value: 'uppercase', label: 'UPPER' },
  { value: 'lowercase', label: 'lower' },
  { value: 'capitalize', label: 'Title' },
];

const SWATCHES = ['#FFFFFF', '#A3A3A3', '#0A0A0A', '#FACC15', '#F87171', '#60A5FA', '#34D399', '#C084FC'];

const FONT_CATEGORIES: { key: FontOption['category'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sans', label: 'Sans' },
  { key: 'serif', label: 'Serif' },
  { key: 'display', label: 'Display' },
  { key: 'handwriting', label: 'Script' },
  { key: 'mono', label: 'Mono' },
];

/**
 * Type controls for one block.
 *
 * Every field writes an override onto the block; whatever is left untouched
 * keeps inheriting the theme's role, so "Reset" is a delete rather than a
 * re-application of defaults.
 */
export function TypographyControls({
  role,
  style,
  theme,
  onChange,
}: {
  role: TextRole | undefined;
  style: ResponsiveTextStyle | undefined;
  theme: Theme;
  onChange: (style: ResponsiveTextStyle) => void;
}) {
  const [fontsOpen, setFontsOpen] = useState(false);
  const [category, setCategory] = useState<FontOption['category'] | 'all'>('all');

  const inherited: TextStyleSpec = role ? theme.roles[role] : {};
  const effective: TextStyleSpec = { ...inherited, ...style };
  const hasOverrides = style !== undefined && Object.keys(style).length > 0;

  const set = (patch: Partial<TextStyleSpec>) => onChange({ ...style, ...patch });

  const fonts = ALL_FONTS.filter((font) => category === 'all' || font.category === category);
  const currentFont = ALL_FONTS.find((font) => font.value === effective.fontFamily);

  return (
    <View style={styles.wrapper}>
      {/* Font family */}
      <Pressable style={styles.fontButton} onPress={() => setFontsOpen((open) => !open)}>
        <View style={styles.fontButtonText}>
          <Text style={styles.fieldLabel}>Font</Text>
          <Text numberOfLines={1} style={styles.fontName}>
            {currentFont?.label ?? effective.fontFamily ?? 'Theme default'}
          </Text>
        </View>
        <Text style={styles.chevron}>{fontsOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {fontsOpen && (
        <View style={styles.fontPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {FONT_CATEGORIES.map((option) => (
              <Pressable
                key={option.key}
                onPress={() => setCategory(option.key)}
                style={[styles.chip, category === option.key && styles.chipActive]}>
                <Text style={[styles.chipLabel, category === option.key && styles.chipLabelActive]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView style={styles.fontList} nestedScrollEnabled>
            {fonts.map((font) => {
              // Load on hover-in-list so each row previews in its own face.
              ensureFontLoaded(font.value);
              const selected = font.value === effective.fontFamily;
              return (
                <Pressable
                  key={font.value}
                  onPress={() => {
                    ensureFontLoaded(font.value);
                    set({ fontFamily: font.value });
                    setFontsOpen(false);
                  }}
                  style={[styles.fontRow, selected && styles.fontRowSelected]}>
                  <Text numberOfLines={1} style={[styles.fontSample, { fontFamily: font.value }]}>
                    {font.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Size / line height / letter spacing */}
      <View style={styles.row}>
        <NumberField
          label="Size"
          value={effective.fontSize}
          onChange={(fontSize) => set({ fontSize })}
        />
        <NumberField
          label="Line height"
          value={effective.lineHeight}
          onChange={(lineHeight) => set({ lineHeight })}
        />
        <NumberField
          label="Spacing"
          value={effective.letterSpacing}
          step={0.5}
          onChange={(letterSpacing) => set({ letterSpacing })}
        />
      </View>

      <Segmented
        label="Weight"
        options={WEIGHTS}
        value={effective.fontWeight}
        onChange={(fontWeight) => set({ fontWeight })}
      />

      <Segmented
        label="Alignment"
        options={ALIGNMENTS}
        value={effective.textAlign}
        onChange={(textAlign) => set({ textAlign })}
      />

      <Segmented
        label="Capitalisation"
        options={TRANSFORMS}
        value={effective.textTransform}
        onChange={(textTransform) => set({ textTransform })}
      />

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Colour</Text>
        <View style={styles.swatches}>
          {SWATCHES.map((colour) => (
            <Pressable
              key={colour}
              onPress={() => set({ color: colour })}
              style={[
                styles.swatch,
                { backgroundColor: colour },
                effective.color?.toUpperCase() === colour && styles.swatchSelected,
              ]}
            />
          ))}
        </View>
        <TextInput
          value={effective.color ?? ''}
          onChangeText={(color) => set({ color })}
          placeholder="#FFFFFF"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="characters"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Italic</Text>
        <View style={styles.row}>
          <Toggle
            label="Normal"
            active={(effective.fontStyle ?? 'normal') === 'normal'}
            onPress={() => set({ fontStyle: 'normal' })}
          />
          <Toggle
            label="Italic"
            active={effective.fontStyle === 'italic'}
            onPress={() => set({ fontStyle: 'italic' })}
          />
        </View>
      </View>

      {hasOverrides && (
        <Pressable style={styles.reset} onPress={() => onChange({})}>
          <Text style={styles.resetLabel}>Reset type to the theme</Text>
        </Pressable>
      )}
    </View>
  );
}

function NumberField({
  label,
  value,
  step = 1,
  onChange,
}: {
  label: string;
  value: number | undefined;
  step?: number;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <View style={styles.numberField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable
          style={styles.stepButton}
          onPress={() => onChange(Math.max(0, (value ?? 16) - step))}>
          <Text style={styles.stepLabel}>−</Text>
        </Pressable>
        <TextInput
          value={value === undefined ? '' : String(value)}
          onChangeText={(text) => {
            const next = Number(text);
            onChange(text.trim() === '' ? undefined : Number.isFinite(next) ? next : value);
          }}
          keyboardType="numeric"
          placeholder="—"
          placeholderTextColor={Colors.textMuted}
          style={styles.stepInput}
        />
        <Pressable style={styles.stepButton} onPress={() => onChange((value ?? 16) + step)}>
          <Text style={styles.stepLabel}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.segmented}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, value === option.value && styles.segmentActive]}>
            <Text
              style={[styles.segmentLabel, value === option.value && styles.segmentLabelActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Toggle({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.segment, active && styles.segmentActive, styles.grow]}>
      <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  grow: {
    flex: 1,
  },
  fontButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  fontButtonText: {
    flex: 1,
    gap: 3,
  },
  fontName: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.text,
  },
  chevron: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  fontPanel: {
    gap: 6,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chips: {
    gap: 4,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  chipLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  chipLabelActive: {
    color: Colors.background,
  },
  fontList: {
    maxHeight: 190,
  },
  fontRow: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  fontRowSelected: {
    backgroundColor: Colors.border,
  },
  fontSample: {
    fontSize: 15,
    color: Colors.text,
  },
  numberField: {
    flex: 1,
    // Without an explicit zero minimum, flex refuses to shrink these below the
    // intrinsic width of the <input> inside, and the three-up row overflows the
    // inspector — pushing "Line height" and "Spacing" off-screen entirely.
    minWidth: 0,
    gap: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  stepButton: {
    width: 22,
    flexShrink: 0,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.textMuted,
  },
  stepInput: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.text,
    paddingVertical: 0,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  segmentLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  segmentLabelActive: {
    color: Colors.background,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  swatchSelected: {
    borderColor: '#60A5FA',
  },
  input: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  reset: {
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  resetLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
