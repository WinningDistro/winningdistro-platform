import React, { useEffect, useRef, useState } from 'react';

// hCaptcha configuration
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001";
const HCAPTCHA_SCRIPT_URL = "https://js.hcaptcha.com/1/api.js";

export interface HCaptchaComponentProps {
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  onVerify?: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  className?: string;
}

// Global flag to track if script is being loaded
let scriptLoading = false;
let scriptLoaded = false;

const loadHCaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (typeof window !== 'undefined' && window.hcaptcha) {
      scriptLoaded = true;
      resolve();
      return;
    }

    // If script is already loading, wait for it
    if (scriptLoading) {
      const checkInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.hcaptcha) {
          scriptLoaded = true;
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!scriptLoaded) {
          reject(new Error('hCaptcha script load timeout'));
        }
      }, 10000);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${HCAPTCHA_SCRIPT_URL}"]`);
    if (existingScript) {
      // Script exists but may not be loaded yet
      existingScript.addEventListener('load', () => {
        scriptLoaded = true;
        resolve();
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('hCaptcha script failed to load'));
      });
      return;
    }

    // Load the script
    scriptLoading = true;
    const script = document.createElement('script');
    script.src = HCAPTCHA_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      scriptLoading = false;
      scriptLoaded = true;
      console.log('hCaptcha script loaded successfully');
      resolve();
    };

    script.onerror = () => {
      scriptLoading = false;
      console.error('Failed to load hCaptcha script');
      reject(new Error('hCaptcha script failed to load'));
    };

    document.head.appendChild(script);
  });
};

export function HCaptchaComponent({
  theme = 'dark',
  size = 'normal',
  onVerify,
  onError,
  onExpire,
  className = ''
}: HCaptchaComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptError, setScriptError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading captcha...');

  useEffect(() => {
    let isMounted = true;

    const initializeCaptcha = async () => {
      if (!isMounted) return;

      try {
        setIsLoading(true);
        setScriptError(false);
        setLoadingMessage('Loading captcha script...');

        // Load the hCaptcha script
        await loadHCaptchaScript();

        if (!isMounted) return;

        setLoadingMessage('Initializing captcha...');

        // Wait a bit for the script to fully initialize
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!isMounted || !containerRef.current) return;

        // Clear any existing widget
        if (widgetIdRef.current && window.hcaptcha) {
          try {
            window.hcaptcha.reset(widgetIdRef.current);
          } catch (e) {
            console.warn('Error resetting hCaptcha:', e);
          }
        }

        // Render the captcha
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: HCAPTCHA_SITE_KEY,
          theme: theme,
          size: size,
          callback: (token: string) => {
            console.log('hCaptcha verified successfully');
            if (isMounted) {
              setIsLoading(false);
              onVerify?.(token);
            }
          },
          'error-callback': (error: string) => {
            console.error('hCaptcha error:', error);
            if (isMounted) {
              setIsLoading(false);
              setScriptError(true);
              onError?.(error);
            }
          },
          'expired-callback': () => {
            console.log('hCaptcha expired');
            if (isMounted) {
              onExpire?.();
            }
          }
        });

        if (isMounted) {
          setIsLoading(false);
          setScriptError(false);
          console.log('hCaptcha rendered successfully');
        }

      } catch (error) {
        console.error('Error initializing hCaptcha:', error);
        if (isMounted) {
          setIsLoading(false);
          setScriptError(true);
          onError?.('Failed to load captcha');
        }
      }
    };

    initializeCaptcha();

    // Cleanup function
    return () => {
      isMounted = false;
      if (widgetIdRef.current && typeof window !== 'undefined' && window.hcaptcha) {
        try {
          window.hcaptcha.reset(widgetIdRef.current);
        } catch (error) {
          console.warn('Error cleaning up hCaptcha:', error);
        }
      }
      widgetIdRef.current = null;
    };
  }, [theme, size, onVerify, onError, onExpire]);

  return (
    <div className={`hcaptcha-wrapper ${className}`}>
      <div
        ref={containerRef}
        className="hcaptcha-container"
        style={{
          minHeight: '78px',
          minWidth: '304px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />

      {isLoading && (
        <div
          className="hcaptcha-loading"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#D4AF37',
            fontSize: '14px'
          }}
        >
          {loadingMessage}
        </div>
      )}

      {scriptError && (
        <div
          className="hcaptcha-error"
          style={{
            padding: '10px',
            background: '#2a1810',
            border: '1px solid #d97706',
            borderRadius: '4px',
            color: '#fbbf24',
            fontSize: '12px',
            textAlign: 'center'
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            ⚠️ Captcha service unavailable
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#d97706',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
