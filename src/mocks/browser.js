import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';
import { handlers as authHandlers } from './authHandlers.js';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers, ...authHandlers);
