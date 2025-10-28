// src/handlers/academicData.js

const { sendTextMessage, sendDocumentMessage, sendImageMessage } = require('../services/whatsappAPI');
const Student = require('../models/Student');
const Course = require('../models/Course');
const path = require('path');

// =================================================================
// VARIÁVEIS DE CAMINHO DOS ARQUIVOS ESTÁTICOS (assets)
// NOTA: Em produção, esses arquivos DEVERIAM estar hospedados em um URL público (ex: S3, Google Cloud Storage)
// Para o nosso teste, vamos simular que eles estão em URLs fictícias (mas que funcionam para o serviço sendDocumentMessage)
// =================================================================

// Simulação de URLs públicas para os documentos/imagens
const ASSET_BASE_URL = 'http://sua-url-de-hospedagem.com/assets/'; // URL base fictícia
const ASSET_PATHS = {
    CALENDARIO: ASSET_BASE_URL + 'CalendarioDols.jpeg',
    FREQUENCIA: ASSET_BASE_URL + 'DeclaracaoDeFrequencia.pdf',
    VINCULO: ASSET_BASE_URL + 'DeclaracaoDeVinculo.pdf',
    HORARIO: ASSET_BASE_URL + 'HorarioDeAulas.jpeg'
};

// =================================================================
// 1. DECLARAÇÃO DE VÍNCULO (e Frequência)
// =================================================================

/**
 * Envia a Declaração de Vínculo ou de Frequência.
 * @param {string} from - Número do aluno.
 * @param {object} student - Documento Mongoose do aluno.
 * @param {'vinculo' | 'frequencia'} type - Tipo de declaração solicitada.
 */
const handleDeclaration = (from, student, type) => {
    let url, filename, caption;

    if (type === 'vinculo') {
        url = ASSET_PATHS.VINCULO;
        filename = `Declaracao_Vinculo_${student.registration}.pdf`;
        caption = `Olá ${student.name}, aqui está sua Declaração de Vínculo (Status: ${student.enrollmentStatus}).`;
    } else { // Frequência (se adicionarmos ao menu)
        url = ASSET_PATHS.FREQUENCIA;
        filename = `Declaracao_Frequencia_${student.registration}.pdf`;
        caption = `Olá ${student.name}, aqui está sua Declaração de Frequência detalhada.`;
    }
    
    // Simplesmente envia o PDF.
    return sendDocumentMessage(from, url, caption, filename);
};


// =================================================================
// 2. BOLETIM DE NOTAS
// =================================================================

/**
 * Busca e envia o Boletim de Notas do aluno.
 * @param {string} from - Número do aluno.
 * @param {object} student - Documento Mongoose do aluno.
 */
const handleGrades = async (from, student) => {
    try {
        // Busca as notas do semestre atual do aluno no DB
        const studentCourses = await Course.findOne({ 
            studentRegistration: student.registration,
            semester: `${new Date().getFullYear()}.1` // Simula busca pelo semestre atual (ex: 2025.1)
        });

        if (!studentCourses || studentCourses.disciplines.length === 0) {
            return sendTextMessage(from, 
                `Não foi possível encontrar o boletim de notas para o semestre atual de ${student.course}.`
            );
        }

        // Constrói a mensagem do boletim
        let bulletin = `📊 *Boletim de Notas - Semestre ${studentCourses.semester}*\n\n`;

        studentCourses.disciplines.forEach(discipline => {
            bulletin += `*${discipline.name}* (${discipline.code})\n`;
            bulletin += `  • Nota: ${discipline.grade.toFixed(1)}\n`;
            bulletin += `  • Frequência: ${discipline.frequency}%\n`;
            bulletin += '------------------------------\n';
        });
        
        return sendTextMessage(from, bulletin);

    } catch (error) {
        console.error('Erro ao buscar o boletim:', error);
        return sendTextMessage(from, 'Desculpe, Sofia está com problemas técnicos para acessar seu boletim.');
    }
};

// =================================================================
// 3. HORÁRIO DE AULAS
// =================================================================

/**
 * Envia o Horário de Aulas (simulado por imagem).
 * @param {string} from - Número do aluno.
 * @param {object} student - Documento Mongoose do aluno.
 */
const handleSchedule = (from, student) => {
    const caption = `🗓️ Olá ${student.name}, segue o seu Horário de Aulas completo para o Semestre ${student.currentSemester}.`;
    
    // Simplesmente envia a imagem
    return sendImageMessage(from, ASSET_PATHS.HORARIO, caption);
};

// =================================================================
// 4. DATA FINAL DO SEMESTRE
// =================================================================

/**
 * Informa a Data Final do Semestre.
 * @param {string} from - Número do aluno.
 * @param {object} student - Documento Mongoose do aluno.
 */
const handleFinalSemesterDate = (from, student) => {
    // Usamos a data armazenada no StudentSchema
    const finalDate = student.finalSemesterDate.toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const message = `
    📅 *Data Final do Semestre*
    
    O seu semestre atual termina em: *${finalDate}*.
    
    Lembre-se de verificar o calendário acadêmico completo para prazos de exames e recursos.
    `;
    
    return sendTextMessage(from, message);
};


// =================================================================
// 5. CALENDÁRIO ACADÊMICO
// =================================================================

/**
 * Envia o Calendário Acadêmico (simulado por imagem).
 * @param {string} from - Número do aluno.
 * @param {object} student - Documento Mongoose do aluno.
 */
const handleCalendar = (from, student) => {
    const caption = '🗓️ Este é o Calendário Acadêmico Oficial da Instituição para o ano letivo atual.';
    
    // Simplesmente envia a imagem
    return sendImageMessage(from, ASSET_PATHS.CALENDARIO, caption);
};


module.exports = {
    handleDeclaration,
    handleGrades,
    handleSchedule,
    handleFinalSemesterDate,
    handleCalendar
};