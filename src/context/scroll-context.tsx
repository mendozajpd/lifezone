import { createContext, useCallback, useContext, useMemo, useRef, type PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';

import { HEADER_HEIGHT } from '@/constants/layout';

type ScrollContextValue = {
  scrollRef: React.RefObject<ScrollView | null>;
  registerSection: (id: string, y: number) => void;
  scrollToSection: (id: string) => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: PropsWithChildren) {
  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});

  const registerSection = useCallback((id: string, y: number) => {
    offsets.current[id] = y;
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const y = offsets.current[id];
    if (y === undefined) return;
    scrollRef.current?.scrollTo({ y: Math.max(y - HEADER_HEIGHT, 0), animated: true });
  }, []);

  const value = useMemo(
    () => ({ scrollRef, registerSection, scrollToSection }),
    [registerSection, scrollToSection]
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return ctx;
}
