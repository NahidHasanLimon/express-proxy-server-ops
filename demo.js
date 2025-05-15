const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/proxy-login', async (req, res) => {
  try {
    const response = await axios.post('http://api-backoffice-admin.test/api/v1/endpoint',
      {
        user_id: '',
        user_pass: ''
      },
      {
        headers: {
          'sec-ch-ua-platform': '"Android"',
          'userAgent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
          'lang': 'en-US',
          'browserName': 'Netscape',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'osPlatform': 'Linux x86_64',
          'simId': '9b7e159d-040e-4c1a-b2ea-84e98b2294c4',
          'deviceId': 'TW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDYuMDsgTmV4dXMgNSBCdWlsZC9NUkE1OE4pIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzUuMC4wLjAgTW9iaWxlIFNhZmFyaS81MzcuMzY=',
          'subscriptionId': 'SUBSCRIBE090932',
          'sec-ch-ua-mobile': '?1',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'sessionId': '',  // Note: The curl had 'sessionId;' which is likely a typo. Setting it empty.
          'ipAddress': '192.168.69.191',
          'browserVersion': '5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
          'action': 'login',
          'Referer': 'http://localhost:5002/',
          'googleAdId': 'GOOGLE090932',
          'deviceType': 'Mobile',
          'apiUrl': '/api/v1/login',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error making request:', error.message);
    res.status(error.response?.status || 500).json({
      error: true,
      message: error.response?.data || 'Internal server error',
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
