import { createContext, useContext, useEffect, useMemo, type PropsWithChildren } from 'react';
import { useWindowDimensions } from 'react-native';

import { BREAKPOINT_DESKTOP, BREAKPOINT_TABLET } from '@/constants/layout';
import { ensureFontsLoaded } from '@/render/fonts';
import type { Breakpoint, SiteVersion, Theme } from '@/schema/types';

type SiteRenderValue = {
  version: SiteVersion;
  theme: Theme;
  breakpoint: Breakpoint;
  /**
   * Forces a breakpoint regardless of viewport width. The editor's device
   * preview toggle sets this; the public site leaves it undefined.
   */
  forcedBreakpoint?: Breakpoint;
};

const SiteRenderContext = createContext<SiteRenderValue | null>(null);

function breakpointForWidth(width: number): Breakpoint {
  if (width >= BREAKPOINT_DESKTOP) return 'desktop';
  if (width >= BREAKPOINT_TABLET) return 'tablet';
  return 'base';
}

export function SiteRenderProvider({
  version,
  forcedBreakpoint,
  children,
}: PropsWithChildren<{ version: SiteVersion; forcedBreakpoint?: Breakpoint }>) {
  const { width } = useWindowDimensions();
  const breakpoint = forcedBreakpoint ?? breakpointForWidth(width);

  // Pull in any Google font this version references. Runs for the public site
  // too, since published content can name a family the bundle does not carry.
  useEffect(() => {
    ensureFontsLoaded(version);
  }, [version]);

  const value = useMemo<SiteRenderValue>(
    () => ({ version, theme: version.theme, breakpoint, forcedBreakpoint }),
    [version, breakpoint, forcedBreakpoint]
  );

  return <SiteRenderContext.Provider value={value}>{children}</SiteRenderContext.Provider>;
}

export function useSiteRender(): SiteRenderValue {
  const ctx = useContext(SiteRenderContext);
  if (!ctx) {
    throw new Error('useSiteRender must be used within a SiteRenderProvider');
  }
  return ctx;
}

export function useSiteTheme(): Theme {
  return useSiteRender().theme;
}

export function useBreakpoint(): Breakpoint {
  return useSiteRender().breakpoint;
}
