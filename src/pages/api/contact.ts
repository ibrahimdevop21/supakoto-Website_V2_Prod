// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

/**
 * ──────────────────────────────────────────────────────────────────────────────
 *  ENV VARS (Vercel → Settings → Environment Variables)
 * ──────────────────────────────────────────────────────────────────────────────
 *  MAIL_HOST=mail.privateemail.com
 *  MAIL_PORT=587                      // 465 for SSL, 587 for STARTTLS
 *  MAIL_USER=leads@supakoto.org       // your authenticated sender
 *  MAIL_PASS=********
 *
 *  SALES_EGYPT_EMAIL=egypt@supakoto.org
 *  SALES_DUBAI_EMAIL=uae@supakoto.org
 *  SALES_FALLBACK_EMAIL=sales@supakoto.org
 *
 *  RESPOND_IO_WEBHOOK_URL=https://…   // optional
 */

export const prerender = false;

// -------------------- ENV --------------------
const MAIL_HOST = import.meta.env.MAIL_HOST || 'mail.privateemail.com';
const MAIL_PORT = Number(import.meta.env.MAIL_PORT || 587);
const MAIL_USER = import.meta.env.MAIL_USER;
const MAIL_PASS = import.meta.env.MAIL_PASS;

const SALES_EGYPT_EMAIL = import.meta.env.SALES_EGYPT_EMAIL || 'egypt@supakoto.org';
const SALES_DUBAI_EMAIL = import.meta.env.SALES_DUBAI_EMAIL || 'uae@supakoto.org';
const SALES_FALLBACK_EMAIL = import.meta.env.SALES_FALLBACK_EMAIL || 'sales@supakoto.org';

const RESPOND_IO_WEBHOOK_URL = import.meta.env.RESPOND_IO_WEBHOOK_URL;

// anti-spam
const MIN_LOAD_TIME_MS = 2000; // must be ≥ this between page load & submit

// -------------------- helpers --------------------
function createTransporter() {
  if (!MAIL_USER || !MAIL_PASS) {
    throw new Error('Missing MAIL_USER / MAIL_PASS');
  }
  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_PORT === 465, // SSL on 465, STARTTLS on 587
    auth: { user: MAIL_USER, pass: MAIL_PASS },
    // If your provider’s cert chain is valid, keep this true:
    tls: { rejectUnauthorized: true },
  });
}

function routeByPhone(phone: string) {
  if (phone.startsWith('+20')) return SALES_EGYPT_EMAIL;
  if (phone.startsWith('+971')) return SALES_DUBAI_EMAIL;
  return SALES_FALLBACK_EMAIL;
}

function regionFlag(phone: string) {
  if (phone.startsWith('+20')) return 'Egypt 🇪🇬';
  if (phone.startsWith('+971')) return 'UAE 🇦🇪';
  return 'Unknown';
}

function mapServices(services: FormDataEntryValue[]) {
  const dict: Record<string, { en: string; ar: string }> = {
    ppf: { en: 'Paint Protection Film (PPF)', ar: 'فيلم حماية الطلاء' },
    ceramic: { en: 'Ceramic Coating', ar: 'طلاء السيراميك' },
    heat_uv_isolation: { en: 'Heat/UV Isolation', ar: 'عزل الحرارة والأشعة فوق البنفسجية' },
    window_tinting: { en: 'Window Tinting', ar: 'تظليل النوافذ' },
    building_heat_uv_isolation: { en: 'Building Heat/UV Isolation', ar: 'عزل الحرارة والأشعة فوق البنفسجية للمباني' },
  };
  const list = services.filter((s): s is string => typeof s === 'string');
  return list.map((k) => (dict[k] ? `${dict[k].en} (${dict[k].ar})` : k)).join(', ');
}

function esc(s?: string) {
  if (!s) return '';
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildHtml(payload: {
  name: string;
  email?: string;
  phone: string;
  servicesText: string;
  message?: string;
  branchId?: string;
}) {
  const country = regionFlag(payload.phone);
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>New Lead</title>
<style>
  body{font-family:Arial,system-ui,-apple-system,Segoe UI,Roboto;line-height:1.55;background:#f6f7f9;color:#0f172a;margin:0;padding:24px}
  .card{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 8px 28px rgba(15,23,42,.08);overflow:hidden}
  .hdr{background:linear-gradient(135deg,#bf1e2e,#6a343a);color:#fff;padding:22px 24px}
  .cnt{padding:22px 24px}
  .fld{background:#f8fafc;border-left:4px solid #bf1e2e;border-radius:0 10px 10px 0;padding:12px 14px;margin-bottom:12px}
  .lbl{font-weight:700;color:#bf1e2e;margin-bottom:4px}
  .ok{border-left-color:#16a34a;background:#ecfdf5}
  .msg{border-left-color:#f59e0b;background:#fffbeb}
  .ftr{padding:16px 20px;background:#f8fafc;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;text-align:center}
  a{color:#bf1e2e;text-decoration:none}
</style>
</head>
<body>
  <div class="card">
    <div class="hdr"><strong>🚗 New Lead from SupaKoto Website</strong></div>
    <div class="cnt">
      <div class="fld"><div class="lbl">📍 Lead Region</div>${esc(country)}</div>
      <div class="fld"><div class="lbl">👤 Full Name</div>${esc(payload.name)}</div>
      ${payload.email ? `<div class="fld"><div class="lbl">✉️ Email</div><a href="mailto:${esc(payload.email)}">${esc(payload.email)}</a></div>` : ''}
      <div class="fld"><div class="lbl">📱 Phone</div><a href="tel:${esc(payload.phone)}">${esc(payload.phone)}</a></div>
      ${payload.branchId ? `<div class="fld"><div class="lbl">🏷 Branch</div>${esc(payload.branchId)}</div>` : ''}
      <div class="fld ok"><div class="lbl">🔧 Services</div>${esc(payload.servicesText || '—')}</div>
      ${payload.message ? `<div class="fld msg"><div class="lbl">💬 Message</div>${esc(payload.message).replace(/\n/g,'<br>')}</div>` : ''}
      <div class="fld"><div class="lbl">⏰ Submitted</div>${new Date().toLocaleString('en-US',{hour12:false})}</div>
    </div>
    <div class="ftr">Routed to <strong>${esc(routeByPhone(payload.phone))}</strong></div>
  </div>
</body></html>`;
}

async function sendRespondIO(data: {
  name: string;
  email?: string;
  phone: string;
  services: FormDataEntryValue[] | string[];
  message?: string;
  country?: string; // AE/EG
  branch_id?: string;
}) {
  if (!RESPOND_IO_WEBHOOK_URL) return;
  try {
    await fetch(RESPOND_IO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        services: Array.isArray(data.services) ? data.services : [data.services],
        message: data.message || '',
        country: data.country || (data.phone.startsWith('+20') ? 'EG' : 'AE'),
        branch_id: data.branch_id || '',
        source: 'website_contact_form',
        ts: new Date().toISOString(),
      }),
    });
  } catch (e) {
    // non-blocking
    console.warn('Respond.io webhook error:', e);
  }
}

// -------------------- API --------------------
export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();

    // core fields
    const name = (form.get('name') || '').toString().trim();
    const email = (form.get('email') || '').toString().trim(); // optional
    const phone = (form.get('phone') || '').toString().trim(); // E.164 from client
    const services = form.getAll('services');
    const message = (form.get('message') || '').toString().trim();
    const country = (form.get('country') || '').toString().trim();   // AE/EG (optional)
    const branch_id = (form.get('branch_id') || '').toString().trim();

    // anti-spam (honeypot should be empty)
    const hp = (form.get('_hp') || '').toString().trim();
    const lt = Number((form.get('_lt') || '0').toString());

    if (hp) {
      // silently accept to confuse bots
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (!name || !phone) {
      return new Response(JSON.stringify({ error: 'Name and phone are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // optional email validation
    if (email) {
      const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!rx.test(email)) {
        return new Response(JSON.stringify({ error: 'Invalid email address' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Egypt/UAE E.164 phone validation
    if (!/^\+(?:20|971)\d{8,10}$/.test(phone)) {
      return new Response(JSON.stringify({ error: 'Invalid phone number format' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // load time check
    if (!Number.isNaN(lt) && lt < MIN_LOAD_TIME_MS) {
      return new Response(JSON.stringify({ error: 'Please wait a moment before submitting' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // reasonable name length
    if (name.length < 2 || name.length > 100) {
      return new Response(JSON.stringify({ error: 'Name must be between 2 and 100 characters' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const servicesText = mapServices(services);
    const to = routeByPhone(phone);
    const transporter = createTransporter();

    const region = regionFlag(phone);
    const subject =
      `New Lead • ${region} • ${name}${branch_id ? ` • ${branch_id}` : ''}`;

    const html = buildHtml({
      name,
      email: email || undefined,
      phone,
      servicesText,
      message,
      branchId: branch_id || undefined,
    });

    const text = [
      'New Lead from SupaKoto Website',
      `Region: ${region}`,
      `Name: ${name}`,
      email ? `Email: ${email}` : '',
      `Phone: ${phone}`,
      branch_id ? `Branch: ${branch_id}` : '',
      `Services: ${servicesText || '—'}`,
      message ? `Message:\n${message}` : '',
      `Submitted: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    await transporter.sendMail({
      from: `"SupaKoto Website" <${MAIL_USER}>`,
      to,
      cc: SALES_FALLBACK_EMAIL !== to ? SALES_FALLBACK_EMAIL : undefined,
      subject,
      html,
      text,
    });

    // optional: fire-and-forget CRM hook
    sendRespondIO({
      name,
      email,
      phone,
      services,
      message,
      country,
      branch_id,
    }).catch(() => {});

    return new Response(
      JSON.stringify({ success: true, routed_to: to }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({
        error: 'Failed to send message. Please try again or contact us directly.',
        details: err?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
