import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Footer } from '@/components/layout/footer';
import { NavBar } from '@/components/layout/nav-bar';
import { Contact } from '@/components/sections/contact';
import { Gallery } from '@/components/sections/gallery';
import { GetInvolved } from '@/components/sections/get-involved';
import { Hero } from '@/components/sections/hero';
import { Ministry } from '@/components/sections/ministry';
import { Vision } from '@/components/sections/vision';
import { HEADER_HEIGHT } from '@/constants/layout';
import { Colors } from '@/constants/theme';
import { useScroll } from '@/context/scroll-context';

export default function HomeScreen() {
  const { scrollRef } = useScroll();

  return (
    <>
      <NavBar />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Hero/>
        <Vision />
        <Ministry />
        <Gallery />
        <GetInvolved />
        <Contact />
        <Footer />
      </ScrollView>
    </>
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
