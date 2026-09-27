const fs = require('fs');
let c = fs.readFileSync('pages/Shop.tsx', 'utf8');

const target = `    try {
      const emailKey = (localStorage.getItem('subCustomerEmailKey') || auth.currentUser?.email?.replace(/\\./g, ','));
      const updatedCustomer = {
        ...customer,
        credits: customer.credits - (plan.creditPrice || 0),
        plan: name
      };
      await set(ref(db, \`customers/\${emailKey}\`), encrypt(updatedCustomer));
      alert('Plan upgraded successfully!');
    } catch (err) {
      alert('Purchase failed.');
    }`;

const replacement = `    try {
      const emailKey = (localStorage.getItem('subCustomerEmailKey') || auth.currentUser?.email?.replace(/\\./g, ','));
      
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!idToken && !localStorage.getItem('subCustomerEmailKey')) {
          alert('Error: Not authenticated.');
          setBuying(null);
          return;
      }
      
      // Co-owners bypass: For now, if it's a co-owner, we block purchases for security
      if (!auth.currentUser) {
          alert('Error: Only the main account owner can make purchases from the shop.');
          setBuying(null);
          return;
      }

      const response = await fetch('https://hamza-backend.vertex-auth.workers.dev/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              emailKey,
              planName: name,
              creditPrice: plan.creditPrice || 0,
              idToken
          })
      });

      const result = await response.json();
      
      if (result.success) {
          alert('Plan upgraded successfully! New balance: ' + result.newCredits + ' credits.');
      } else {
          alert('Purchase failed: ' + result.message);
      }
    } catch (err) {
      alert('Purchase failed: Network Error.');
    }`;

c = c.replace(target, replacement);
fs.writeFileSync('pages/Shop.tsx', c);
console.log('Fixed Shop.tsx API integration');
