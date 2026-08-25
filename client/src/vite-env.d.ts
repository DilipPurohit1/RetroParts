/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SOCKET_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        renderButton: (parent: HTMLElement, options: any) => void;
        prompt: (notification?: (notification: any) => void) => void;
        cancel: () => void;
      };
      oauth2: {
        initTokenClient: (config: any) => any;
      };
    };
  };
}
