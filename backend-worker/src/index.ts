import CryptoJS from 'crypto-js';

export interface Env {
  FIREBASE_DB_URL: string;
  VITE_DB_SECRET: string;
  FIREBASE_DB_SECRET: string;
}

function encrypt(data: any, secret: string) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
}

function decrypt(data: string, secret: string) {
  if (!data) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(data, secret);
    const str = bytes.toString(CryptoJS.enc.Utf8);
    if (!str) return null;
    try { return JSON.parse(str); } catch { return str; }
  } catch (e) {
    return null;
  }
}

// Generate random ID for token
function generateUUID() {
  return crypto.randomUUID();
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // ==========================================
    // 1. LOGIN API (GENERATES TOKEN & ONLINE)
    // ==========================================
    if (url.pathname === "/api/auth/login") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      try {
        const { appSecret, appName, username, password, hwid } = await request.json() as any;
        if (!appSecret || !appName || !username || !password) {
          return new Response(JSON.stringify({ success: false, message: "Missing credentials" }), { status: 400 });
        }

        const dbUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users/${encodeURIComponent(username)}.json?auth=${env.FIREBASE_DB_SECRET}`;
        const res = await fetch(dbUrl);
        const encryptedUser = await res.json();

        if (!encryptedUser) return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });

        const userData = decrypt(encryptedUser, env.VITE_DB_SECRET);
        if (!userData || userData.password !== password) return new Response(JSON.stringify({ success: false, message: "Debug: raw=" + (typeof encryptedUser === "string" ? encryptedUser.substring(0, 10) : JSON.stringify(encryptedUser).substring(0, 15)) + " type=" + typeof encryptedUser }), { status: 401 });
        if (userData.isBanned) return new Response(JSON.stringify({ success: false, message: "User is Banned" }), { status: 403 });
        if (userData.expiry !== 'lifetime' && new Date(userData.expiry).getTime() < Date.now()) return new Response(JSON.stringify({ success: false, message: "Account Expired" }), { status: 403 });

        // HWID Check
        if (userData.hwidLock) {
          if (!userData.hwid) {
            userData.hwid = hwid;
          } else if (userData.hwid !== hwid) {
            return new Response(JSON.stringify({ success: false, message: "Invalid HWID" }), { status: 403 });
          }
        }

        // GENERATE ACTIVE SESSION (Heartbeat System)
        const tokenId = generateUUID();
        userData.activeSession = {
          tokenId: tokenId,
          lastSeen: Date.now()
        };

        // Save updated user to DB
        await fetch(dbUrl, { method: 'PUT', body: JSON.stringify(encrypt(userData, env.VITE_DB_SECRET)) });

        // Create Encrypted JWT-like Token for Client
        const sessionToken = encrypt({ u: username, s: appSecret, a: appName, tid: tokenId, exp: Date.now() + 86400000 }, env.VITE_DB_SECRET); // 24h hard expiry

        return new Response(JSON.stringify({ 
          success: true, 
          message: "Login Successful", 
          token: sessionToken,
          data: { expiry: userData.expiry, hwid: userData.hwid, created: userData.created } 
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
      }
    }

    // ==========================================
    // 2. HEARTBEAT API (EVERY 30 SECONDS)
    // ==========================================
    if (url.pathname === "/api/auth/heartbeat") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      try {
        const body: any = await request.json(); const token = body.token || body.sessionToken;
        if (!token) return new Response(JSON.stringify({ success: false, message: "Token required" }), { status: 400 });

        const session = decrypt(token, env.VITE_DB_SECRET);
        if (!session || session.exp < Date.now()) return new Response(JSON.stringify({ success: false, message: "Token expired or invalid" }), { status: 401 });

        const { u: username, s: appSecret, a: appName, tid: tokenId } = session;
        const userUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users/${encodeURIComponent(username)}.json?auth=${env.FIREBASE_DB_SECRET}`;
        
        // Fetch current user from DB
        const res = await fetch(userUrl);
        const encryptedUser = await res.json();
        if (!encryptedUser) return new Response(JSON.stringify({ success: false, message: "User deleted" }), { status: 404 });
        
        const userData = decrypt(encryptedUser, env.VITE_DB_SECRET);
        
        // If tokenId doesn't match, someone else logged in!
        if (!userData || !userData.activeSession || userData.activeSession.tokenId !== tokenId) {
          return new Response(JSON.stringify({ success: false, message: "Logged in from another location" }), { status: 401 });
        }

        // Update lastSeen (Ping successful)
        userData.activeSession.lastSeen = Date.now();
        await fetch(userUrl, { method: 'PUT', body: JSON.stringify(encrypt(userData, env.VITE_DB_SECRET)) });

        return new Response(JSON.stringify({ success: true, message: "Heartbeat OK" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
      }
    }

    // ==========================================
    // 3. LOGOUT API (ON APP CLOSE)
    // ==========================================
    if (url.pathname === "/api/auth/logout") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      try {
        const body: any = await request.json(); const token = body.token || body.sessionToken;
        if (!token) return new Response(JSON.stringify({ success: false, message: "Token required" }), { status: 400 });

        const session = decrypt(token, env.VITE_DB_SECRET);
        if (!session) return new Response(JSON.stringify({ success: false, message: "Invalid Token" }), { status: 401 });

        const { u: username, s: appSecret, a: appName, tid: tokenId } = session;
        const userUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users/${encodeURIComponent(username)}.json?auth=${env.FIREBASE_DB_SECRET}`;
        
        const res = await fetch(userUrl);
        const encryptedUser = await res.json();
        if (encryptedUser) {
           const userData = decrypt(encryptedUser, env.VITE_DB_SECRET);
           if (userData && userData.activeSession && userData.activeSession.tokenId === tokenId) {
               delete userData.activeSession;
               await fetch(userUrl, { method: 'PUT', body: JSON.stringify(encrypt(userData, env.VITE_DB_SECRET)) });
           }
        }

        return new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
      }
    }

    // ==========================================
    // ==========================================
    // 3.5. REGISTER API
    // ==========================================
    if (url.pathname === "/api/auth/register") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      try {
        const { appSecret, appName, username, password, licenseKey, hwid } = await request.json() as any;
        if (!appSecret || !appName || !username || !password || !licenseKey) {
          return new Response(JSON.stringify({ success: false, message: "Missing credentials" }), { status: 400 });
        }

        // 1. Check license
        const licenseUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/licenses/${encodeURIComponent(licenseKey)}.json?auth=${env.FIREBASE_DB_SECRET}`;
        const licRes = await fetch(licenseUrl);
        const encryptedLicense = await licRes.json();
        if (!encryptedLicense) return new Response(JSON.stringify({ success: false, message: "INVALID_LICENSE" }), { status: 400 });
        
        const licenseData = decrypt(encryptedLicense, env.VITE_DB_SECRET);
        if (!licenseData) return new Response(JSON.stringify({ success: false, message: "INVALID_LICENSE" }), { status: 400 });
        
        if (licenseData.expiry !== 'lifetime' && new Date(licenseData.expiry).getTime() < Date.now()) {
            return new Response(JSON.stringify({ success: false, message: "LICENSE_EXPIRED" }), { status: 400 });
        }

        // 2. Check if username exists
        const userUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users/${encodeURIComponent(username)}.json?auth=${env.FIREBASE_DB_SECRET}`;
        const userRes = await fetch(userUrl);
        if (await userRes.json() !== null) {
            return new Response(JSON.stringify({ success: false, message: "USERNAME_TAKEN" }), { status: 400 });
        }

        // 3. Create User
        const newUser = {
            username,
            password,
            hwidLock: true,
            hwid: hwid || "",
            isBanned: false,
            created: new Date().toISOString(),
            expiry: licenseData.expiry,
            licenseUsed: licenseKey,
            plan: licenseData.plan || "Default"
        };

        await fetch(userUrl, { method: 'PUT', body: JSON.stringify(encrypt(newUser, env.VITE_DB_SECRET)) });
        
        // 4. Delete used license
        await fetch(licenseUrl, { method: 'DELETE' });

        return new Response(JSON.stringify({ success: true, message: "Registered successfully" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
      }
    }

    // ==========================================
    // 4. SECURE VARIABLE API (ZERO DELAY + SESSION CHECK)
    // ==========================================
    if (url.pathname === "/api/var") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      try {
        const { token, varName } = await request.json() as any;
        if (!token || !varName) return new Response(JSON.stringify({ success: false, message: "Token and varName required" }), { status: 400 });

        const sessionData = decrypt(token, env.VITE_DB_SECRET);
        if (!sessionData || sessionData.exp < Date.now()) return new Response(JSON.stringify({ success: false, message: "Invalid or Expired Token" }), { status: 401 });

        const { u: username, s: appSecret, a: appName, tid: tokenId } = sessionData;

        // PARALLEL FETCH: Check Session and Fetch Variable at the SAME TIME for ZERO DELAY
        const userUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users/${encodeURIComponent(username)}.json?auth=${env.FIREBASE_DB_SECRET}`;
        const varUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/variables/${encodeURIComponent(varName)}.json?auth=${env.FIREBASE_DB_SECRET}`;

        const [userRes, varRes] = await Promise.all([
          fetch(userUrl),
          fetch(varUrl)
        ]);

        const encryptedUser = await userRes.json();
        const encryptedVar = await varRes.json();

        if (!encryptedUser) return new Response(JSON.stringify({ success: false, message: "Offline or Session Closed" }), { status: 401 });
        const userData = decrypt(encryptedUser, env.VITE_DB_SECRET);

        // Security check: Match token ID and check if heartbeat occurred within last 60 seconds (60000 ms)
        if (!userData || !userData.activeSession || userData.activeSession.tokenId !== tokenId) {
          return new Response(JSON.stringify({ success: false, message: "Token destroyed / Logged in elsewhere" }), { status: 401 });
        }
        if (Date.now() - userData.activeSession.lastSeen > 60000) {
          return new Response(JSON.stringify({ success: false, message: "Connection lost. Session Timeout." }), { status: 401 });
        }

        // Session is fully valid, return variable
        if (!encryptedVar) return new Response(JSON.stringify({ success: false, message: "Variable not found" }), { status: 404 });
        const varValue = decrypt(encryptedVar, env.VITE_DB_SECRET);
        
        return new Response(JSON.stringify({ success: true, data: varValue }), { status: 200, headers: { 'Content-Type': 'application/json' } });

      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
      }
    }

    // ==========================================
    // 5. C# APP LICENSE CHECK API (FAST)
    // ==========================================
    if (url.pathname === "/api/auth/license") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      try {
        const { appSecret, appName, licenseKey, hwid } = await request.json() as any;
        if (!appSecret || !appName || !licenseKey) return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), { status: 400 });

        const dbUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/licenses/${encodeURIComponent(licenseKey)}.json?auth=${env.FIREBASE_DB_SECRET}`;
        const res = await fetch(dbUrl);
        const encryptedLicense = await res.json();
        if (!encryptedLicense) return new Response(JSON.stringify({ success: false, message: "Invalid License Key" }), { status: 404 });

        const licenseData = decrypt(encryptedLicense, env.VITE_DB_SECRET);
        if (!licenseData) return new Response(JSON.stringify({ success: false, message: "License Decryption Failed" }), { status: 500 });

        if (licenseData.expiry !== 'lifetime' && new Date(licenseData.expiry).getTime() < Date.now()) {
          return new Response(JSON.stringify({ success: false, message: "License Expired" }), { status: 403 });
        }

        return new Response(JSON.stringify({ success: true, message: "License Valid!", data: licenseData }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
      }
    }

    // ==========================================
    // 6. SECURE SHOP PURCHASE (REACT APP)
    // ==========================================
    if (url.pathname === "/api/purchase") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
      try {
        const body: any = await request.json();
        const { emailKey, planName, creditPrice, idToken } = body;

        const dbUrl = `${env.FIREBASE_DB_URL}/customers/${emailKey}.json?auth=${idToken}`;
        const fetchRes = await fetch(dbUrl);
        if (!fetchRes.ok) return new Response(JSON.stringify({ success: false, message: "Firebase Auth Failed" }), { status: 401, headers: corsHeaders });
        
        const encryptedData = await fetchRes.json();
        const customer = decrypt(encryptedData, env.VITE_DB_SECRET);
        if (!customer) return new Response(JSON.stringify({ success: false, message: "Decryption Failed" }), { status: 500, headers: corsHeaders });

        if (customer.credits < creditPrice) return new Response(JSON.stringify({ success: false, message: "Insufficient credits" }), { status: 400, headers: corsHeaders });
        
        customer.credits -= creditPrice;
        customer.plan = planName;

        await fetch(dbUrl, { method: 'PUT', body: JSON.stringify(encrypt(customer, env.VITE_DB_SECRET)) });
        return new Response(JSON.stringify({ success: true, message: "Plan upgraded!", newCredits: customer.credits }), { status: 200, headers: corsHeaders });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // ==========================================
    // 7. SECURE RESELLER API (REACT APP)
    // ==========================================
    if (url.pathname === "/api/reseller") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
      try {
        const body: any = await request.json();
        const { hash, action, appSecret, appName, data } = body;
        if (!hash || !action) return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), { status: 400, headers: corsHeaders });

        // 1. Fetch Reseller
        const dbUrl = `${env.FIREBASE_DB_URL}/resellers/${hash}.json?auth=${env.FIREBASE_DB_SECRET}`;
        const res = await fetch(dbUrl);
        const encryptedReseller = await res.json();
        
        if (!encryptedReseller) return new Response(JSON.stringify({ success: false, message: "Invalid Reseller Link" }), { status: 404, headers: corsHeaders });

        let reseller = decrypt(encryptedReseller, env.VITE_DB_SECRET);
        if (!reseller || reseller.hash !== hash) return new Response(JSON.stringify({ success: false, message: "Decryption failed or invalid hash" }), { status: 500, headers: corsHeaders });

        if (action === "fetch_data") {
            let users: any = {};
            let licenses: any = {};
            let webhooks: any = {};

            if (appSecret && appName) {
                // Verify app access
                const hasApp = reseller.allowedApps && reseller.allowedApps.some((a: string) => a.startsWith(appSecret + '::'));
                if (hasApp) {
                    const usersUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users.json?auth=${env.FIREBASE_DB_SECRET}`;
                    const usersSnap = await fetch(usersUrl).then(r => r.json());
                    if (usersSnap) {
                        Object.keys(usersSnap).forEach(k => {
                            const u = decrypt(usersSnap[k], env.VITE_DB_SECRET);
                            if (u && u.createdBy === hash) users[k] = u;
                        });
                    }

                    const licUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/licenses.json?auth=${env.FIREBASE_DB_SECRET}`;
                    const licSnap = await fetch(licUrl).then(r => r.json());
                    if (licSnap) {
                        Object.keys(licSnap).forEach(k => {
                            const l = decrypt(licSnap[k], env.VITE_DB_SECRET);
                            if (l && l.createdBy === hash) licenses[k] = l;
                        });
                    }
                }
            }

            const whUrl = `${env.FIREBASE_DB_URL}/resellerWebhooks/${hash}.json?auth=${env.FIREBASE_DB_SECRET}`;
            const whSnap = await fetch(whUrl).then(r => r.json());
            if (whSnap) {
                webhooks = decrypt(whSnap, env.VITE_DB_SECRET) || webhooks;
            }

            return new Response(JSON.stringify({ success: true, reseller, users, licenses, webhooks }), { status: 200, headers: corsHeaders });
        }

        if (action === "register_device") {
            const { currentHWID, isLocked, failedAttempts } = data;
            reseller = { ...reseller, hwid: currentHWID, isLocked, failedAttempts };
            if (currentHWID !== undefined) reseller.hwidLock = true;
            reseller.lastLogin = new Date().toISOString();
            
            await fetch(dbUrl, { method: 'PUT', body: JSON.stringify(encrypt(reseller, env.VITE_DB_SECRET)) });
            return new Response(JSON.stringify({ success: true, reseller }), { status: 200, headers: corsHeaders });
        }

        // For all subsequent actions, verify app access
        if (!appSecret || !appName) return new Response(JSON.stringify({ success: false, message: "Missing app context" }), { status: 400, headers: corsHeaders });
        const hasApp = reseller.allowedApps && reseller.allowedApps.some((a: string) => a.startsWith(appSecret + '::'));
        if (!hasApp) return new Response(JSON.stringify({ success: false, message: "Unauthorized app access" }), { status: 403, headers: corsHeaders });

        if (action === "create_user") {
            const { username, payload } = data;
            const uUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users/${encodeURIComponent(username)}.json?auth=${env.FIREBASE_DB_SECRET}`;
            
            // Check if exists
            const existing = await fetch(uUrl).then(r => r.json());
            if (existing) return new Response(JSON.stringify({ success: false, message: "User already exists" }), { status: 400, headers: corsHeaders });

            payload.createdBy = hash; // Force createdBy
            await fetch(uUrl, { method: 'PUT', body: JSON.stringify(encrypt(payload, env.VITE_DB_SECRET)) });

            reseller.usersCreated = (reseller.usersCreated || 0) + 1;
            await fetch(dbUrl, { method: 'PUT', body: JSON.stringify(encrypt(reseller, env.VITE_DB_SECRET)) });

            return new Response(JSON.stringify({ success: true, reseller }), { status: 200, headers: corsHeaders });
        }

        if (action === "create_licenses") {
            const { licenses: newLicenses, amount } = data;
            // newLicenses is array of { key, payload }
            
            for (const item of newLicenses) {
                item.payload.createdBy = hash;
                const lUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/licenses/${encodeURIComponent(item.key)}.json?auth=${env.FIREBASE_DB_SECRET}`;
                await fetch(lUrl, { method: 'PUT', body: JSON.stringify(encrypt(item.payload, env.VITE_DB_SECRET)) });
            }

            reseller.licensesCreated = (reseller.licensesCreated || 0) + amount;
            await fetch(dbUrl, { method: 'PUT', body: JSON.stringify(encrypt(reseller, env.VITE_DB_SECRET)) });

            return new Response(JSON.stringify({ success: true, reseller }), { status: 200, headers: corsHeaders });
        }

        if (action === "update_user" || action === "delete_user") {
            const { username, payload } = data;
            const uUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/users/${encodeURIComponent(username)}.json?auth=${env.FIREBASE_DB_SECRET}`;
            
            const existing = await fetch(uUrl).then(r => r.json());
            if (!existing) return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404, headers: corsHeaders });
            
            const uData = decrypt(existing, env.VITE_DB_SECRET);
            if (!uData || uData.createdBy !== hash) return new Response(JSON.stringify({ success: false, message: "Unauthorized: User belongs to someone else" }), { status: 403, headers: corsHeaders });

            if (action === "delete_user") {
                await fetch(uUrl, { method: 'DELETE' });
            } else {
                // Must preserve createdBy
                payload.createdBy = hash;
                await fetch(uUrl, { method: 'PUT', body: JSON.stringify(encrypt(payload, env.VITE_DB_SECRET)) });
            }
            return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        if (action === "update_license" || action === "delete_license") {
            const { key, payload } = data;
            const lUrl = `${env.FIREBASE_DB_URL}/applications/${appSecret}/${encodeURIComponent(appName)}/licenses/${encodeURIComponent(key)}.json?auth=${env.FIREBASE_DB_SECRET}`;
            
            const existing = await fetch(lUrl).then(r => r.json());
            if (!existing) return new Response(JSON.stringify({ success: false, message: "License not found" }), { status: 404, headers: corsHeaders });
            
            const lData = decrypt(existing, env.VITE_DB_SECRET);
            if (!lData || lData.createdBy !== hash) return new Response(JSON.stringify({ success: false, message: "Unauthorized: License belongs to someone else" }), { status: 403, headers: corsHeaders });

            if (action === "delete_license") {
                await fetch(lUrl, { method: 'DELETE' });
            } else {
                payload.createdBy = hash;
                await fetch(lUrl, { method: 'PUT', body: JSON.stringify(encrypt(payload, env.VITE_DB_SECRET)) });
            }
            return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        if (action === "update_webhook") {
            const whUrl = `${env.FIREBASE_DB_URL}/resellerWebhooks/${hash}.json?auth=${env.FIREBASE_DB_SECRET}`;
            await fetch(whUrl, { method: 'PUT', body: JSON.stringify(encrypt(data.payload, env.VITE_DB_SECRET)) });
            return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        return new Response(JSON.stringify({ success: false, message: "Unknown action" }), { status: 400, headers: corsHeaders });

      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Hamza Backend Worker is Running! Secure API Active 🚀", { status: 200, headers: corsHeaders });
  },
};
