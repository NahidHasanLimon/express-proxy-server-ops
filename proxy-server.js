const express = require('express');
// const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
const port = 5003;

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log to file using morgan
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

// Global CORS headers (apply to ALL responses)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // allow any origin
  res.header('Access-Control-Allow-Methods', '*'); // allow any method
  res.header('Access-Control-Allow-Headers', '*'); // allow any header
  res.header('Access-Control-Allow-Credentials', 'true'); // allow credentials
  next();
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[HIT] ${req.method} ${req.url}`);
  next();
});

// Handle preflight requests (OPTIONS)
app.options('*', (req, res) => {
  console.log('OPTIONS preflight triggered');
  return res.sendStatus(204); // No content
});

// Proxy all other requests
app.all('*', async (req, res) => {
  const baseURL = process.env.TARGET_BASE_URL;
  const targetUrl = `${baseURL}${req.originalUrl}`;
  console.log('[Proxying] →', targetUrl);
  logRequest(req);
  console.log('req headers actions is : ', req.headers.action)
  try {
    const cleanedHeaders = { ...req.headers };
    delete cleanedHeaders.host;
    const reqFull =  {
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: cleanedHeaders

      
    };
    console.log("loggin the req full", reqFull)
    const response = await axios(reqFull);

    logResponse(response);

    return res.status(response.status).json(response.data);
  } catch (error) {
    logError(error);
    return res.status(error.response?.status || 500).json({ message: error.message });
  }
});

// --- Logging Helpers ---
function logRequest(req) {
  const log = `[REQUEST] ${new Date().toISOString()} ${req.method} ${req.url}\nHeaders: ${JSON.stringify(req.headers)}\nBody: ${JSON.stringify(req.body)}\n`;
  fs.appendFileSync('access.log', log);
}

function logResponse(response) {
  const log = `[RESPONSE] ${new Date().toISOString()} Status: ${response.status}\nData: ${JSON.stringify(response.data)}\n`;
  fs.appendFileSync('access.log', log);
}

function logError(error) {
  const log = `[ERROR] ${new Date().toISOString()} ${error.message}\n${error.stack}\n`;
  fs.appendFileSync('access.log', log);
}

// Start server
app.listen(port, () => {
  console.log(`✅ Proxy server running at http://localhost:${port}`);
});
