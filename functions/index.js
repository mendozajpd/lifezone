const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const nodemailer = require('nodemailer');
const cors = require('cors');

const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

const ALLOWED_ORIGINS = [
  'https://nltac-lifezone.web.app',
  'https://nltac-lifezone.firebaseapp.com',
  'http://localhost:8081',
  'http://localhost:3000',
];

const corsHandler = cors({ origin: ALLOWED_ORIGINS });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// In-memory per-IP rate limit. Paired with maxInstances: 1 below so every
// request hits the same instance and shares this map — otherwise Cloud Run
// could spin up multiple instances and each would count independently.
const submissionsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    submissionsByIp.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissionsByIp.set(ip, recent);
  return false;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip;
}

exports.sendContactMessage = onRequest(
  { region: 'asia-southeast1', secrets: [GMAIL_APP_PASSWORD], maxInstances: 1 },
  (req, res) => {
    corsHandler(req, res, async () => {
      if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'Method not allowed.' });
        return;
      }

      if (isRateLimited(getClientIp(req))) {
        res.status(429).json({ ok: false, error: 'Too many messages sent. Please try again in a few minutes.' });
        return;
      }

      const { name, email, message, company } = req.body ?? {};

      // Honeypot field: left blank by real visitors, often filled in by bots.
      if (typeof company === 'string' && company.trim().length > 0) {
        res.status(200).json({ ok: true });
        return;
      }

      if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
        res.status(400).json({ ok: false, error: 'A valid email is required.' });
        return;
      }

      if (typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ ok: false, error: 'A message is required.' });
        return;
      }

      if (message.length > 5000) {
        res.status(400).json({ ok: false, error: 'Message is too long.' });
        return;
      }

      const gmailUser = process.env.GMAIL_USER;
      const contactEmail = process.env.CONTACT_EMAIL || gmailUser;
      const senderName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : 'a website visitor';

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: GMAIL_APP_PASSWORD.value(),
        },
      });

      try {
        await transporter.sendMail({
          from: `Lifezone Website <${gmailUser}>`,
          to: contactEmail,
          replyTo: email,
          subject: `New message from ${senderName}`,
          text: `From: ${senderName} <${email}>\n\n${message}`,
        });
        res.status(200).json({ ok: true });
      } catch (error) {
        console.error('Failed to send contact email', error);
        res.status(500).json({ ok: false, error: 'Failed to send message. Please try again later.' });
      }
    });
  }
);
