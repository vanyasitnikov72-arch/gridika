import nodemailer from 'nodemailer';
import { issueKey } from './signer.mjs';
import { renderEmail } from './emailTemplate.mjs';

/**
 * Yandex Cloud Function Handler for Gridika payments.
 * Supports:
 * - YooKassa Webhook (payment.succeeded)
 * - Robokassa ResultURL
 * - Direct test pings
 */
export async function handler(event, context) {
  // 1. Parse body
  let body = {};
  try {
    let raw = event.body || '{}';
    if (event.isBase64Encoded) {
      raw = Buffer.from(raw, 'base64').toString('utf8');
    }
    body = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (err) {
    console.error('Failed to parse request body:', err);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  // 2. Health check / GET ping
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok', service: 'gridika-billing-webhook' }),
    };
  }

  // 3. Extract payment payload
  let email = '';
  let product = 'qr-morph';
  let domain = '*';
  let name = '';
  let cfg = '';
  let orderId = '';
  let amount = '';

  // Check YooKassa format
  if (body.type === 'notification' && body.event === 'payment.succeeded') {
    const obj = body.object || {};
    orderId = obj.id;
    amount = obj.amount?.value;
    const meta = obj.metadata || {};
    email = meta.email || obj.receipt?.customer?.email || '';
    product = meta.product || meta.p || 'qr-morph';
    domain = meta.domain || meta.site || '*';
    name = meta.name || '';
    cfg = meta.cfg || '';
  }
  // Check Robokassa format (query or body)
  else if (body.InvId || event.queryStringParameters?.InvId) {
    const q = { ...event.queryStringParameters, ...body };
    orderId = q.InvId;
    amount = q.OutSum;
    email = q.EMail || q.shp_email || '';
    product = q.shp_product || 'qr-morph';
    domain = q.shp_domain || '*';
    name = q.shp_name || '';
    cfg = q.shp_cfg || '';
  }
  // Direct test or manual trigger
  else if (body.email) {
    email = body.email;
    product = body.product || 'qr-morph';
    domain = body.domain || '*';
    name = body.name || '';
    cfg = body.cfg || '';
    orderId = body.orderId || 'TEST-' + Date.now();
  } else {
    console.log('Ignored event or unhandled format:', body.event || body);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ignored', reason: 'Not a payment.succeeded event' }),
    };
  }

  if (!email || !email.includes('@')) {
    console.error('Missing customer email in payment object:', body);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Customer email not found in payment' }),
    };
  }

  // 4. Load signing key from env
  const privateKeyRaw = process.env.PRIVATE_KEY_JWK;
  if (!privateKeyRaw) {
    console.error('Environment variable PRIVATE_KEY_JWK is not set!');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server misconfiguration: missing private key' }),
    };
  }

  let privateKeyJwk;
  try {
    privateKeyJwk = JSON.parse(privateKeyRaw);
  } catch {
    console.error('Failed to parse PRIVATE_KEY_JWK JSON');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid PRIVATE_KEY_JWK format' }),
    };
  }

  // 5. Generate cryptographically signed key
  let license;
  try {
    license = await issueKey(privateKeyJwk, { product, domain, name });
  } catch (err) {
    console.error('Error generating license key:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to issue license key' }),
    };
  }

  // 6. Build action URLs
  let hash = `key=${encodeURIComponent(license.key)}`;
  if (cfg) {
    hash += `&cfg=${encodeURIComponent(cfg)}`;
  }
  const studioUrl = `https://gridika.ru/?fx=${product}#${hash}`;
  const readyUrl = `https://gridika.ru/thanks#${hash}`;

  // 7. Render HTML Email
  const html = renderEmail({
    product,
    key: license.key,
    keyId: license.keyId,
    domain,
    holder: name,
    studioUrl,
    readyUrl,
  });

  // 8. Send Email via SMTP
  const smtpHost = process.env.SMTP_HOST || 'smtp.spaceweb.ru';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER || 'info@gridika.ru';
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpPass) {
    console.error('Missing SMTP_PASS environment variable');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server misconfiguration: missing SMTP credentials' }),
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Gridika" <${smtpUser}>`,
      to: email,
      subject: `Ваш ключ Gridika (№ ${license.keyId})`,
      html,
    });
    console.log(`[SUCCESS] Email sent to ${email}, order=${orderId}, keyId=${license.keyId}, msgId=${info.messageId}`);
  } catch (err) {
    console.error('Failed to send email via SMTP:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to send key email via SMTP' }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'ok',
      orderId,
      keyId: license.keyId,
      recipient: email,
    }),
  };
}
