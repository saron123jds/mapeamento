
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true, limit:"10mb"}));

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure files
function ensureFiles() {
  if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      mapImage: "", // /uploads/map.png
      entrance: { x: 5, y: 95 } // percentage
    }, null, 2));
  }
}
ensureFiles();

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return file.endsWith('.json') ? (file.includes('products') ? [] : {}) : null;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Static files
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/', express.static(PUBLIC_DIR));

// Multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, 'map' + ext.toLowerCase());
  }
});
const upload = multer({ storage });

// API routes
app.get('/api/products', (req, res) => {
  res.json(readJSON(PRODUCTS_FILE));
});

app.post('/api/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const body = req.body || {};
  // simple id
  const id = (Date.now().toString(36) + Math.random().toString(36).slice(2));
  const product = {
    id,
    name: body.name || "",
    category: body.category || "",
    aisle: body.aisle || "",
    shelf: body.shelf || "",
    side: body.side || "",
    photo: body.photo || "",
    x: body.x ?? null,
    y: body.y ?? null
  };
  products.push(product);
  writeJSON(PRODUCTS_FILE, products);
  res.json(product);
});

app.put('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({error: 'not found'});
  products[idx] = { ...products[idx], ...req.body };
  writeJSON(PRODUCTS_FILE, products);
  res.json(products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const next = products.filter(p => p.id !== req.params.id);
  writeJSON(PRODUCTS_FILE, next);
  res.json({ ok: true });
});

app.get('/api/config', (req, res) => {
  res.json(readJSON(CONFIG_FILE));
});

app.put('/api/config', (req, res) => {
  const current = readJSON(CONFIG_FILE);
  const next = { ...current, ...req.body };
  writeJSON(CONFIG_FILE, next);
  res.json(next);
});

app.post('/api/upload-map', upload.single('map'), (req, res) => {
  // Save path in config
  const current = readJSON(CONFIG_FILE);
  const mapImage = '/uploads/' + req.file.filename;
  const next = { ...current, mapImage };
  writeJSON(CONFIG_FILE, next);
  res.json({ ok: true, mapImage });
});

// Fallback to index.html
app.get('/admin', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin.html')));
app.get('/totem', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'totem.html')));

app.listen(PORT, () => {
  console.log(`MapaFácil Market rodando em http://localhost:${PORT}`);
});
