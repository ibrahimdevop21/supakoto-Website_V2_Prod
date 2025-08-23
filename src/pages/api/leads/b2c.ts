import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let formData: any = {};
    
    if (contentType.includes('multipart/form-data')) {
      const data = await request.formData();
      
      // Extract form fields
      for (const [key, value] of data.entries()) {
        if (key.startsWith('file_')) {
          // Handle file uploads
          if (!formData.files) formData.files = [];
          formData.files.push({
            name: (value as File).name,
            size: (value as File).size,
            type: (value as File).type
          });
        } else {
          formData[key] = value;
        }
      }
    } else {
      formData = await request.json();
    }
    
    // Basic server-side validation
    const requiredFields = ['fullName', 'phone', 'branchId', 'services', 'privacyConsent'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        ok: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check for honeypot spam
    if (formData.website) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Spam detected'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse services if it's a JSON string
    if (typeof formData.services === 'string') {
      try {
        formData.services = JSON.parse(formData.services);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
    
    // Prepare lead data for CRM/Email
    const leadData = {
      type: 'b2c',
      source: formData.source || 'contact_b2c',
      timestamp: formData.timestamp || new Date().toISOString(),
      locale: formData.locale || 'en',
      
      // Contact info
      fullName: formData.fullName,
      phone: formData.phone,
      whatsappMe: formData.whatsappMe === 'true',
      branchId: formData.branchId,
      services: Array.isArray(formData.services) ? formData.services : [formData.services],
      
      // Vehicle details (optional)
      vehicleMake: formData.vehicleMake || '',
      vehicleModel: formData.vehicleModel || '',
      vehicleYear: formData.vehicleYear || '',
      vehicleColor: formData.vehicleColor || '',
      finishPreference: formData.finishPreference || '',
      coverage: formData.coverage || '',
      specificAreas: formData.specificAreas || '',
      timeline: formData.timeline || '',
      budgetRange: formData.budgetRange || '',
      hearAbout: formData.hearAbout || '',
      notes: formData.notes || '',
      
      // Consent
      privacyConsent: formData.privacyConsent === 'true',
      whatsappConsent: formData.whatsappConsent === 'true',
      
      // Files info
      filesCount: formData.files ? formData.files.length : 0,
      
      // Metadata
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    };
    
    // TODO: Send to your CRM/Email service
    // Examples:
    // - Send email notification
    // - Save to database
    // - Send to CRM API (HubSpot, Salesforce, etc.)
    // - Send to webhook
    
    console.log('New B2C lead received:', leadData);
    
    // For now, just log and return success
    // In production, you would integrate with your actual CRM/email service
    
    return new Response(JSON.stringify({
      ok: true,
      message: 'Lead submitted successfully',
      leadId: `b2c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('B2C lead submission error:', error);
    
    return new Response(JSON.stringify({
      ok: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
