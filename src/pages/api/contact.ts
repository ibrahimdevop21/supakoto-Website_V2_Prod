import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Environment variables for email configuration
const MAIL_HOST = import.meta.env.MAIL_HOST || 'mail.privateemail.com';
const MAIL_PORT = parseInt(import.meta.env.MAIL_PORT || '587');
const MAIL_USER = import.meta.env.MAIL_USER;
const MAIL_PASS = import.meta.env.MAIL_PASS;

// Sales email routing
const SALES_EGYPT_EMAIL = import.meta.env.SALES_EGYPT_EMAIL || 'egypt@supakoto.org';
const SALES_DUBAI_EMAIL = import.meta.env.SALES_DUBAI_EMAIL || 'uae@supakoto.org';
const SALES_FALLBACK_EMAIL = import.meta.env.SALES_FALLBACK_EMAIL || 'sales@supakoto.org';

// Spam protection
const FORM_HONEYPOT_SECRET = import.meta.env.FORM_HONEYPOT_SECRET || 'supakoto_2025';
const MIN_LOAD_TIME = 2000; // 2 seconds minimum

// Optional Respond.io webhook
const RESPOND_IO_WEBHOOK_URL = import.meta.env.RESPOND_IO_WEBHOOK_URL;

// Create nodemailer transporter
function createTransporter() {
  if (!MAIL_USER || !MAIL_PASS) {
    throw new Error('Email credentials not configured. Please set MAIL_USER and MAIL_PASS environment variables.');
  }

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs for development
      rejectUnauthorized: false,
    },
  });
}

// Determine sales email based on phone country code
function getSalesEmail(phone: string): string {
  if (phone.startsWith('+20')) {
    return SALES_EGYPT_EMAIL;
  } else if (phone.startsWith('+971')) {
    return SALES_DUBAI_EMAIL;
  }
  return SALES_FALLBACK_EMAIL;
}

// Format services array for email
function formatServices(services: FormDataEntryValue[]): string {
  const serviceMap: Record<string, { en: string; ar: string }> = {
    ppf: { en: 'Paint Protection Film (PPF)', ar: 'فيلم حماية الطلاء' },
    ceramic: { en: 'Ceramic Coating', ar: 'طلاء السيراميك' },
    heat_uv_isolation: { en: 'Heat/UV Isolation', ar: 'عزل الحرارة والأشعة فوق البنفسجية' },
    window_tinting: { en: 'Window Tinting', ar: 'تظليل النوافذ' },
    building_heat_uv_isolation: { en: 'Building Heat/UV Isolation', ar: 'عزل الحرارة والأشعة فوق البنفسجية للمباني' },
  };

  const servicesList = services.filter((service): service is string => typeof service === 'string');
  return servicesList
    .map(service => {
      const mapped = serviceMap[service];
      return mapped ? `${mapped.en} (${mapped.ar})` : service;
    })
    .join(', ');
}

// Generate email HTML template
function generateEmailHTML(data: any): string {
  const country = data.phone.startsWith('+20') ? 'Egypt 🇪🇬' : 'UAE 🇦🇪';
  
  return `
    <!DOCTYPE html>
    <html dir="ltr" lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead - SupaKoto</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #bf1e2e, #6a343a); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #bf1e2e; border-radius: 0 5px 5px 0; }
        .field-label { font-weight: bold; color: #bf1e2e; margin-bottom: 5px; }
        .field-value { color: #333; }
        .services { background: #e8f5e8; border-left-color: #28a745; }
        .message { background: #fff3cd; border-left-color: #ffc107; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #dee2e6; }
        .priority { background: #d4edda; border-left-color: #28a745; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚗 New Lead from SupaKoto Website</h1>
          <p>Premium Automotive Services Lead</p>
        </div>
        
        <div class="content">
          <div class="field priority">
            <div class="field-label">📍 Lead Region</div>
            <div class="field-value">${country}</div>
          </div>
          
          <div class="field">
            <div class="field-label">👤 Full Name</div>
            <div class="field-value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">📧 Email Address</div>
            <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          
          <div class="field">
            <div class="field-label">📱 Phone Number</div>
            <div class="field-value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          
          <div class="field services">
            <div class="field-label">🔧 Services Requested</div>
            <div class="field-value">${formatServices(data.services)}</div>
          </div>
          
          ${data.message ? `
          <div class="field message">
            <div class="field-label">💬 Customer Message</div>
            <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="field-label">⏰ Submitted At</div>
            <div class="field-value">${new Date().toLocaleString('en-US', { 
              timeZone: country === 'Egypt 🇪🇬' ? 'Africa/Cairo' : 'Asia/Dubai',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Next Steps:</strong></p>
          <p>1. Contact the customer within 2 hours for hot leads</p>
          <p>2. Update CRM with lead information</p>
          <p>3. Schedule consultation if services match our offerings</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #dee2e6;">
          <p style="font-size: 12px; color: #999;">
            This lead was generated from the SupaKoto website contact form.<br>
            Lead routing: ${country} → ${getSalesEmail(data.phone)}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send to Respond.io webhook (optional)
async function sendToRespondIO(data: any) {
  if (!RESPOND_IO_WEBHOOK_URL) return;

  try {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      services: Array.isArray(data.services) ? data.services : [data.services],
      message: data.message || '',
      country: data.phone.startsWith('+20') ? 'EG' : 'AE',
      source: 'website_contact_form',
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(RESPOND_IO_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('Respond.io webhook failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.warn('Respond.io webhook error:', error);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const data = {
      name: formData.get('name')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      services: formData.getAll('services'),
      message: formData.get('message')?.toString().trim(),
      country: formData.get('country')?.toString(),
      branch_id: formData.get('branch_id')?.toString(), // Branch context
      _hp: formData.get('_hp')?.toString(), // Honeypot
      _lt: formData.get('_lt')?.toString(), // Load time
    };

    // Validation
    if (!data.name || !data.email || !data.phone) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and phone are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Phone validation (E.164 format)
    if (!data.phone.match(/^\+(?:20|971)[0-9]{8,10}$/)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Spam protection checks
    
    // 1. Honeypot check
    if (data._hp !== FORM_HONEYPOT_SECRET) {
      console.warn('Spam attempt detected: Invalid honeypot');
      return new Response(
        JSON.stringify({ error: 'Security validation failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Load time check
    const loadTime = parseInt(data._lt || '0');
    if (loadTime < MIN_LOAD_TIME) {
      console.warn('Spam attempt detected: Form submitted too quickly', loadTime);
      return new Response(
        JSON.stringify({ error: 'Please wait a moment before submitting' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Basic content validation
    if (data.name.length < 2 || data.name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Name must be between 2 and 100 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine sales email based on phone country
    const salesEmail = getSalesEmail(data.phone);
    
    // Create email transporter
    const transporter = createTransporter();

    // Email configuration
    const mailOptions = {
      from: `"SupaKoto Website" <${MAIL_USER}>`,
      to: salesEmail,
      cc: SALES_FALLBACK_EMAIL !== salesEmail ? SALES_FALLBACK_EMAIL : undefined,
      subject: `🚗 New Lead: ${data.name} - ${data.phone.startsWith('+20') ? 'Egypt' : 'UAE'}`,
      html: generateEmailHTML(data),
      // Plain text fallback
      text: `
New Lead from SupaKoto Website

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Services: ${formatServices(data.services)}
Message: ${data.message || 'No message provided'}

Region: ${data.phone.startsWith('+20') ? 'Egypt' : 'UAE'}
Submitted: ${new Date().toISOString()}
      `.trim(),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send to Respond.io webhook (optional, non-blocking)
    sendToRespondIO(data).catch(console.warn);

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully',
        routed_to: salesEmail 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Return user-friendly error
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send message. Please try again or contact us directly.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

/*
ENVIRONMENT VARIABLES REQUIRED IN VERCEL:

1. Email Configuration (Required):
   MAIL_HOST=mail.privateemail.com
   MAIL_PORT=587
   MAIL_USER=your-email@supakoto.org
   MAIL_PASS=your-email-password

2. Sales Email Routing (Optional - defaults provided):
   SALES_EGYPT_EMAIL=egypt@supakoto.org
   SALES_DUBAI_EMAIL=uae@supakoto.org
   SALES_FALLBACK_EMAIL=sales@supakoto.org

3. Spam Protection (Optional - defaults provided):
   FORM_HONEYPOT_SECRET=supakoto_2025

4. Respond.io Integration (Optional):
   RESPOND_IO_WEBHOOK_URL=https://your-respond-io-webhook-url

To set these in Vercel:
1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its value
4. Redeploy your application

Example Namecheap Private Email settings:
- SMTP Server: mail.privateemail.com
- Port: 587 (TLS) or 465 (SSL)
- Authentication: Required
- Username: your full email address
- Password: your email password
*/
