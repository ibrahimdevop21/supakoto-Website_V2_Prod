# Tactful AI Webchat Integration

## Overview
This document describes the Tactful AI webchat integration for the SupaKoto website.

## What is Tactful AI?
Tactful AI is a conversational AI platform that provides a webchat widget for customer support and engagement. The widget appears as a chat bubble on your website, allowing visitors to interact with your support team or AI assistant.

## Integration Details

### Files Added
- `src/components/shared/TactfulChat.astro` - Main webchat component

### Files Modified
- `src/layouts/Layout.astro` - Added TactfulChat component
- `.env.example` - Added Tactful credentials
- `env.d.ts` - Added TypeScript definitions

### Environment Variables

The following environment variables are required:

```bash
PUBLIC_TACTFUL_PROFILE_ID=954
PUBLIC_TACTFUL_TOKEN=8f279b5c09a52f10e273f130e7e8856f363dccd4dfaa89c1058892214ddb7bcb
```

**Note:** These variables are prefixed with `PUBLIC_` because they need to be accessible in the browser.

### How It Works

1. The `TactfulChat.astro` component loads on every page via the main `Layout.astro`
2. The component loads the Tactful embed script asynchronously
3. Once loaded, it initializes the chat widget with your profile ID and token
4. The chat widget appears as a floating button (usually bottom-right corner)
5. Visitors can click to open the chat interface

### Features

- ✅ **Automatic Loading**: Loads on all pages
- ✅ **RTL Support**: Positions correctly in Arabic (RTL) mode
- ✅ **Async Loading**: Doesn't block page rendering
- ✅ **Error Handling**: Logs errors if script fails to load
- ✅ **Environment-Based**: Uses env variables for easy configuration

### Customization

#### Changing Position (RTL Mode)
The widget automatically adjusts for RTL languages. If you need to customize:

```css
[dir="rtl"] #embedded_messenger {
  left: 20px !important;
  right: auto !important;
}
```

#### Z-Index
The widget is set to `z-index: 9999` to appear above most content but below modals. Adjust if needed:

```css
#embedded_messenger {
  z-index: 9999 !important;
}
```

## Deployment

### Vercel Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following variables:
   ```
   PUBLIC_TACTFUL_PROFILE_ID = 954
   PUBLIC_TACTFUL_TOKEN = 8f279b5c09a52f10e273f130e7e8856f363dccd4dfaa89c1058892214ddb7bcb
   ```
4. Redeploy your application

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. The Tactful credentials are already in `.env.example`
3. Start your dev server:
   ```bash
   npm run dev
   ```

## Testing

### Verify Integration

1. Open your website in a browser
2. Look for the chat widget (usually bottom-right corner)
3. Click the widget to open the chat interface
4. Check browser console for initialization message:
   ```
   ✅ Tactful webchat initialized
   ```

### Troubleshooting

**Widget not appearing:**
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Tactful script is loading (check Network tab)

**Widget in wrong position:**
- Check CSS overrides
- Verify RTL/LTR direction is correct

**Script loading errors:**
- Check internet connection
- Verify Tactful service is operational
- Check for browser extensions blocking scripts

## Security Notes

- The token is a public token meant for client-side use
- It's safe to expose in the browser
- For sensitive operations, Tactful uses server-side authentication
- Never commit your `.env` file to version control

## Support

For Tactful-specific issues:
- Visit: https://tactful.ai
- Contact Tactful support team

For integration issues:
- Check this documentation
- Review browser console logs
- Contact your development team

## Future Enhancements

Potential improvements:
- [ ] Add custom branding/colors
- [ ] Implement user identification (pass customer data)
- [ ] Add custom triggers (show chat after X seconds)
- [ ] Integrate with CRM systems
- [ ] Add analytics tracking for chat interactions
