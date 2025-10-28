// src/models/Course.js
const mongoose = require('mongoose');

// Define um Sub-Schema para cada Disciplina
const DisciplineSchema = new mongoose.Schema({
    name: { // Nome da Disciplina
        type: String,
        required: true
    },
    code: { // Código da Disciplina (ex: PROG101)
        type: String,
        required: true
    },
    grade: { // Nota Final (para o Boletim)
        type: Number,
        default: 0
    },
    frequency: { // Frequência em porcentagem (para Declaração de Frequência)
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    schedule: { // Horário da Aula (ex: Seg 08:00-10:00)
        type: String
    }
}, { _id: false }); // Não precisa de ID separado para cada disciplina

// Define o Schema Principal (Vínculo de um Aluno com suas Disciplinas)
const CourseSchema = new mongoose.Schema({
    studentRegistration: { // Referência à Matrícula do Aluno (Chave estrangeira em SQL)
        type: String,
        ref: 'Student', // Referencia o Model 'Student'
        required: true,
        unique: true
    },
    semester: { // Semestre ao qual essas disciplinas pertencem (ex: 2024.1)
        type: String,
        required: true
    },
    disciplines: [DisciplineSchema] // Array de disciplinas que o aluno está cursando
});

// Exporta o Modelo
module.exports = mongoose.model('Course', CourseSchema);