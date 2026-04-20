#!/usr/bin/env node

/**
 * TherapyJoy - Production Deployment Helper
 * This script helps you prepare and deploy your app to production
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function checkFile(filePath, label) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(COLORS.green, `✅ ${label}`);
  } else {
    log(COLORS.red, `❌ ${label} - NOT FOUND`);
  }
  return exists;
}

function checkEnvFile(filePath, label) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasPlaceholder = content.includes('your-');
    if (hasPlaceholder) {
      log(COLORS.yellow, `⚠️  ${label} - EXISTS BUT INCOMPLETE (has placeholders)`);
      return false;
    }
    log(COLORS.green, `✅ ${label} - CONFIGURED`);
    return true;
  } else {
    log(COLORS.red, `❌ ${label} - NOT CONFIGURED`);
    return false;
  }
}

console.clear();
log(COLORS.blue, `
╔════════════════════════════════════════════════════╗
║  TherapyJoy - Production Deployment Checklist     ║
║  This script checks your project readiness        ║
╚════════════════════════════════════════════════════╝
`);

log(COLORS.blue, '\n📋 CHECKING PROJECT STRUCTURE...\n');

const rootDir = path.dirname(__dirname);
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'therapyjoy-frontend - Copy');

let allGood = true;

// Check Backend Files
log(COLORS.yellow, '🔧 Backend Files:');
allGood &= checkFile(path.join(backendDir, 'server.js'), 'server.js');
allGood &= checkFile(path.join(backendDir, 'firebaseAdmin.js'), 'firebaseAdmin.js');
allGood &= checkFile(path.join(backendDir, 'package.json'), 'package.json');

// Check Frontend Files
log(COLORS.yellow, '\n⚛️  Frontend Files:');
allGood &= checkFile(path.join(frontendDir, 'src', 'App.jsx'), 'App.jsx');
allGood &= checkFile(path.join(frontendDir, 'src', 'styles', 'global.css'), 'global.css');
allGood &= checkFile(path.join(frontendDir, 'tailwind.config.js'), 'tailwind.config.js');

// Check Environment Files
log(COLORS.yellow, '\n🔐 Environment Configuration:');
allGood &= checkEnvFile(path.join(backendDir, '.env.production'), 'Backend .env.production');
allGood &= checkEnvFile(path.join(frontendDir, '.env.production'), 'Frontend .env.production');

// Check Dependencies
log(COLORS.yellow, '\n📦 Dependencies:');
const backendNodeModules = fs.existsSync(path.join(backendDir, 'node_modules'));
const frontendNodeModules = fs.existsSync(path.join(frontendDir, 'node_modules'));

if (backendNodeModules) {
  log(COLORS.green, '✅ Backend dependencies installed');
} else {
  log(COLORS.yellow, '⚠️  Backend dependencies not installed (run: cd backend && npm install)');
}

if (frontendNodeModules) {
  log(COLORS.green, '✅ Frontend dependencies installed');
} else {
  log(COLORS.yellow, '⚠️  Frontend dependencies not installed (run: cd therapyjoy-frontend-Copy && npm install)');
}

// Summary
console.log('\n');
if (allGood) {
  log(COLORS.green, '╔════════════════════════════════════════════════════╗');
  log(COLORS.green, '║  ✅ Your project is READY for deployment!         ║');
  log(COLORS.green, '║                                                    ║');
  log(COLORS.green, '║  Next steps:                                       ║');
  log(COLORS.green, '║  1. npm run build  (in frontend)                  ║');
  log(COLORS.green, '║  2. git push       (push to GitHub)               ║');
  log(COLORS.green, '║  3. Deploy on Vercel & Railway                   ║');
  log(COLORS.green, '║                                                    ║');
  log(COLORS.green, '║  Good luck! 🚀                                    ║');
  log(COLORS.green, '╚════════════════════════════════════════════════════╝');
} else {
  log(COLORS.yellow, '╔════════════════════════════════════════════════════╗');
  log(COLORS.yellow, '║  ⚠️  Some items need attention                    ║');
  log(COLORS.yellow, '║                                                    ║');
  log(COLORS.yellow, '║  Complete all items marked with ❌ or ⚠️          ║');
  log(COLORS.yellow, '║  before proceeding to deployment                 ║');
  log(COLORS.yellow, '║                                                    ║');
  log(COLORS.yellow, '║  Check ACTIONABLE_CHECKLIST.md for help          ║');
  log(COLORS.yellow, '╚════════════════════════════════════════════════════╝');
}

process.exit(allGood ? 0 : 1);
