# SupaKoto Website - Deployment Readiness Assessment

## Decision: Static SSG ❌

**Status:** NOT READY for static deployment to cPanel  
**Reason:** Server-side API endpoint forces SSR requirement

## Architecture Analysis

### Current Configuration
- **Output:** Static (default) - ✅
- **Adapter:** None (static build) - ✅  
- **TrailingSlash:** Not specified (default: ignore) - ✅
- **Base:** Not specified (default: /) - ✅

### Integrations
- ✅ React (client-side islands)
- ✅ Tailwind CSS
- ✅ Astro Compress
- ✅ Astro Icon
- ✅ Built-in i18n (en/ar with pathname strategy)

## Critical Blockers

### 🚨 BLOCKER A: Server-side API Endpoint
**File:** `src/pages/api/leads/b2c.ts:3`  
**Issue:** POST endpoint requires server runtime  
**Fix:** Move to external serverless endpoint (e.g., `https://api.supakoto.com/leads/b2c`)

### 🚨 BLOCKER B: Form Posts to Internal API
**File:** `src/components/contact/B2CForm.tsx:117`  
**Issue:** `fetch('/api/leads/b2c')` points to internal API  
**Fix:** Change to external endpoint: `fetch('https://api.supakoto.com/leads/b2c')`

### ⚠️ BLOCKER C: Missing Font Files
**Issue:** RH-Zak fonts referenced but files don't exist in `public/fonts/`  
**Status:** ALREADY FIXED - Switched to Inter font, removed missing font references

## Client-side Features (Safe for SSG)

### ✅ Webchat Integration
- **File:** `src/components/integrations/RespondIO.tsx`
- **Status:** Client-side only, loads via external CDN
- **Note:** Currently has fallback chat button for testing

### ✅ Analytics Ready
- No GTM/GA4 found in current codebase
- Ready for external analytics integration

### ✅ Static Assets
- All assets use absolute paths (`/images/`, `/partners/`, `/videos/`)
- i18n correctly configured to not prefix static assets
- No `/ar/images/` issues detected

## Required Actions Before Static Deployment

### 1. Move API to External Service
```bash
# Create external API endpoint
# Update B2CForm.tsx line 117:
- fetch('/api/leads/b2c', {
+ fetch('https://api.supakoto.com/leads/b2c', {
```

### 2. Remove Internal API Directory
```bash
rm -rf src/pages/api/
```

### 3. Update Webchat (Optional)
- Replace fallback chat button with real Respond.io widget
- Or keep fallback and integrate with external chat service

## Static SSG Deployment Checklist (After Fixes)

1. **Build Process:**
   ```bash
   npm ci
   npm run build
   ```

2. **Upload to cPanel:**
   - Upload `dist/` contents to `public_html/`
   - Place `.htaccess` at site root

3. **Verify Routes:**
   - ✅ EN routes: `/`, `/about`, `/services`, `/gallery`, `/contact`
   - ✅ AR routes: `/ar/`, `/ar/about`, `/ar/services`, `/ar/gallery`, `/ar/contact`

4. **Test Assets:**
   - ✅ Images: `/images/hero-bg.webp`
   - ✅ Partners: `/partners/logo-*.svg`
   - ✅ Videos: `/videos/hero-video.mp4`

5. **Enable Production Analytics:**
   - Configure GTM/GA4 environment variables
   - Test tracking on live site

## Future SSR/Hybrid Considerations

Consider adding SSR/hybrid when you need:
- User authentication/sessions
- Heavy personalization
- Rapidly changing CMS content
- Real-time data fetching
- Server-side form validation

## Sidecar Architecture Recommendation

**Recommended Setup:**
- **Main Site:** Static SSG on cPanel (`supakoto.com`)
- **API Service:** Serverless functions (`api.supakoto.com`)
- **Benefits:** Fast static delivery + dynamic functionality where needed

## Next Steps

1. **Fix Blockers A & B** (move API to external service)
2. **Re-run this audit** to confirm static readiness
3. **Test build locally** with `npm run build`
4. **Deploy to staging** for final verification
5. **Go live** with static deployment

---

**Last Updated:** 2025-01-18  
**Audit Version:** 1.0  
**Next Review:** After API migration
