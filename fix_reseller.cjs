const fs = require('fs');
let c = fs.readFileSync('pages/ResellerPortal.tsx', 'utf8');

const target = `                if (!auth.currentUser) {
                    try {
                        await signInWithEmailAndPassword(auth, "pchamza2027@gmail.com", "hamza1234");
                    } catch (e) {
                        try {
                            await signInAnonymously(auth);
                        } catch (e2) {
                            console.warn("Silent auth fallback:", e2);
                        }
                    }
                }`;

const replacement = `                if (!auth.currentUser) {
                    try {
                        // CRITICAL SECURITY FIX: Removed hardcoded admin credentials. 
                        // Resellers will authenticate anonymously to read their portal.
                        await signInAnonymously(auth);
                    } catch (e) {
                        console.error("Anonymous auth failed (Make sure Anonymous Sign-in is enabled in Firebase!):", e);
                        addToast("Authentication Error: Please ask Admin to enable Anonymous Auth.", "error");
                    }
                }`;

c = c.replace(target, replacement);
fs.writeFileSync('pages/ResellerPortal.tsx', c);
console.log("Fixed ResellerPortal hardcoded admin credentials.");
