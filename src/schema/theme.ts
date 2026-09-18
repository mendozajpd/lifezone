import { Colors, Fonts } from '@/constants/theme';
import type { Theme } from '@/schema/types';

/**
 * The default theme, lifted verbatim from the hand-written section styles it
 * replaces. Every typographic slot the old components used has a role here, so
 * a block that names a role and overrides nothing renders exactly as before.
 */
export const DEFAULT_THEME: Theme = {
  colors: {
    background: Colors.background,
    surface: Colors.surface,
    border: Colors.border,
    text: Colors.text,
    textMuted: Colors.textMuted,
    accent: Colors.text,
  },
  radius: {
    card: 16,
    image: 16,
    pill: 999,
  },
  roles: {
    display: {
      fontFamily: Fonts.display,
      fontSize: 48,
      color: Colors.text,
      textAlign: 'center',
    },
    lead: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 17,
      lineHeight: 26,
      color: Colors.textMuted,
      textAlign: 'center',
      maxWidth: 560,
    },
    sectionTitle: {
      fontFamily: Fonts.display,
      fontSize: 28,
      color: Colors.text,
    },
    subTitle: {
      fontFamily: Fonts.display,
      fontSize: 20,
      color: Colors.text,
    },
    body: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 16,
      lineHeight: 26,
      color: Colors.textMuted,
    },
    bodySmall: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 15,
      lineHeight: 23,
      color: Colors.textMuted,
      maxWidth: 560,
    },
    caption: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 14,
      color: Colors.textMuted,
    },
    eyebrow: {
      fontFamily: Fonts.bodySemiBold,
      fontSize: 12,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: Colors.textMuted,
    },
    cardTitle: {
      fontFamily: Fonts.bodyBold,
      fontSize: 17,
      color: Colors.text,
    },
    cardBody: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 14,
      lineHeight: 21,
      color: Colors.textMuted,
    },
    chip: {
      fontFamily: Fonts.bodySemiBold,
      fontSize: 13,
      letterSpacing: 0.5,
      color: Colors.text,
    },
    tagline: {
      fontFamily: Fonts.bodyRegular,
      fontStyle: 'italic',
      fontSize: 13,
      color: Colors.textMuted,
    },
    infoValue: {
      fontFamily: Fonts.bodyMedium,
      fontSize: 16,
      color: Colors.text,
    },
    link: {
      fontFamily: Fonts.bodyMedium,
      fontSize: 14,
      color: Colors.text,
    },
    footerText: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 13,
      color: Colors.textMuted,
    },
    footerFine: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 12,
      color: Colors.textMuted,
    },
  },
};
