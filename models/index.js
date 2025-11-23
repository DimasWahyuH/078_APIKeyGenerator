// models/index.js
const sequelize = require('../config/database');
const User = require('./user');
const ApiKey = require('./apiKey');
const Admin = require('./admin');

// Relasi: Satu User punya banyak ApiKey
User.hasMany(ApiKey, { onDelete: 'CASCADE' });
ApiKey.belongsTo(User);

// Ekspor model dan koneksi
module.exports = {
    sequelize,
    User,
    ApiKey,
    Admin
};