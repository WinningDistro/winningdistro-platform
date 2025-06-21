/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RECAPTCHA_SECRET_KEY: string
  readonly RECAPTCHA_PROJECT_ID: string
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
