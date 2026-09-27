const https = require('https');

const apiKey = "AIzaSyAGLsgTswXSjaBFzoSMSWsFGUUi3yetXeI";
const dbUrl = "https://zenix-auth-b04c1-default-rtdb.firebaseio.com";

// 1. Get Anonymous Token
const authReq = https.request(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const token = JSON.parse(body).idToken;
    
    // 2. Try to write to customers
    const writeReq = https.request(`${dbUrl}/customers/test@gmail,com.json?auth=${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, (dbRes) => {
      let dbBody = '';
      dbRes.on('data', d => dbBody += d);
      dbRes.on('end', () => {
        if (dbRes.statusCode === 200) {
          console.log('VULNERABLE: Anonymous user wrote to customers node!');
        } else {
          console.log('SECURE: Anonymous write rejected. ' + dbBody);
        }
      });
    });
    writeReq.write(JSON.stringify({ test: true }));
    writeReq.end();
  });
});

authReq.write(JSON.stringify({ returnSecureToken: true }));
authReq.end();
