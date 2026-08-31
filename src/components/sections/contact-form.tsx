import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { CONTACT_FUNCTION_URL } from '@/constants/api';
import { Colors, Fonts, Spacing } from '@/constants/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState(''); // honeypot — left blank by real visitors
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!EMAIL_PATTERN.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (message.trim().length === 0) {
      setStatus('error');
      setErrorMessage('Please enter a message.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch(CONTACT_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.form}>
      <TextField label="Name (optional)" value={name} onChangeText={setName} placeholder="Your name" />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
      />
      <TextField
        label="Message"
        value={message}
        onChangeText={setMessage}
        placeholder="Share a prayer request or ask a question..."
        multiline
      />

      {/* Honeypot: hidden from real visitors, often auto-filled by bots. */}
      <View style={styles.honeypot} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <TextField label="Company" value={company} onChangeText={setCompany} />
      </View>

      <Button
        label={status === 'sending' ? 'Sending...' : 'Send message'}
        onPress={handleSubmit}
        disabled={status === 'sending'}
      />

      {status === 'sent' && <Text style={styles.successText}>Message sent — thank you! We'll be in touch.</Text>}
      {status === 'error' && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.md,
    maxWidth: 480,
  },
  honeypot: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
    overflow: 'hidden',
  },
  successText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
  },
  errorText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: '#F87171',
  },
});
