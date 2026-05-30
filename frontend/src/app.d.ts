declare global {
  namespace App {
    interface Locals {
      lang: 'pt' | 'en';
      adminUser?: {
        id: string;
        name?: string | null;
        role?: string | null;
      } | null;
    }
  }
}

export {};
