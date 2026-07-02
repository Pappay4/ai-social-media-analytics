// ============================================================
// Ambient module declarations for Next.js 16
// These provide type information that tsc can resolve when
// Next.js types aren't directly accessible via moduleResolution.
// ============================================================

declare module 'next' {
  export type NextConfig = Record<string, unknown>;
  export type Metadata = {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
}

declare module 'next/server' {
  export type NextRequest = Request & {
    nextUrl: URL;
    cookies: {
      get(name: string): { name: string; value: string } | undefined;
      set(name: string, value: string): void;
      delete(name: string): void;
    };
    geo?: { city?: string; country?: string; region?: string };
    ip?: string;
  };

  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static rewrite(url: string | URL): NextResponse;
    static next(init?: { headers?: HeadersInit }): NextResponse;
    cookies: {
      get(name: string): { name: string; value: string } | undefined;
      set(name: string, value: string, options?: Record<string, unknown>): void;
      delete(name: string): void;
    };
  }
}

declare module 'next/server.js' {
  export { NextRequest, NextResponse } from 'next/server';
}

declare module 'next/navigation' {
  export function notFound(): never;
  export function redirect(url: string, type?: 'replace' | 'push'): never;
  export function useRouter(): {
    push(url: string): void;
    replace(url: string): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(url: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams<T extends Record<string, string | string[]> = Record<string, string>>(): T;
}

declare module 'next/font/google' {
  interface FontOptions {
    weight?: string | string[];
    style?: string | string[];
    subsets?: string[];
    variable?: string;
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
  }
  interface FontResult {
    className: string;
    variable: string;
    style: { fontFamily: string; fontWeight?: number; fontStyle?: string };
  }
  export function Geist(options: FontOptions): FontResult;
  export function Geist_Mono(options: FontOptions): FontResult;
  export function Inter(options: FontOptions): FontResult;
  export function Roboto(options: FontOptions): FontResult;
  export function Outfit(options: FontOptions): FontResult;
}

declare module 'next/types' {
  export type ResolvingMetadata = Promise<{
    title?: string | null;
    description?: string | null;
    [key: string]: unknown;
  }>;
  export type ResolvingViewport = Promise<{
    width?: string;
    initialScale?: number;
    [key: string]: unknown;
  }>;
}

declare module 'next/types.js' {
  export { ResolvingMetadata, ResolvingViewport } from 'next/types';
}
