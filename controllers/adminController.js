// controllers/adminController.js
const { User, ApiKey, Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Helper: Hitung Status 30 Hari ---
const calculateStatus = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    // Hitung selisih waktu dalam milidetik
    const diffTime = Math.abs(currentDate - createdDate);
    // Ubah ke hari
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // Jika selisih > 30 hari, Invalid
    return diffDays > 30 ? 'Invalid' : 'Valid';
};

// 1. Login Admin
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan.' });

        // Cek password (bandingkan hash)
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Password salah.' });

        // Buat token JWT
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login sukses', token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get Dashboard Data (Semua User & Key)
// ... kode atas ...

exports.getDashboardData = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: ApiKey }],
            order: [['createdAt', 'DESC']]
        });

        const formattedData = [];
        users.forEach(user => {
            user.ApiKeys.forEach(apiKey => {
                formattedData.push({
                    // --- UBAH BAGIAN INI ---
                    // DARI: user_name: `${user.first_name} ${user.last_name}`,
                    // MENJADI:
                    user_name: `${user.firstName} ${user.lastName}`, 
                    // -----------------------
                    email: user.email,
                    key_id: apiKey.id,
                    key_value: apiKey.key_value,
                    created_at: apiKey.createdAt,
                    status: calculateStatus(apiKey.createdAt)
                });
            });
        });

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update API Key
exports.updateApiKey = async (req, res) => {
    try {
        const { id } = req.params; // ID dari URL
        const { new_key } = req.body; // Key baru dari body

        await ApiKey.update({ key_value: new_key }, { where: { id } });
        res.json({ message: 'API Key berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};