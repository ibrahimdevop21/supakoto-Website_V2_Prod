// src/pages/api/business-contact.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false; // must be dynamic

const esc = (s = '') =>
  s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!));

export const POST: APIRoute = async ({ request }) => {
  try {
    const fd = await request.formData();

    const name = fd.get('name')?.toString().trim() || '';
    const company = fd.get('company')?.toString().trim() || '';
    const email = fd.get('email')?.toString().trim() || '';
    const phone = fd.get('phone')?.toString().trim() || '';
    const country = fd.get('country')?.toString().trim() || '';
    const inquiryType = fd.get('inquiry_type')?.toString().trim() || '';
    const message = fd.get('message')?.toString().trim() || '';

    // Spam controls
    const honeypot = fd.get('_hp')?.toString() || '';
    const loadMs = parseInt(fd.get('_lt')?.toString() || '0', 10);

    // Basic validation
    if (honeypot !== '') {
      // Silent success to confuse bots
      return new Response(JSON.stringify({ ok: true }), { 
        status: 200, 
        headers: { 'content-type': 'application/json' } 
      });
    }
    
    if (loadMs < 1200) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'Too fast; please try again.' 
      }), { 
        status: 400, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    if (name.length < 2 || !company || !email || !phone || !message) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'Missing required fields' 
      }), { 
        status: 400, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'Invalid email address' 
      }), { 
        status: 400, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    // Unified email routing - all business inquiries go to leads inbox
    const leadsEmail = (import.meta.env.LEADS_EMAIL || 'leads@supakoto.org').trim();
    const adminEmail = (import.meta.env.ADMIN_EMAIL || 'admin@supakoto.org').trim();

    // Generate unique inquiry ID
    const inquiryId = `BIZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Map inquiry types to readable labels
    const inquiryTypeLabels: Record<string, string> = {
      franchise: 'Franchise Opportunity',
      partnership: 'Partnership',
      other: 'Other Business Inquiry'
    };

    const inquiryLabel = inquiryTypeLabels[inquiryType] || 'Business Inquiry';

    // Build email
    const subject = `New Business Inquiry — ${inquiryLabel} — ${company}`;
    const html = `
      <div style="font-family:Inter,Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px;">
        <div style="background: linear-gradient(135deg, #bf1e2e 0%, #6a343a 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">🚀 New Business Inquiry</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">SupaKoto Partnership Opportunity</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #bf1e2e;">
          <p><strong>Inquiry ID:</strong> ${esc(inquiryId)}</p>
          <p><strong>Inquiry Type:</strong> ${esc(inquiryLabel)}</p>
          <p><strong>Contact Person:</strong> ${esc(name)}</p>
          <p><strong>Company:</strong> ${esc(company)}</p>
          <p><strong>Email:</strong> <a href="mailto:${esc(email)}" style="color: #bf1e2e;">${esc(email)}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${esc(phone)}" style="color: #bf1e2e;">${esc(phone)}</a></p>
          <p><strong>Country:</strong> ${esc(country)}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #bf1e2e; margin-bottom: 10px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;">
            ${esc(message).replace(/\n/g,'<br>')}
          </div>
        </div>
        
        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #6c757d;">Next Steps:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #6c757d;">
            <li>Review the inquiry details above</li>
            <li>Contact the prospect within 24 hours</li>
            <li>Schedule a discovery call to understand their goals</li>
            <li>Prepare partnership/franchise materials</li>
          </ul>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
        <p style="font-size: 12px; color: #6c757d; text-align: center;">
          Submitted: ${new Date().toISOString()}<br>
          This is an automated message from the SupaKoto business inquiry system.
        </p>
      </div>
    `;

    // Send via Resend
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const from = import.meta.env.EMAIL_FROM || 'leads@supakoto.org';

    await resend.emails.send({
      from,
      to: [leadsEmail],
      cc: [adminEmail],
      subject,
      html,
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      inquiryId,
      inquiryType,
      country 
    }), {
      status: 200, 
      headers: { 'content-type': 'application/json' }
    });

  } catch (err) {
    console.error('business-contact api error', err);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: 'server_error' 
    }), {
      status: 500, 
      headers: { 'content-type': 'application/json' }
    });
  }
};
