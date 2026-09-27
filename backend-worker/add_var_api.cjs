const fs = require('fs');
let code = fs.readFileSync('src/index.ts', 'utf8');

const cloudVarCode = `
    // ==========================================
    // 4. C# APP CLOUD VARIABLE API (FAST)
    // ==========================================
    if (url.pathname === "/api/var") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      try {
        const { appSecret, appName, varName } = await request.json() as any;
        if (!appSecret || !appName || !varName) {
          return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), { status: 400 });
        }

        const dbUrl = \`\${env.FIREBASE_DB_URL}/applications/\${appSecret}/\${appName}/variables/\${varName}.json\`;
        const res = await fetch(dbUrl);
        const encryptedVar = await res.json();
        
        if (!encryptedVar) {
          return new Response(JSON.stringify({ success: false, message: "Variable not found" }), { status: 404 });
        }

        const varValue = decrypt(encryptedVar, env.VITE_DB_SECRET);
        if (varValue === null) {
          return new Response(JSON.stringify({ success: false, message: "Decryption Failed" }), { status: 500 });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          data: varValue 
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
      }
    }
`;

code = code.replace('return new Response("Hamza Backend Worker is Running!', cloudVarCode + '\n    return new Response("Hamza Backend Worker is Running!');
fs.writeFileSync('src/index.ts', code);
console.log('Added Cloud Variable API');
