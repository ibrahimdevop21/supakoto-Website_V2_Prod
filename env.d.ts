/// <reference types="astro/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_TO_EMAIL?: string;
  readonly CONTACT_FROM_EMAIL?: string;
  readonly ADMIN_EMAIL?: string;
  readonly SALES_UAE_EMAIL?: string;
  readonly SALES_EGYPT_EMAIL?: string;
  readonly EMAIL_FROM?: string;
  readonly VERCEL_URL?: string;
  readonly NODE_ENV?: string;
}
