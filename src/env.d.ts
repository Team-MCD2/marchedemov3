/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    /** Set by src/middleware.js for authenticated inventaire sessions. */
    authExpiresAt?: number;
    authIssuedAt?: number;
    userRole?: string;
  }
}
