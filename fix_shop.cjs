const fs = require('fs');
let c = fs.readFileSync('pages/Shop.tsx', 'utf8');

c = c.replace(/auth\.currentUser\?\.email/g, "(localStorage.getItem('subCustomerEmailKey') ? localStorage.getItem('subCustomerEmailKey').replace(/,/g, '.') : auth.currentUser?.email)");
c = c.replace(/auth\.currentUser\.email\.replace\(\/\\\\\\.\/g, ','\)/g, "(localStorage.getItem('subCustomerEmailKey') || auth.currentUser?.email?.replace(/\\./g, ','))");
c = c.split("auth.currentUser.email.replace(/\\./g, ',')").join("(localStorage.getItem('subCustomerEmailKey') || auth.currentUser?.email?.replace(/\\./g, ','))");

fs.writeFileSync('pages/Shop.tsx', c);
console.log('Fixed auth.currentUser references in Shop.tsx for Co-Owners');
