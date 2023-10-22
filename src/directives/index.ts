/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupPermissionDirective } from './permission';
import { setupLoadingDirective } from './loading';

import { setUpMyColorDirective } from './sachinCustomV';
import { setupShPermissionDirective } from '@/directives/ShPermission';
export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
  setupLoadingDirective(app);
  setUpMyColorDirective(app);
  setupShPermissionDirective(app);
}
