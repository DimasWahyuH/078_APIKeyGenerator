// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize, Admin } = require('./models');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Menyajikan file statis di folder public

// Routes API
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Route fallback untuk frontend (agar saat buka root langsung ke index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sinkronisasi Database & Start Server
// force: false agar data tidak hilang saat restart server
sequelize.sync({ force: false }).then(async () => {
    console.log('Database tersinkronisasi.');

    // --- SEED ADMIN DEFAULT ---
    // Cek apakah admin sudah ada, jika belum buat satu
    const adminExists = await Admin.findOne({ where: { email: 'admin@test.com' } });
    if (!adminExists) {
        // Hash password 'admin123'
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({
            email: 'admin@test.com',
            password: hashedPassword
        });
        console.log('Admin default dibuat. Email: admin@test.com, Pass: admin123');
    }

    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Gagal sinkronisasi DB:', err);
});