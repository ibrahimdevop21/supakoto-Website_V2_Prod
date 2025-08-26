# Formspree Integration Setup Guide

## Overview
The SupaKoto website contact forms are now configured to work with Formspree, a form handling service that processes form submissions without requiring server-side code.

## Current Status ✅

### Forms Ready for Production:
- **English Contact Form**: `/contact` → `/thank-you`
- **Arabic Contact Form**: `/ar/contact` → `/ar/thank-you`

### Features Implemented:
- ✅ Proper form validation (service selection required)
- ✅ Formspree configuration with hidden fields
- ✅ Spam protection with honeypot field
- ✅ Custom thank you pages in both languages
- ✅ Professional success messages with next steps
- ✅ Emergency contact information
- ✅ Consistent field naming across both forms

## Required Setup Steps

### 1. Create Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Sign up for an account
3. Create a new form project

### 2. Get Your Form Endpoint
1. In your Formspree dashboard, create a new form
2. Copy the form endpoint URL (format: `https://formspree.io/f/YOUR_FORM_ID`)
3. Replace `YOUR_FORM_ID` in both contact forms with your actual form ID

### 3. Update Form Actions
Replace the placeholder in these files:

**File: `/src/pages/contact.astro` (Line 61)**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="space-y-6" onsubmit="return validateServices(this)">
```

**File: `/src/pages/ar/contact.astro` (Line 46)**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="space-y-6" onsubmit="return validateServices(this)">
```

### 4. Configure Formspree Settings
In your Formspree dashboard:

1. **Email Notifications**: Set up email addresses to receive form submissions
2. **Spam Protection**: Enable reCAPTCHA if desired (already has honeypot protection)
3. **Custom Redirects**: Verify redirect URLs work:
   - English: `https://supakoto.com/thank-you`
   - Arabic: `https://supakoto.com/ar/thank-you`

## Form Fields Mapping

### Submitted Data Structure:
```json
{
  "_subject": "New Quote Request from SupaKoto Website" | "طلب عرض أسعار جديد من موقع سوباكوتو",
  "_language": "en" | "ar",
  "name": "Customer full name",
  "phone": "Customer phone number",
  "message": "Customer message/requirements",
  "branch_id": "cairo_5th|maadi|sheikh_zayed|damietta|dubai",
  "services": ["ppf", "heat_isolation", "nano_ceramic", "heat_nano_combo"],
  "whatsapp_only": "1" | null
}
```

### Service Values:
- `ppf`: PPF (Paint Protection Film) | فيلم حماية الطلاء
- `heat_isolation`: Heat Isolation | عزل حراري  
- `nano_ceramic`: Nano Ceramic | نانو سيراميك
- `heat_nano_combo`: Heat Isolation + Nano Ceramic | عزل حراري + نانو سيراميك

### Branch IDs:
- `cairo_5th`: New Cairo, Fifth Settlement
- `maadi`: Maadi, Inside Skoda Center
- `sheikh_zayed`: Al Sheikh Zayed
- `damietta`: Damietta
- `dubai`: Dubai Al Quoz (Headquarters)

## Security Features

### Spam Protection:
1. **Honeypot Field**: Hidden `_gotcha` field catches bots
2. **Form Validation**: Client-side validation ensures service selection
3. **Formspree Built-in**: Server-side spam filtering by Formspree

### Data Privacy:
- Forms only collect necessary business information
- No sensitive data stored client-side
- Formspree handles data according to their privacy policy

## Testing Checklist

### Before Going Live:
- [ ] Replace `YOUR_FORM_ID` with actual Formspree form ID
- [ ] Test form submission on both English and Arabic pages
- [ ] Verify thank you page redirects work correctly
- [ ] Confirm email notifications are received
- [ ] Test form validation (try submitting without selecting services)
- [ ] Verify branch selection updates correctly
- [ ] Test WhatsApp/phone links in thank you pages

### Post-Launch Monitoring:
- [ ] Monitor Formspree dashboard for submissions
- [ ] Check email delivery rates
- [ ] Verify no spam submissions getting through
- [ ] Monitor thank you page analytics

## Troubleshooting

### Common Issues:
1. **Form not submitting**: Check Formspree form ID is correct
2. **Not receiving emails**: Verify email settings in Formspree dashboard
3. **Redirect not working**: Ensure thank you page URLs are accessible
4. **Validation not working**: Check JavaScript console for errors

### Support:
- Formspree Documentation: [docs.formspree.io](https://docs.formspree.io)
- Formspree Support: Available through dashboard

## Production Deployment Notes

### Domain Configuration:
- Update redirect URLs to match your production domain
- Ensure HTTPS is enabled for security
- Test forms after domain changes

### Performance:
- Forms are lightweight and don't impact page load speed
- Thank you pages are static and load quickly
- No additional JavaScript libraries required

---

**Status**: ✅ Ready for production deployment
**Last Updated**: 2025-08-26
**Next Action**: Replace YOUR_FORM_ID with actual Formspree form endpoint
