const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    // ID (Primary Key) dibuatkan OTOMATIS oleh Sequelize.
    
    firstName: { // Sesuai keinginan kamu (huruf besar di tengah)
        type: DataTypes.STRING, 
        allowNull: false 
    },
    lastName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    }
    // createdAt & updatedAt (Timestamp) dibuatkan OTOMATIS oleh Sequelize.
});

module.exports = User;  