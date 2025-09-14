// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false; // must be dynamic

// map service codes → readable labels (EN + AR)
const SERVICE_MAP: Record<string, { en: string; ar: string }> = {
  ppf: { en: 'Paint Protection Film (PPF)', ar: 'فيلم حماية الطلاء' },
  ceramic: { en: 'Ceramic Coating', ar: 'نانو سيراميك' },
  heat_uv_isolation: { en: 'Heat/UV Isolation', ar: 'عزل الحرارة والأشعة فوق البنفسجية' },
  window_tinting: { en: 'Window Tinting', ar: 'تظليل النوافذ' },
  building_heat_uv_isolation: { en: 'Building Heat/UV Isolation', ar: 'عزل الحرارة/الأشعة للمباني' },
};

const esc = (s = '') =>
  s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!));

// Route logic: UAE vs EG
function routeEmailByCountry(country: string, phone: string) {
  const admin = (import.meta.env.ADMIN_EMAIL || 'admin@supakoto.org').trim();
  const uae = (import.meta.env.SALES_UAE_EMAIL || 'uae@supakoto.org').trim();
  const eg  = (import.meta.env.SALES_EGYPT_EMAIL || 'egypt@supakoto.org').trim();

  // Prefer explicit country from the form; fallback to phone prefix
  const c = (country || '').toUpperCase();
  if (c === 'AE') return { to: [uae], cc: [admin] };
  if (c === 'EG') return { to: [eg], cc: [admin] };

  if (phone.startsWith('+971')) return { to: [uae], cc: [admin] };
  if (phone.startsWith('+20'))  return { to: [eg],  cc: [admin] };

  // fallback: send both teams + admin
  return { to: [uae, eg], cc: [admin] };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const fd = await request.formData();

    const name      = fd.get('name')?.toString().trim() || '';
    const email     = fd.get('email')?.toString().trim() || '';
    const phone     = fd.get('phone')?.toString().trim() || '';
    const message   = fd.get('message')?.toString().trim() || '';
    const country   = fd.get('country')?.toString().trim() || '';     // 'AE' | 'EG'
    const branchId  = fd.get('branch_id')?.toString().trim() || '';

    // services can be "services" or "services[]"
    const servicesRaw =
      (fd.getAll('services').length ? fd.getAll('services') : fd.getAll('services[]'))
      .map(v => v?.toString() || '')
      .filter(Boolean);

    // spam controls (your form already sets these)
    const honeypot = fd.get('_hp')?.toString() || '';     // should be empty
    const loadMs   = parseInt(fd.get('_lt')?.toString() || '0', 10);

    // --- basic validation ---
    if (honeypot !== '') {
      // silent success to confuse bots
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
    if (loadMs < 1200) {
      return new Response(JSON.stringify({ ok: false, error: 'Too fast; please try again.' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (name.length < 2 || !phone) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (!servicesRaw.length) {
      return new Response(JSON.stringify({ ok: false, error: 'Select at least one service' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // readable services
    const servicesPretty = servicesRaw.map(s => SERVICE_MAP[s]?.en
      ? `${SERVICE_MAP[s].en} (${SERVICE_MAP[s].ar})`
      : s
    );

    // route selection
    const { to, cc } = routeEmailByCountry(country, phone);

    // build email
    const subject = `New SupaKoto Lead — ${servicesRaw.join(', ') || 'General'} — ${name}`;
    const html = `
      <div style="font-family:Inter,Arial,sans-serif">
        <h2>🚗 New lead from SupaKoto website</h2>
        <p><b>Name:</b> ${esc(name)}</p>
        ${email ? `<p><b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ''}
        <p><b>Phone:</b> <a href="tel:${esc(phone)}">${esc(phone)}</a></p>
        ${country ? `<p><b>Country:</b> ${esc(country)}</p>` : ''}
        ${branchId ? `<p><b>Branch ID:</b> ${esc(branchId)}</p>` : ''}
        <p><b>Services:</b> ${esc(servicesPretty.join(', '))}</p>
        ${message ? `<p><b>Message:</b><br>${esc(message).replace(/\n/g,'<br>')}</p>` : ''}
        <hr>
        <p style="font-size:12px;opacity:.7">Submitted: ${new Date().toISOString()}</p>
      </div>
    `;

    // send via Resend (only if API key is configured)
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const from = import.meta.env.EMAIL_FROM || 'leads@supakoto.org';

    if (!resendApiKey) {
      // Development mode - log the email instead of sending
      console.log('=== EMAIL WOULD BE SENT (no RESEND_API_KEY) ===');
      console.log('From:', from);
      console.log('To:', to);
      console.log('CC:', cc);
      console.log('Subject:', subject);
      console.log('HTML:', html);
      console.log('=== END EMAIL ===');
    } else {
      // Production mode - actually send email
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from,
        to,
        cc,
        subject,
        html,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'content-type': 'application/json' }
    });

  } catch (err) {
    console.error('contact api error', err);
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500, headers: { 'content-type': 'application/json' }
    });
  }
};
