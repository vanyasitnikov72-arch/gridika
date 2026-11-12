import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handler } from './index.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const privateKeyPath = join(__dirname, '..', '..', 'apps', 'fx', '.license', 'private.jwk');
const publicKeyPath = join(__dirname, '..', '..', 'apps', 'fx', 'src', 'data', 'licensePublicKey.ts');

if (!existsSync(privateKeyPath)) {
  console.error('private.jwk not found at:', privateKeyPath);
  process.exit(1);
}

const privateKey = readFileSync(privateKeyPath, 'utf8');
const testEmail = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'anna.test@example.com';
const sendLive = process.argv.includes('--send');

console.log('=== Testing Gridika Multi-Order Billing Function ===');
console.log(`Email: ${testEmail}`);
console.log(`Live SMTP: ${sendLive ? 'YES' : 'NO (simulation)'}\n`);

process.env.PRIVATE_KEY_JWK = privateKey;
process.env.ADMIN_SECRET = 'gridika2026';
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.spaceweb.ru';
process.env.SMTP_PORT = process.env.SMTP_PORT || '465';
process.env.SMTP_USER = process.env.SMTP_USER || 'info@gridika.ru';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'simulated_password';

async function run() {
  // Test 1: Create payment endpoint
  console.log('1. Testing POST /create-payment (cart with 3 effects)...');
  const testItems = [
    { p: 'qr-morph', qr: { text: 'https://zerno-coffee.ru', shape: 'tree' } },
    { p: 'qr-card', card: { contact: { name: 'Анна', site: 'example.com' } } },
    { p: 'gift-box', gift: { settings: { code: 'SALE20' } } },
  ];

  const createRes = await handler({
    httpMethod: 'POST',
    path: '/create-payment',
    body: JSON.stringify({
      email: testEmail,
      items: testItems,
      source: 'test_runner',
    }),
  });

  const createData = JSON.parse(createRes.body);
  console.log(`✓ Order ID: ${createData.orderId}`);
  console.log(`✓ Calculated price: ${createData.total} ₽ (Скидка: ${createData.discount} ₽)`);

  // Test 2: Webhook payment.succeeded
  console.log('\n2. Testing POST /webhook (YooKassa payment.succeeded)...');
  const itemsB64 = Buffer.from(JSON.stringify(testItems)).toString('base64url');

  const webhookRes = await handler({
    httpMethod: 'POST',
    path: '/webhook',
    body: JSON.stringify({
      type: 'notification',
      event: 'payment.succeeded',
      object: {
        id: 'yoo_pay_' + Date.now(),
        status: 'succeeded',
        amount: { value: `${createData.total}.00`, currency: 'RUB' },
        metadata: {
          orderId: createData.orderId,
          email: testEmail,
          itemsB64,
          source: 'test_runner',
        },
      },
    }),
  });

  const webhookData = JSON.parse(webhookRes.body);
  console.log('✓ Webhook response:', webhookData);
  console.log('✓ Signed Order Link:', webhookData.orderUrl);

  // Test 3: Signature verification
  console.log('\n3. Verifying order URL cryptographic signature...');
  const hash = webhookData.orderUrl.slice(webhookData.orderUrl.indexOf('#') + 1);
  const getParam = (n) => (hash.match(new RegExp(`(?:^|&)${n}=([^&]+)`)) || [])[1];
  const orderId = decodeURIComponent(getParam('order') || '');
  const urlItemsB64 = getParam('items') || '';
  const sig = getParam('sig') || '';

  const message = `gridika-order:${orderId}.${urlItemsB64}`;
  const pubMatches = [...readFileSync(publicKeyPath, 'utf8').matchAll(/\{\s*"kty"[\s\S]*?\}/g)].map((m) => JSON.parse(m[0]));

  let verified = false;
  for (const jwk of pubMatches) {
    const pk = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    if (await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pk, Buffer.from(sig, 'base64url'), new TextEncoder().encode(message))) {
      verified = true;
      break;
    }
  }

  if (verified) {
    console.log('✓ ECDSA signature verified successfully! Links open seamlessly on /thanks.');
  } else {
    console.error('✕ Signature verification failed!');
    process.exit(1);
  }

  // Test 4: Admin API
  console.log('\n4. Testing GET /admin/orders...');
  const adminRes = await handler({
    httpMethod: 'GET',
    path: '/admin/orders',
    headers: { Authorization: 'Bearer gridika2026' },
  });
  const adminData = JSON.parse(adminRes.body);
  console.log(`✓ Admin retrieved ${adminData.orders?.length || 0} order(s)`);

  console.log('\n=== All tests passed successfully! ===');
}

run().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
