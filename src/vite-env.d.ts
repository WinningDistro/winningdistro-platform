/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HCAPTCHA_SITE_KEY: string
  readonly VITE_HCAPTCHA_SECRET_KEY: string
  readonly VITE_SPOTIFY_CLIENT_ID: string
  readonly VITE_SPOTIFY_CLIENT_SECRET: string
  readonly VITE_INSTAGRAM_APP_ID: string
  readonly VITE_INSTAGRAM_APP_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// hCaptcha global declaration
declare global {
  interface Window {
    hcaptcha: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      execute: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
    };
  }
}
