const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
const PORT = 3000;
const FLASK_URL = "http://localhost:5000";

app.use(express.urlencoded({ extended: true }));

// CSRF defense: SameSite cookie + check Origin/Referer header on POST
app.use((req, res, next) => {
  if (req.method === "POST") {
    const origin = req.headers.origin || req.headers.referer || "";
    if (!origin.includes(`localhost:${PORT}`) && !origin.includes(req.headers.host)) {
      return res.status(403).send("Forbidden: invalid request origin");
    }
  }
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "index.html"));
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.post("/submit", async (req, res) => {
  const { name, message } = req.body;
  try {
    const response = await fetch(`${FLASK_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    const data = await response.json();
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Flask Response</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f1117; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .card { background: #1a1d27; border: 1px solid #2d3148; border-radius: 16px; padding: 40px; width: 100%; max-width: 460px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
          .badge { display: inline-flex; align-items: center; gap: 6px; background: #1e2235; border: 1px solid #2d3148; border-radius: 20px; padding: 4px 12px; font-size: 12px; color: #7c85b3; margin-bottom: 20px; }
          .badge span { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; display: inline-block; }
          h2 { font-size: 22px; font-weight: 600; color: #f1f5f9; margin-bottom: 20px; }
          .result { background: #0f1117; border: 1px solid #2d3148; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #1e2235; }
          .row:last-child { border-bottom: none; }
          .key { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { font-size: 14px; color: #e2e8f0; text-align: right; max-width: 60%; }
          .status-pill { background: #14532d; color: #4ade80; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          a { display: block; text-align: center; padding: 12px; background: #1e2235; border: 1px solid #2d3148; border-radius: 8px; color: #6366f1; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.2s; }
          a:hover { background: #2d3148; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span></span> Flask Response</div>
          <h2>Message Received</h2>
          <div class="result">
            <div class="row">
              <span class="key">Status</span>
              <span class="status-pill">${escapeHtml(data.status)}</span>
            </div>
            <div class="row">
              <span class="key">Reply</span>
              <span class="value">${escapeHtml(data.reply)}</span>
            </div>
          </div>
          <a href="/">← Send another message</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(502).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', sans-serif; background: #0f1117; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .card { background: #1a1d27; border: 1px solid #3f1f1f; border-radius: 16px; padding: 40px; max-width: 460px; width: 100%; }
          h2 { color: #f87171; margin-bottom: 12px; }
          p { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
          a { display: block; text-align: center; padding: 12px; background: #1e2235; border: 1px solid #2d3148; border-radius: 8px; color: #6366f1; text-decoration: none; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>⚠ Connection Error</h2>
          <p>Could not reach Flask backend: ${err.message}</p>
          <a href="/">← Go back</a>
        </div>
      </body>
      </html>
    `);
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express app listening on port ${PORT}`);
});
