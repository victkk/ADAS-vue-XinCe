// src/types/router.d.ts
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requireAuth?: boolean;
    roles?: string[];
  }
}
