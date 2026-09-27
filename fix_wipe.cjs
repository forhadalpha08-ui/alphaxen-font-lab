const fs = require('fs');
let c = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

const target = `const secret = 'VTX-' + Math.random().toString(36).substring(2, 15).toUpperCase();
        const customer = {
          email: (localStorage.getItem('subCustomerEmailKey') ? localStorage.getItem('subCustomerEmailKey').replace(/,/g, '.') : auth.currentUser?.email),
          secret,
          plan: 'Free Plan',
          credits: 0,
          createdAt: new Date().toISOString()
        };`;

const replacement = `const secret = 'VTX-' + Math.random().toString(36).substring(2, 15).toUpperCase();
        // PREVENT DATA WIPE: Preserve existing data if it exists, only add the missing secret/fields
        const customer = {
          ...(typeof data === 'object' && data !== null ? data : {}),
          email: (localStorage.getItem('subCustomerEmailKey') ? localStorage.getItem('subCustomerEmailKey').replace(/,/g, '.') : auth.currentUser?.email),
          secret,
          plan: (data && typeof data === 'object' && data.plan) ? data.plan : 'Free Plan',
          credits: (data && typeof data === 'object' && data.credits) ? data.credits : 0,
          createdAt: (data && typeof data === 'object' && data.createdAt) ? data.createdAt : new Date().toISOString()
        };`;

c = c.replace(target, replacement);
fs.writeFileSync('pages/Dashboard.tsx', c);
console.log("Fixed Dashboard data wipe bug.");
