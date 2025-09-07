import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// --------------------
// ENV
// --------------------
const MAIL_HOST = import.meta.env.MAIL_HOST || 'mail.privateemail.com';
const MAIL_PORT = parseInt(import.meta.env.MAIL_PORT || '587');
const MAIL_USER = import.meta.env.MAIL_USER;
const MAIL_PASS = import.meta.env.MAIL_PASS;

const SALES_EGYPT_EMAIL   = import.meta.env.SALES_EGYPT_EMAIL   || 'egypt@supakoto.org';
const SALES_DUBAI_EMAIL   = import.meta.env.SALES_DUBAI_EMAIL   || 'uae@supakoto.org';
const SALES_FALLBACK_EMAIL= import.meta.env.SALES_FALLBACK_EMAIL|| 'sales@supakoto.org';

const MIN_LOAD_TIME = 2000; // ms
const RESPOND_IO_WEBHOOK_URL = import.meta.env.RESPOND_IO_WEBHOOK_URL;

export const prerender = false;

// --------------------
// Helpers
// --------------------
function createTransporter() {
  if (!MAIL_USER || !MAIL_PASS) {
    throw new Error('Email credentials not configured. Set MAIL_USER and MAIL_PASS.');
  }
  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_PORT === 465,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
    tls: { rejectUnauthorized: false }, // ok for Namecheap/preview; keep true if your certs are solid
  });
}

function routeEmailByPhone(phone: string): string {
  if (phone.startsWith('+20'))  return SALES_EGYPT_EMAIL;
  if (phone.startsWith('+971')) return SALES_DUBAI_EMAIL;
  return SALES_FALLBACK_EMAIL;
}

function mapServices(services: FormDataEntryValue[]): string {
  const map: Record<string, { en: string; ar: string }> = {
    ppf: { en: 'Paint Protection Film (PPF)', ar: 'فيلم حماية الطلاء' },
    ceramic: { en: 'Ceramic Coating', ar: 'طلاء السيراميك' },
    heat_uv_isolation: { en: 'Heat/UV Isolation', ar: 'عزل الحرارة والأشعة فوق البنفسجية' },
    window_tinting: { en: 'Window Tinting', ar: 'تظليل النوافذ' },
    building_heat_uv_isolation: { en: 'Building Heat/UV Isolation', ar: 'عزل الحرارة والأشعة فوق البنفسجية للمباني' },
  };
  const list = services.filter((s): s is string => typeof s === 'string');
  return list.map(k => map[k] ? `${map[k].en} (${map[k].ar})` : k).join(', ');
}

function esc(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function leadRegion(phone: string) {
  return phone.startsWith('+20') ? 'Egypt 🇪🇬' : phone.startsWith('+971') ? 'UAE 🇦🇪' : 'Unknown';
}

function emailHtml(data: {
  name: string;
  email?: string;
  phone: string;
  servicesText: string;
  message?: string;
  branchId?: string;
}) {
  const country = leadRegion(data.phone);
  return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Lead - SupaKoto</title>
  <style>
    body { font-family: Arial, sans-serif; line-height:1.6; color:#0f172a; margin:0; padding:20px; background:#f4f4f5; }
    .container { max-width:640px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(2,6,23,.08); }
    .header { background:linear-gradient(135deg,#bf1e2e,#6a343a); color:#fff; padding:24px; text-align:center; }
    .content { padding:24px; }
    .field { margin:0 0 14px; padding:14px; background:#f8fafc; border-left:4px solid #bf1e2e; border-radius:0 8px 8px 0; }
    .field-label { font-weight:700; color:#bf1e2e; margin:0 0 4px; }
    .services { border-left-color:#16a34a; background:#ecfdf5; }
    .message  { border-left-color:#f59e0b; background:#fffbeb; }
    .footer { background:#f8fafc; padding:18px; text-align:center; color:#6b7280; border-top:1px solid #e5e7eb; font-size:12px; }
    a { color:#bf1e2e; text-decoration:none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h2 style="margin:0;">🚗 New Lead from SupaKoto Website</h2></div>
    <div class="content">
      <div class="field"><div class="field-label">📍 Lead Region</div><div>${esc(country)}</div></div>
      <div class="field"><div class="field-label">👤 Full Name</div><div>${esc(data.name)}</div></div>
      ${
        data.email
          ? `<div class="field"><div class="field-label">✉️ Email</div><div><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></div></div>`
          : ''
      }
      <div class="field"><div class="field-label">📱 Phone</div><div><a href="tel:${esc(data.phone)}">${esc(data.phone)}</a></div></div>
      ${
        data.branchId
          ? `<div class="field"><div class="field-label">🏷 Branch</div><div>${esc(data.branchId)}</div></div>`
          : ''
      }
      <div class="field services"><div class="field-label">🔧 Services</div><div>${esc(data.servicesText || '—')}</div></div>
      ${
        data.message
          ? `<div class="field message"><div class="field-label">💬 Message</div><div>${esc(data.message).replace(/\n/g,'<br>')}</div></div>`
          : ''
      }
      <div class="field"><div class="field-label">⏰ Submitted</div><div>${new Date().toLocaleString('en-US', { hour12:false })}</div></div>
    </div>
    <div class="footer">
      Lead email routing: ${esc(country)} → ${esc(routeEmailByPhone(data.phone))}
    </div>
  </div>
</body>
</html>
  `;
}

async function sendRespondIO(payload: any) {
  if (!RESPOND_IO_WEBHOOK_URL) return;
  try {
    await fetch(RESPOND_IO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn('Respond.io webhook error:', e);
  }
}

// --------------------
// API
// --------------------
export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();

    const name      = (form.get('name')      || '').toString().trim();
    const email     = (form.get('email')     || '').toString().trim(); // optional
    const phone     = (form.get('phone')     || '').toString().trim(); // E.164 from client
    const services  = form.getAll('services');
    const message   = (form.get('message')   || '').toString().trim();
    const country   = (form.get('country')   || '').toString().trim(); // AE/EG (optional here)
    const branch_id = (form.get('branch_id') || '').toString().trim();
    const hp        = (form.get('_hp')       || '').toString().trim(); // honeypot (should be empty)
    const lt        = (form.get('_lt')       || '').toString().trim(); // load time in ms

    // 1) Honeypot: reject only if it's filled (bots often fill hidden inputs)
    if (hp) {
      // Respond 200 (silent) so bots don't learn validation rules
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // 2) Basic required fields
    if (!name || !phone) {
      return new Response(JSON.stringify({ error: 'Name and phone are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3) Optional email validation (only if provided)
    if (email) {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(email)) {
        return new Response(JSON.stringify({ error: 'Invalid email address' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 4) Phone validation (Egypt/UAE E.164)
    if (!/^\+(?:20|971)\d{8,10}$/.test(phone)) {
      return new Response(JSON.stringify({ error: 'Invalid phone number format' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5) Load-time anti-spam
    const loadTime = parseInt(lt || '0', 10);
    if (!Number.isNaN(loadTime) && loadTime < MIN_LOAD_TIME) {
      return new Response(JSON.stringify({ error: 'Please wait a moment before submitting' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6) Name sanity
    if (name.length < 2 || name.length > 100) {
      return new Response(JSON.stringify({ error: 'Name must be between 2 and 100 characters' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const to = routeEmailByPhone(phone);
    const servicesText = mapServices(services);
    const transporter = createTransporter();

    const region = leadRegion(phone);
    const subject = `New Lead • ${region} • ${name}${branch_id ? ` • ${branch_id}` : ''}`;

    const html = emailHtml({ name, email: email || undefined, phone, servicesText, message, branchId: branch_id || undefined });
    const text = [
      `New Lead from SupaKoto Website`,
      `Region: ${region}`,
      `Name: ${name}`,
      email ? `Email: ${email}` : null,
      `Phone: ${phone}`,
      branch_id ? `Branch: ${branch_id}` : null,
      `Services: ${servicesText || '—'}`,
      message ? `Message:\n${message}` : null,
      `Submitted: ${new Date().toISOString()}`,
    ].filter(Boolean).join('\n');

    await transporter.sendMail({
      from: `"SupaKoto Website" <${MAIL_USER}>`,
      to,
      cc: SALES_FALLBACK_EMAIL !== to ? SALES_FALLBACK_EMAIL : undefined,
      subject,
      html,
      text,
    });

    // Non-blocking CRM hook
    sendRespondIO({
      name, email, phone,
      services: Array.isArray(services) ? services : [services],
      message,
      country: country || (phone.startsWith('+20') ? 'EG' : 'AE'),
      branch_id,
      source: 'website_contact_form',
      ts: new Date().toISOString(),
    }).catch(() => {});

    return new Response(JSON.stringify({ success: true, routed_to: to }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({
      error: 'Failed to send message. Please try again or contact us directly.',
      details: err?.message || 'Unknown error',
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

/*
ENV VARS (Vercel → Settings → Environment Variables):

MAIL_HOST=mail.privateemail.com
MAIL_PORT=587
MAIL_USER=leads@supakoto.org
MAIL_PASS=**************

SALES_EGYPT_EMAIL=egypt@supakoto.org
SALES_DUBAI_EMAIL=uae@supakoto.org
SALES_FALLBACK_EMAIL=sales@supakoto.org

RESPOND_IO_WEBHOOK_URL=https://hooks.respond.io/...

Notes:
- Set SPF/DKIM for your sending domain to avoid spam.
- Keep TLS rejectUnauthorized=false only if needed; prefer true in production if your cert chain is OK.
*/
