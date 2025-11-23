const { User, ApiKey } = require('../models');

exports.registerUser = async (req, res) => {
    try {
        // TERIMA DATA DARI FRONTEND (pastikan frontend kirim 'firstName' juga)
        const { firstName, lastName, email, generated_key } = req.body;

        if (!generated_key) {
            return res.status(400).json({ message: 'API Key belum digenerate.' });
        }

        // Cari user atau buat baru (gunakan firstName & lastName)
        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: { firstName, lastName } 
        });

        const newKey = await ApiKey.create({
            key_value: generated_key,
            UserId: user.id
        });

        res.status(201).json({
            message: 'Data berhasil disimpan!',
            user: user.email,
            apiKey: newKey.key_value,
            status: 'Valid (Baru dibuat)'
        });

    } catch (error) {
        console.error("Error Detail:", error); // Biar error terlihat jelas di terminal
        res.status(500).json({ message: error.message });
    }
};