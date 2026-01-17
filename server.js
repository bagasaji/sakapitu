const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= STATIC FILE =================
app.use(express.static(path.join(__dirname, 'public')));

// ================= VIEWS =================
const viewsPath = path.join(__dirname, 'views');

// ================= HOME =================
app.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

// ================= PAKET =================
app.get('/paket-standar', (req, res) => {
  res.sendFile(path.join(viewsPath, 'paket-standar.html'));
});

app.get('/paket-bestseller', (req, res) => {
  res.sendFile(path.join(viewsPath, 'paket-bestseller.html'));
});

app.get('/paket-premium', (req, res) => {
  res.sendFile(path.join(viewsPath, 'paket-premium.html'));
});

// ================= PORTFOLIO =================
app.get('/desainbangunan', (req, res) => {
  res.sendFile(path.join(viewsPath, 'desainbangunan.html'));
});

app.get('/desaininterior', (req, res) => {
  res.sendFile(path.join(viewsPath, 'desaininterior.html'));
});

// ================= REDIRECT (.html → clean URL) =================
const redirects = [
  'paket-standar',
  'paket-bestseller',
  'paket-premium',
  'desainbangunan',
  'desaininterior'
];

redirects.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    res.redirect(`/${page}`);
  });
});

// ================= WHATSAPP REDIRECT =================
app.get('/whatsapp', (req, res) => {
  const { paket = 'default', nama = '-', luas = '-' } = req.query;

  const phoneNumber = '6281214186600';

  const paketText = {
    standar: 'Saya memilih Paket Standar',
    'best-seller': 'Saya memilih Paket Best Seller',
    premium: 'Saya memilih Paket Premium',
    default: 'Saya ingin konsultasi desain rumah'
  };

  const message = `Halo Admin SAKAPITU, saya ingin konsultasi jasa desain rumah.

Nama: ${nama}
${paketText[paket] || paketText.default}
Luas bangunan: ${luas} m²`;

  res.redirect(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  );
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).send('404 | Halaman tidak ditemukan');
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});
