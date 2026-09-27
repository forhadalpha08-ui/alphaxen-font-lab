const fs = require('fs');

// Patch Login.tsx
let login = fs.readFileSync('pages/Login.tsx', 'utf8');
const loginTarget = `localStorage.setItem('subCustomerEmailKey', emailKey);
              navigate('/dashboard');`;
const loginReplace = `localStorage.setItem('subCustomerEmailKey', emailKey);
              try {
                const { signInAnonymously, updateProfile } = await import('firebase/auth');
                await signInAnonymously(auth);
                await updateProfile(auth.currentUser, { displayName: 'sub_' + emailKey });
              } catch(e) { console.error(e); }
              navigate('/dashboard');`;
if (login.includes(loginTarget)) {
    login = login.replace(loginTarget, loginReplace);
    fs.writeFileSync('pages/Login.tsx', login);
    console.log('Login.tsx patched.');
} else {
    console.log('Login.tsx target not found.');
}

// Patch ResellerPortal.tsx
let reseller = fs.readFileSync('pages/ResellerPortal.tsx', 'utf8');
const resellerTarget = `await signInAnonymously(auth);`;
const resellerReplace = `await signInAnonymously(auth);
                            try {
                              const { updateProfile } = await import('firebase/auth');
                              await updateProfile(auth.currentUser, { displayName: 'res_' + hash });
                            } catch(e) { console.error(e); }`;
if (reseller.includes(resellerTarget)) {
    reseller = reseller.replace(resellerTarget, resellerReplace);
    fs.writeFileSync('pages/ResellerPortal.tsx', reseller);
    console.log('ResellerPortal.tsx patched.');
} else {
    console.log('ResellerPortal.tsx target not found.');
}
