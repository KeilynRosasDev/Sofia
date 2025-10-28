// src/services/whatsappAPI.js

const axios = require('axios');

// URL base da API do WhatsApp da Meta (versão 19.0 - pode mudar no futuro)
const API_URL = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

/**
 * Função utilitária para enviar qualquer requisição à API do WhatsApp.
 * @param {string} to - Número de telefone do destinatário (aluno).
 * @param {object} messagePayload - Objeto de payload da mensagem no formato da Meta.
 */
const sendMessage = async (to, messagePayload) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                messaging_product: "whatsapp",
                to: to,
                ...messagePayload // O payload específico (texto, documento, etc.)
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`✅ Mensagem enviada com sucesso para ${to}. Status: ${response.status}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Erro ao enviar mensagem para ${to}:`, error.response ? error.response.data : error.message);
        // Em um ambiente real, você faria log do erro ou tentaria novamente.
        return null;
    }
};

// -------------------------------------------------------------
// FUNÇÕES ESPECÍFICAS DE ENVIO (para uso nos Handlers)
// -------------------------------------------------------------

/**
 * Envia uma mensagem de texto simples.
 */
const sendTextMessage = (to, text) => {
    const payload = {
        type: "text",
        text: {
            body: text
        }
    };
    return sendMessage(to, payload);
};

/**
 * Envia um documento (PDF, no nosso caso).
 * Nota: O documento deve estar previamente hospedado e ter um ID. 
 * Para simplificar AQUI, usaremos um link público direto ou um ID de mídia.
 * Para produção, o ideal é usar a API de Upload de Mídia da Meta.
 */
const sendDocumentMessage = (to, documentUrlOrId, caption, fileName) => {
    const payload = {
        type: "document",
        document: {
            // Nota: Para este projeto, usaremos URL. Em produção, use 'id'.
            link: documentUrlOrId, 
            caption: caption,
            filename: fileName // Nome do arquivo que o aluno verá
        }
    };
    return sendMessage(to, payload);
};

/**
 * Envia uma imagem (JPEG, no nosso caso).
 * Nota: O arquivo deve estar previamente hospedado e ter um ID (veja nota acima).
 */
const sendImageMessage = (to, imageUrlOrId, caption) => {
    const payload = {
        type: "image",
        image: {
            // Nota: Para este projeto, usaremos URL. Em produção, use 'id'.
            link: imageUrlOrId, 
            caption: caption
        }
    };
    return sendMessage(to, payload);
};

module.exports = {
    sendTextMessage,
    sendDocumentMessage,
    sendImageMessage
};