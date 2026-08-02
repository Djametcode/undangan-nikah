/**
 * Undangan Studio — Express server
 * Serves: invitation (dist/), admin panel (/admin), config API, uploads
 * Self-contained: run `node server.js` after `npm run build`.
 */
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const PORT = process.env.PORT || 3465;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const DIST_DIR = path.join(ROOT, "dist");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

// ---------- State ----------
let config = {};
let auth = {};
const sessions = new Set();

function loadFiles() {
  try { config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")); } catch { config = {}; }
  try { auth = JSON.parse(fs.readFileSync(AUTH_FILE, "utf8")); } catch { auth = { adminPassword: "admin123", sessionSecret: "undangan-studio-secret" }; }
}
function saveConfig() {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}
function saveAuth() {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), "utf8");
}
loadFiles();
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------- Auth ----------
function signSession() {
  return crypto.createHmac("sha256", auth.sessionSecret).update(Date.now().toString()).digest("hex").slice(0, 32);
}
function isAuthed(req) {
  const cookie = req.headers.cookie || "";
  const m = cookie.match(/session=([a-f0-9]+)/);
  return m && sessions.has(m[1]);
}
function requireAuth(req, res, next) {
  if (!isAuthed(req)) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// ---------- Multer ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, "-").slice(0, 40);
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB (video)
  fileFilter: (req, file, cb) => {
    const ok = /\.(jpg|jpeg|png|webp|gif|mp4|webm|mp3|ogg|wav)$/i.test(file.originalname);
    cb(ok ? null : new Error("Format tidak didukung"), ok);
  },
});

// ---------- App ----------
const app = express();
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(UPLOAD_DIR));

// ---------- API ----------
app.get("/api/config", (req, res) => res.json(config));

app.post("/api/login", (req, res) => {
  const { password } = req.body || {};
  if (password && password === auth.adminPassword) {
    const tok = signSession();
    sessions.add(tok);
    res.setHeader("Set-Cookie", `session=${tok}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
    return res.json({ ok: true });
  }
  res.status(401).json({ error: "Password salah" });
});

app.post("/api/logout", (req, res) => {
  const m = (req.headers.cookie || "").match(/session=([a-f0-9]+)/);
  if (m) sessions.delete(m[1]);
  res.clearCookie("session");
  res.json({ ok: true });
});

app.post("/api/config", requireAuth, (req, res) => {
  const body = req.body || {};
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Invalid body" });
  config = body;
  saveConfig();
  res.json({ ok: true });
});

app.post("/api/password", requireAuth, (req, res) => {
  const { current, next } = req.body || {};
  if (current !== auth.adminPassword) return res.status(403).json({ error: "Password lama salah" });
  if (!next || next.length < 4) return res.status(400).json({ error: "Password baru minimal 4 karakter" });
  auth.adminPassword = next;
  saveAuth();
  res.json({ ok: true });
});

app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  res.json({ ok: true, url: `/uploads/${req.file.filename}`, name: req.file.originalname, size: req.file.size });
});

app.get("/api/files", requireAuth, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map((f) => {
      const s = fs.statSync(path.join(UPLOAD_DIR, f));
      return { name: f, url: `/uploads/${f}`, size: s.size, mtime: s.mtimeMs };
    });
    res.json(files);
  } catch { res.json([]); }
});

app.delete("/api/upload/:file", requireAuth, (req, res) => {
  const f = path.basename(req.params.file).replace(/[^a-zA-Z0-9._-]/g, "");
  const fp = path.join(UPLOAD_DIR, f);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  res.json({ ok: true });
});

// ---------- Admin panel ----------
app.get("/admin", (req, res) => {
  res.sendFile(path.join(ROOT, "admin", "index.html"));
});

// ---------- Static dist (SPA) ----------
app.use(express.static(DIST_DIR));
app.use((req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Undangan Studio running on http://localhost:${PORT}`);
  console.log(`  Invitation : http://localhost:${PORT}/`);
  console.log(`  Admin      : http://localhost:${PORT}/admin`);
});
