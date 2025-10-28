// server.js (ATUALIZADO)

require('dotenv').config();

const express = require('express');
const connectDB = require('./src/services/academicDB'); 
// Importa os manipuladores do Webhook
const { verifyWebhook, processMessage } = require('./src/handlers/whatsappWebhook'); 


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisar o corpo das requisições JSON
// O WhatsApp envia o webhook como JSON, por isso é importante
app.use(express.json());

// ----------------------------------------------------
// 1. INICIALIZAÇÃO E CONEXÃO
// ----------------------------------------------------
connectDB(); 

// ----------------------------------------------------
// 2. ROTAS PRINCIPAIS (Status)
// ----------------------------------------------------
app.get('/', (req, res) => {
    res.status(200).send({ message: `🤖 Sofia está Online e rodando na porta ${PORT}` });
});

// ----------------------------------------------------
// 3. ROTAS DO WHATSAPP WEBHOOK (Endpoint padrão: /webhook)
// ----------------------------------------------------

// Rota GET: Usada para a verificação inicial da URL do Webhook pela Meta
app.get('/webhook', verifyWebhook);

// Rota POST: Usada para receber todas as mensagens e eventos
app.post('/webhook', processMessage);


// ----------------------------------------------------
// 4. INICIA O SERVIDOR
// ----------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Webhook configurado no endpoint: /webhook`);
});