// src/services/academicDB.js

const mongoose = require('mongoose');

/**
 * Função responsável por iniciar e manter a conexão com o MongoDB.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('✅ MongoDB: Conexão estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ MongoDB: Erro ao conectar ao banco de dados:', error.message);
        // Em caso de falha crítica na conexão, encerramos a aplicação.
        process.exit(1); 
    }
};

module.exports = connectDB;