import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handler } from './index.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const privateKeyPath = join(__dirname, '..', '..', 'apps', 'fx', '.license', 'private.jwk');

if (!existsSync(privateKeyPath)) {
  console.error('private.jwk not found at:', privateKeyPath);
  process.exit(1);
}

const privateKey = readFileSync(privateKeyPath, 'utf8');
const testEmail = process.argv[2] || 'test@example.com';
const sendLive = process.argv.includes('--send');

console.log('--- Testing Gridika Billing Webhook locally ---');
console.log(`Target email: ${testEmail}`);
console.log(`Send live via SMTP: ${sendLive ? 'YES' : 'NO (simulation)'}`);

process.env.PRIVATE_KEY_JWK = privateKey;
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.spaceweb.ru';
process.env.SMTP_PORT = process.env.SMTP_PORT || '465';
process.env.SMTP_USER = process.env.SMTP_USER || 'info@gridika.ru';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'simulated_password';

if (!sendLive) {
  // Mock nodemailer sendMail if not testing live SMTP
  import('nodemailer').then((nodemailer) => {
    nodemailer.default.createTransport = () => ({
      sendMail: async (opts) => {
        console.log('\n[SIMULATED SMTP DISPATCH]');
        console.log(`From:    ${opts.from}`);
        console.log(`To:      ${opts.to}`);
        console.log(`Subject: ${opts.subject}`);
        console.log(`HTML size: ${opts.html.length} bytes`);
        console.log('✓ Email rendered successfully!\n');
        return { messageId: 'simulated-' + Date.now() };
      },
    });
    runTest();
  });
} else {
  runTest();
}

async function runTest() {
  const simulatedYooKassaPayload = {
    type: 'notification',
    event: 'payment.succeeded',
    object: {
      id: 'test_payment_' + Date.now(),
      status: 'succeeded',
      amount: { value: '990.00', currency: 'RUB' },
      metadata: {
        product: 'qr-card',
        domain: 'coffee-shop.ru',
        name: 'Анна Смирнова',
        email: testEmail,
      },
      receipt: {
        customer: { email: testEmail },
      },
    },
  };

  const event = {
    httpMethod: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(simulatedYooKassaPayload),
  };

  const response = await handler(event, {});
  console.log('Handler response:');
  console.log(response);

  if (response.statusCode === 200) {
    console.log('\n✅ TEST PASSED: Key was generated, signed, and packaged into email!');
  } else {
    console.error('\n❌ TEST FAILED with status code:', response.statusCode);
  }
}
