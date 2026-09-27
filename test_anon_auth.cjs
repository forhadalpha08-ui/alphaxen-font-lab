const https = require('https');

const apiKey = "AIzaSyAGLsgTswXSjaBFzoSMSWsFGUUi3yetXeI";
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

const data = JSON.stringify({
  returnSecureToken: true
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(url, options, (res) => {
  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(responseBody);
    if (json.error) {
      console.log('FAILED: ' + json.error.message);
    } else if (json.idToken) {
      console.log('SUCCESS: Anonymous Auth is enabled!');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
