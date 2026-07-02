declare module 'next' {
  export interface NextConfig {
    [key: string]: any;
  }
  export interface Metadata {
    [key: string]: any;
  }
}

declare module 'next/server' {
  export interface NextRequest {
    [key: string]: any;
  }
  export class NextResponse {
    static redirect(url: any): any;
    static json(body: any, init?: any): any;
  }
}

declare module 'next/navigation';
declare module 'next/font/google';
declare module 'next/types.js';
declare module 'next/server.js';
