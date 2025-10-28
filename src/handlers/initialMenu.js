// src/handlers/initialMenu.js

const { sendTextMessage } = require('../services/whatsappAPI');
const Student = require('../models/Student');
const academicDataHandler = require('./academicData'); // Manipulador de dados específicos

// --- Constantes do Menu ---
const MAIN_MENU = `
🤖 Olá! Eu sou a Sofia, sua assistente acadêmica virtual.
Em que posso te ajudar hoje?

*Escolha uma opção digitando o número correspondente:*

1️⃣ - Declararão de Vínculo
2️⃣ - Boletim de Notas
3️⃣ - Horário de Aulas
4️⃣ - Data Final do Semestre
5️⃣ - Calendário Acadêmico
`;

/**
 * Função principal que roteia a mensagem recebida.
 * @param {string} from - Número do aluno que enviou a mensagem.
 * @param {string} text - Conteúdo da mensagem.
 */
const handleMenu = async (from, text) => {
    // Limpeza da mensagem (remove espaços e torna minúscula)
    const cleanedText = text.trim().toLowerCase();

    // 1. VERIFICAR CADASTRO DO ALUNO
    // A Sofia precisa saber quem está falando. Usaremos o WhatsApp number como ID.
    const student = await Student.findOne({ whatsappNumber: from });
    
    if (!student) {
        // Aluno não encontrado no DB. Pedimos para ele se identificar ou cadastrar.
        const registrationMessage = `
        ❌ Parece que seu número (${from}) não está cadastrado em nossa base de alunos.
        Por favor, envie sua *matrícula* para que eu possa te identificar.
        `;
        return sendTextMessage(from, registrationMessage);
    }

    // 2. ROTEAMENTO DAS OPÇÕES DO MENU

    // Se a mensagem for "menu", "olá", ou "oi", mostramos o menu
    if (cleanedText === 'menu' || cleanedText === 'olá' || cleanedText === 'oi' || cleanedText === 'ola') {
        return sendTextMessage(from, MAIN_MENU);
    }
    
    // Se for uma das opções do menu principal
    switch (cleanedText) {
        case '1':
            // Delegamos a funcionalidade para o handler de dados acadêmicos
            return academicDataHandler.handleDeclaration(from, student, 'vinculo');
            
        case '2':
            return academicDataHandler.handleGrades(from, student);
            
        case '3':
            return academicDataHandler.handleSchedule(from, student);
            
        case '4':
            return academicDataHandler.handleFinalSemesterDate(from, student);
            
        case '5':
            return academicDataHandler.handleCalendar(from, student);
            
        default:
            // Resposta para opções não reconhecidas
            return sendTextMessage(from, 
                `Não entendi sua solicitação. Por favor, escolha um número do menu ou digite "menu" para ver as opções:\n${MAIN_MENU}`
            );
    }
};

/**
 * Função responsável por cadastrar/identificar o aluno (placeholder).
 * NOTE: Esta é uma simulação. Na prática, você validaria com um sistema acadêmico real.
 */
const handleRegistration = async (from, registrationId) => {
    // Lógica para buscar a matrícula e, se válido, salvar o whatsappNumber
    // Se a matrícula for válida:
    // await Student.updateOne({ registration: registrationId }, { whatsappNumber: from });
    
    // Por enquanto, apenas um placeholder:
    return sendTextMessage(from, `✅ Matrícula recebida! Verificando... Seus dados foram validados!
    Agora digite "menu" para acessar a *Sofia*.`);
}


module.exports = {
    handleMenu,
    handleRegistration // A ser usado no fluxo de identificação, se necessário
};