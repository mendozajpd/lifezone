import { Platform, ScrollView, StyleSheet } from 'react-native';

import { NavBar } from '@/components/layout/nav-bar';
import { PageMeta } from '@/components/layout/page-meta';
import { HEADER_HEIGHT } from '@/constants/layout';
import { SITE_TITLE } from '@/constants/site-meta';
import { Colors } from '@/constants/theme';
import { useScroll } from '@/context/scroll-context';
import { SiteRenderProvider } from '@/render/context';
import { SiteRenderer } from '@/render/site-renderer';
import { usePublishedSite } from '@/render/use-published-site';

export default function HomeScreen() {
  const { scrollRef } = useScroll();
  const { version } = usePublishedSite();

  return (
    <SiteRenderProvider version={version}>
      <PageMeta title={version.meta.title || SITE_TITLE} description={version.meta.description} />
      <NavBar />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SiteRenderer />
      </ScrollView>
    </SiteRenderProvider>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: Platform.OS === 'web' ? HEADER_HEIGHT : 0,
  },
});
