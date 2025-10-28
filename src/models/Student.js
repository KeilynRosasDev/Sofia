// src/models/Student.js
const mongoose = require('mongoose');

// Define o Schema do Aluno
const StudentSchema = new mongoose.Schema({
    // Identificação do Aluno
    registration: { // Matrícula (chave principal)
        type: String,
        required: true,
        unique: true
    },
    name: { // Nome completo
        type: String,
        required: true
    },
    whatsappNumber: { // Número de WhatsApp (para identificação)
        type: String,
        required: true,
        unique: true
    },

    // Dados Acadêmicos
    course: { // Curso atual
        type: String,
        required: true
    },
    currentSemester: { // Semestre atual em que o aluno está matriculado
        type: Number,
        required: true
    },
    enrollmentStatus: { // Status de Matrícula (Ativo, Trancado, Concluído)
        type: String,
        enum: ['Active', 'Locked', 'Completed'],
        default: 'Active'
    },
    finalSemesterDate: { // Data final do semestre (para a funcionalidade "Informar data final do semestre")
        type: Date,
        required: true
    },

    // Outros dados (ex: dados de login para sistema externo, se necessário)
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Exporta o Modelo
module.exports = mongoose.model('Student', StudentSchema);