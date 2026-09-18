import { View } from 'react-native';

import { ContactForm } from '@/components/sections/contact-form';
import { Logo } from '@/components/ui/logo';
import { LogoName } from '@/components/ui/logo-name';
import { useSiteTheme } from '@/render/context';
import { resolveSpacing } from '@/render/style';
import type { Block } from '@/schema/types';

type LogoBlockData = Extract<Block, { kind: 'logo' }>;
type DividerData = Extract<Block, { kind: 'divider' }>;
type SpacerData = Extract<Block, { kind: 'spacer' }>;
type ContactFormData = Extract<Block, { kind: 'contactForm' }>;

export function LogoBlock({ block }: { block: LogoBlockData }) {
  const Component = block.variant === 'name' ? LogoName : Logo;
  return (
    <View style={resolveSpacing(block)}>
      <Component size={block.size} />
    </View>
  );
}

export function DividerBlock({ block }: { block: DividerData }) {
  const theme = useSiteTheme();
  return (
    <View
      style={[
        { height: 1, width: '100%', backgroundColor: theme.colors.border },
        resolveSpacing(block),
      ]}
    />
  );
}

export function SpacerBlock({ block }: { block: SpacerData }) {
  return <View style={{ height: block.height }} />;
}

export function ContactFormBlock({ block }: { block: ContactFormData }) {
  return (
    <View style={resolveSpacing(block)}>
      <ContactForm />
    </View>
  );
}
