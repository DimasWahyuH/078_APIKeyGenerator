// models/apiKey.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApiKey = sequelize.define('ApiKey', {
    key_value: { type: DataTypes.STRING, allowNull: false },
    // Timestamp createdAt dan updatedAt otomatis dibuat Sequelize
});

module.exports = ApiKey;