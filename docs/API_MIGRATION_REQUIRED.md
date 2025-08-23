# API Route Migration Required

## Issue
The current project has an API route at `/src/pages/api/leads/b2c.ts` which **will not work** with `output: "static"` in Astro. This route handles B2C lead form submissions.

## Current API Route
- **Path**: `/src/pages/api/leads/b2c.ts`
- **Method**: POST
- **Purpose**: Handles B2C contact form submissions
- **Current Status**: Non-functional with static output

## Required Migration Options

### Option 1: External Webhook Service (Recommended)
Replace the API route with an external service:

**Suggested Services:**
- **Netlify Forms** (if deploying to Netlify)
- **Formspree** - `https://formspree.io/f/YOUR_FORM_ID`
- **Getform** - `https://getform.io/f/YOUR_FORM_ID`
- **Web3Forms** - `https://api.web3forms.com/submit`

**Client Code Update Required:**
```typescript
// In your contact form component, change the action URL from:
// action="/api/leads/b2c"
// to:
action="https://formspree.io/f/YOUR_FORM_ID"
// or your chosen external service
```

### Option 2: Separate Microservice
- Deploy the API route as a separate serverless function
- Update form action to point to the new endpoint
- Keep this repo purely static

## Files That Need Updates
1. **Contact Form Components** (search for form submissions):
   - `/src/components/contact/B2CForm.tsx`
   - `/src/components/contact/ContactForm.tsx`
   - Any other forms that POST to `/api/leads/b2c`

2. **Form Action URLs**: Update from `/api/leads/b2c` to external webhook URL

## Next Steps
1. Choose an external form service
2. Update form action URLs in components
3. Remove `/src/pages/api/` directory
4. Test form submissions with new service
5. Update any form validation/success handling as needed

## Example External Service Integration
```typescript
// Example with Formspree
const handleSubmit = async (formData: FormData) => {
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (response.ok) {
    // Handle success
  } else {
    // Handle error
  }
};
```

**⚠️ IMPORTANT**: The current API route will be ignored in static builds and forms will fail until this migration is completed.
