const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= SECURITY & PERFORMANCE =================
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CORS jika perlu API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  next();
});

// ================= COMPRESSION (Untuk Production) =================
// Install: npm install compression
// const compression = require('compression');
// app.use(compression());

// ================= VIEWS PATH =================
const viewsPath = path.join(__dirname, 'views');

// ================= ROUTES =================

// HOME
app.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

// PAKET
app.get('/paket-standar', (req, res) => {
  res.sendFile(path.join(viewsPath, 'paket-standar.html'));
});

app.get('/paket-bestseller', (req, res) => {
  res.sendFile(path.join(viewsPath, 'paket-bestseller.html'));
});

app.get('/paket-premium', (req, res) => {
  res.sendFile(path.join(viewsPath, 'paket-premium.html'));
});

// PORTFOLIO
app.get('/desainbangunan', (req, res) => {
  res.sendFile(path.join(viewsPath, 'desainbangunan.html'));
});

app.get('/desaininterior', (req, res) => {
  res.sendFile(path.join(viewsPath, 'desaininterior.html'));
});

// ================= REDIRECT (.html → clean URL) =================
const redirects = [
  { from: 'index.html', to: '/' },
  { from: 'paket-standar.html', to: '/paket-standar' },
  { from: 'paket-bestseller.html', to: '/paket-bestseller' },
  { from: 'paket-premium.html', to: '/paket-premium' },
  { from: 'desainbangunan.html', to: '/desainbangunan' },
  { from: 'desaininterior.html', to: '/desaininterior' }
];

redirects.forEach(({ from, to }) => {
  app.get(`/${from}`, (req, res) => {
    res.redirect(to);
  });
});

// ================= WHATSAPP REDIRECT =================
app.get('/whatsapp', (req, res) => {
  const { 
    paket = 'default', 
    nama = '-', 
    luas = '-',
    phone = '6281214186600' // Bisa custom nomor via query
  } = req.query;

  const phoneNumber = phone.replace(/[^0-9]/g, '');

  const paketText = {
    standar: 'Saya memilih Paket Standar',
    'best-seller': 'Saya memilih Paket Best Seller',
    'bestseller': 'Saya memilih Paket Best Seller',
    premium: 'Saya memilih Paket Premium',
    default: 'Saya ingin konsultasi desain rumah'
  };

  const packageSelection = paketText[paket] || paketText.default;

  const message = `Halo Admin SAKAPITU, saya ingin konsultasi jasa desain rumah.

Nama: ${nama}
${packageSelection}
Luas bangunan: ${luas} m²

*Pesan ini dikirim dari website sakapitu.com*`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // Log untuk analytics (opsional)
  console.log(`WhatsApp redirect: ${nama} - ${paket} - ${luas}m²`);
  
  res.redirect(whatsappUrl);
});

// ================= HEALTH CHECK (Untuk Render/Vercel) =================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'SAKAPITU Interior Web'
  });
});

// ================= SITEMAP & SEO (Opsional) =================
app.get('/sitemap.xml', (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://sakapitu.com/</loc><priority>1.0</priority></url>
  <url><loc>https://sakapitu.com/paket-standar</loc><priority>0.8</priority></url>
  <url><loc>https://sakapitu.com/paket-bestseller</loc><priority>0.8</priority></url>
  <url><loc>https://sakapitu.com/paket-premium</loc><priority>0.8</priority></url>
  <url><loc>https://sakapitu.com/desainbangunan</loc><priority>0.7</priority></url>
  <url><loc>https://sakapitu.com/desaininterior</loc><priority>0.7</priority></url>
</urlset>`;
  
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  // Jika request untuk HTML, kirim file 404.html
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(viewsPath, '404.html'));
  } else {
    res.status(404).json({ error: 'Halaman tidak ditemukan' });
  }
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(viewsPath, '500.html'));
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📁 Static files: ${path.join(__dirname, 'public')}`);
  console.log(`👀 Views: ${viewsPath}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📞 WhatsApp API: http://localhost:${PORT}/whatsapp?nama=John&paket=premium&luas=100`);
});