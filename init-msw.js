#!/usr/bin/env node

/**
 * This script initializes Mock Service Worker in the project.
 * It should be run once before using MSW (during project setup).
 */
import { execSync } from 'child_process';

try {
  console.log('Initializing MSW...');
  execSync('npx msw init public/ --save');
  console.log('MSW initialized successfully! Service Worker created in the public directory.');
} catch (error) {
  console.error('Failed to initialize MSW:', error.message);
  // Use globalThis.process if available, otherwise exit without a status code
  if (typeof globalThis.process !== 'undefined') {
    globalThis.process.exit(1);
  }
}