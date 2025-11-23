require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Default Welcome Route
app.get("/", (req, res) => {
  res.send("TinyLink backend working!");
});

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health Check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// Create a short link
app.post("/api/links", async (req, res) => {
  const { url, code } = req.body;

  if (!url || !code) {
    return res.status(400).json({ error: "URL and code are required" });
  }

  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({ error: "Invalid shortcode format" });
  }

  try {
    const exists = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Code already exists" });
    }

    const result = await pool.query(
      "INSERT INTO links (code, url, clicks) VALUES ($1, $2, 0) RETURNING *",
      [code, url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List all links
app.get("/api/links", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM links ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Get stats for a link
app.get("/api/links/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a link
app.delete("/api/links/:code", async (req, res) => {
  const { code } = req.params;

  try {
    await pool.query("DELETE FROM links WHERE code = $1", [code]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect handler
app.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Not found");
    }

    const link = result.rows[0];

    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    return res.redirect(302, link.url);
  } catch {
    res.status(500).send("Server error");
  }
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`TinyLink backend running at http://localhost:${process.env.PORT}`);
});
