// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { track } from '@vercel/analytics/server';

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const fd = await request.formData();

    const name      = fd.get('name')?.toString().trim() || '';
    const email     = fd.get('email')?.toString().trim() || '';
    const phone     = fd.get('phone')?.toString().trim() || '';
    const message   = fd.get('message')?.toString().trim() || '';
    const country   = fd.get('country')?.toString().trim() || '';     // 'AE' | 'EG'
    const branchId  = fd.get('branch_id')?.toString().trim() || '';
    
    // New wizard fields
    const carMake   = fd.get('car_make')?.toString().trim() || '';
    const carYear   = fd.get('car_year')?.toString().trim() || '';
    const paymentsRaw = fd.get('payments')?.toString() || '[]';
    const whatsappOnly = fd.get('whatsapp_only')?.toString() || 'no';

    // services can be "services" or "services[]" or JSON string from wizard
    let servicesRaw: string[] = [];
    const servicesField = fd.get('services')?.toString();
    if (servicesField) {
      try {
        // Try parsing as JSON first (from wizard)
        servicesRaw = JSON.parse(servicesField);
      } catch {
        // Fallback to form array handling
        servicesRaw = (fd.getAll('services').length ? fd.getAll('services') : fd.getAll('services[]'))
          .map(v => v?.toString() || '')
          .filter(Boolean);
      }
    }

    // Parse payments
    let selectedPayments: string[] = [];
    try {
      selectedPayments = JSON.parse(paymentsRaw);
    } catch {
      // If parsing fails, it's okay - payments are optional
    }

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

    // Unified email routing - all submissions go to leads inbox
    const leadsEmail = (import.meta.env.LEADS_EMAIL || 'leads@supakoto.org').trim();
    const adminEmail = (import.meta.env.ADMIN_EMAIL || 'admin@supakoto.org').trim();

    // Generate unique lead ID
    const leadId = `SK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // build email
    const subject = `New SupaKoto Lead — ${servicesRaw.join(', ') || 'General'} — ${name}`;
    const html = `
      <div style="font-family:Inter,Arial,sans-serif">
        <h2>🚗 New lead from SupaKoto website</h2>
        <p><b>Lead ID:</b> ${esc(leadId)}</p>
        <p><b>Name:</b> ${esc(name)}</p>
        ${email ? `<p><b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ''}
        <p><b>Phone:</b> <a href="tel:${esc(phone)}">${esc(phone)}</a></p>
        ${country ? `<p><b>Country:</b> ${esc(country)}</p>` : ''}
        ${branchId ? `<p><b>Branch ID:</b> ${esc(branchId)}</p>` : ''}
        <p><b>Services:</b> ${esc(servicesPretty.join(', '))}</p>
        ${carMake ? `<p><b>Car Make:</b> ${esc(carMake)}</p>` : ''}
        ${carYear ? `<p><b>Car Year:</b> ${esc(carYear)}</p>` : ''}
        ${selectedPayments.length ? `<p><b>Payment Options:</b> ${esc(selectedPayments.join(', '))}</p>` : ''}
        <p><b>WhatsApp Only:</b> ${whatsappOnly === 'yes' ? 'Yes' : 'No'}</p>
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
      console.log('To:', leadsEmail);
      console.log('CC:', adminEmail);
      console.log('Subject:', subject);
      console.log('HTML:', html);
      console.log('=== END EMAIL ===');
    } else {
      // Production mode - actually send email
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from,
        to: [leadsEmail],
        cc: [adminEmail],
        subject,
        html,
      });
    }

    // Track successful form submission with Vercel Analytics
    await track('form_submit', {
      form_type: 'contact',
      services: servicesRaw.join(','),
      country: country || 'unknown',
      branch: branchId || 'none',
      has_car_info: carMake ? 'yes' : 'no',
      whatsapp_only: whatsappOnly,
      payment_options: selectedPayments.length > 0 ? 'yes' : 'no'
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      leadId, 
      country, 
      branch_id: branchId, 
      whatsappOnly: whatsappOnly === 'yes', 
      payments: selectedPayments 
    }), {
      status: 200, headers: { 'content-type': 'application/json' }
    });

  } catch (err) {
    console.error('contact api error', err);
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500, headers: { 'content-type': 'application/json' }
    });
  }
};
