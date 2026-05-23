/// <reference types="vite/client" />

// Variables d'environnement côté client exposées via Vite
interface ImportMetaEnv {
  readonly REACT_APP_VAPID_PUBLIC_KEY?: string
}

// This is needed to properly support Vitest testing with jest-dom matchers.
// Types for jest-dom are not recognized automatically and Typescript complains
// about missing types e.g. when using `toBeInTheDocument` and other matchers.
// Reference: https://github.com/testing-library/jest-dom/issues/546#issuecomment-1889884843
import "@testing-library/jest-dom";
