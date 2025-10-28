// seed.js

// Carrega as variáveis de ambiente
require('dotenv').config(); 

const mongoose = require('mongoose');
const Student = require('./src/models/Student');
const Course = require('./src/models/Course');

const MONGO_URI = process.env.MONGO_URI;

// --- DADOS DE TESTE DA SOFIA ---

// 1. Dados do Aluno de Teste (VOCÊ)
const studentData = {
    registration: "123456789",
    name: "Keilyn Rosas",
    // IMPORTANTE: Mude para o seu número de WhatsApp! (Ex: "5581987654321")
    whatsappNumber: "WHATSAPP_TEST_NUMBER_AQUI", 
    course: " Sistemas de Informação",
    currentSemester: 3,
    enrollmentStatus: "Active",
    // Data final simulada (Ex: 15 de Dezembro de 2025)
    finalSemesterDate: new Date('2025-12-15T00:00:00.000Z') 
};

// 2. Dados das Disciplinas (Para o Boletim/Horário)
const courseData = {
    studentRegistration: "123456789",
    semester: "2025.2", // Semestre atual simulado
    disciplines: [
        {
            name: "Programação Web I",
            code: "PWI001",
            grade: 8.5,
            frequency: 95,
            schedule: "Segundas e Quartas, 19:00 - 20:40"
        },
        {
            name: "Banco de Dados",
            code: "BDD002",
            grade: 6.8,
            frequency: 72,
            schedule: "Terças e Quintas, 17:00 - 18:40"
        },
        {
            name: "Engenharia de Software",
            code: "ESD003",
            grade: 9.2,
            frequency: 100,
            schedule: "Sextas, 14:00 - 17:40"
        }
    ]
};

/**
 * Função principal para popular o banco de dados.
 */
const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB: Conexão estabelecida.');

        // 1. Limpa os dados existentes para evitar duplicatas nos testes
        await Student.deleteMany({});
        await Course.deleteMany({});
        console.log('🗑️ Dados antigos deletados.');

        // 2. Insere os novos dados
        const newStudent = await Student.create(studentData);
        await Course.create(courseData);
        
        console.log(`✨ Aluno de Teste "${newStudent.name}" e Disciplinas inseridos com sucesso!`);
        console.log('Pronto para testar a Sofia.');
        
    } catch (error) {
        console.error('❌ ERRO no Povoamento do DB:', error.message);
    } finally {
        // 3. Fecha a conexão com o banco de dados
        mongoose.connection.close();
    }
};

seedDB();