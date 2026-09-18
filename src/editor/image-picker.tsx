import { Image } from 'expo-image';
import { useCallback, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { resolveMediaSource } from '@/render/media';
import { BUNDLED_MEDIA_KEYS, bundled } from '@/schema/media-registry';
import type { MediaRef } from '@/schema/types';

/**
 * Picks the picture for an image block: upload a new one, or reuse a photo that
 * ships with the site.
 */
export function ImagePicker({
  media,
  onChange,
}: {
  media: MediaRef;
  onChange: (media: MediaRef) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const { uploadImage } = await import('@/lib/firebase');
        const uploaded = await uploadImage(file);
        onChange({
          kind: 'uploaded',
          mediaId: uploaded.mediaId,
          url: uploaded.url,
          width: uploaded.width,
          height: uploaded.height,
          alt: media.alt ?? file.name.replace(/\.[^.]+$/, ''),
        });
      } catch (uploadError) {
        setError(
          uploadError instanceof Error ? uploadError.message : 'Upload failed. Please try again.'
        );
      } finally {
        setUploading(false);
      }
    },
    [media.alt, onChange]
  );

  // A hidden <input type="file"> is the only way to open the OS picker on web;
  // react-native has no equivalent primitive.
  const openPicker = useCallback(() => {
    if (Platform.OS !== 'web') return;

    if (!inputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (file) void handleFile(file);
        input.value = '';
      });
      document.body.appendChild(input);
      inputRef.current = input;
    }
    inputRef.current.click();
  }, [handleFile]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Picture</Text>

      <View style={styles.currentWrap}>
        <Image
          source={resolveMediaSource(media)}
          style={styles.current}
          contentFit="cover"
          alt={media.alt}
        />
      </View>

      <Pressable
        onPress={openPicker}
        disabled={uploading}
        style={({ pressed }) => [
          styles.upload,
          pressed && !uploading && styles.uploadPressed,
          uploading && styles.dim,
        ]}>
        <Text style={styles.uploadLabel}>
          {uploading ? 'Uploading…' : 'Upload a picture'}
        </Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.sublabel}>Or use one from the site</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {BUNDLED_MEDIA_KEYS.map((key) => {
          const selected = media.kind === 'bundled' && media.key === key;
          return (
            <Pressable
              key={key}
              onPress={() => onChange(bundled(key, media.alt ?? 'Site photo'))}
              style={[styles.thumbWrap, selected && styles.thumbSelected]}>
              <Image
                source={resolveMediaSource(bundled(key, ''))}
                style={styles.thumb}
                contentFit="cover"
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  sublabel: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  currentWrap: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  current: {
    width: '100%',
    height: '100%',
  },
  upload: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.text,
    alignItems: 'center',
  },
  uploadPressed: {
    opacity: 0.85,
  },
  uploadLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.background,
  },
  strip: {
    gap: 6,
    paddingVertical: 2,
  },
  thumbWrap: {
    width: 58,
    height: 44,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbSelected: {
    borderColor: Colors.text,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  dim: {
    opacity: 0.5,
  },
  error: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
    color: '#F87171',
  },
});
