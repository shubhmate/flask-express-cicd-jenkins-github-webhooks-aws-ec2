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
      <html>
      <head>
        <title>Result</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 500px; margin: 60px auto; }
          .result { padding: 16px; background: #e6f4ea; border-radius: 4px; }
          a { display: inline-block; margin-top: 16px; color: #007bff; }
        </style>
      </head>
      <body>
        <h2>Flask Response</h2>
        <div class="result">
          <p><strong>Status:</strong> ${escapeHtml(data.status)}</p>
          <p><strong>Reply:</strong> ${escapeHtml(data.reply)}</p>
        </div>
        <a href="/">← Go back</a>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(502).send(`<p>Error contacting Flask backend: ${err.message}</p><a href="/">← Go back</a>`);
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express app listening on port ${PORT}`);
});
