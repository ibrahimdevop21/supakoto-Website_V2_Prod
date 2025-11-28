/// <reference types="astro/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly RESEND_API_KEY?: string;
  readonly LEADS_EMAIL?: string;
  readonly ADMIN_EMAIL?: string;
  readonly EMAIL_FROM?: string;
  readonly VERCEL_URL?: string;
  readonly NODE_ENV?: string;
}
