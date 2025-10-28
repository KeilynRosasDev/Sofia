// src/handlers/whatsappWebhook.js (FUNÇÃO processMessage ATUALIZADA)

const { handleMenu } = require('./initialMenu'); // <--- NOVO

const processMessage = (req, res) => {
    // ... (código anterior da verificação e iteração)

    body.entry.forEach(entry => {
        entry.changes.forEach(change => {
            if (change.field === 'messages' && change.value.messages) {
                
                const messageData = change.value.messages[0];
                const from = messageData.from; 
                let text = ''; 
                
                if (messageData.type === 'text') {
                    text = messageData.text.body;
                } else if (messageData.type === 'button') {
                    text = messageData.button.payload; 
                } 
                
                if (text) {
                    console.log(`💬 Mensagem recebida de ${from}: ${text}`);
                    
                    // AQUI CHAMAMOS O ROTEADOR PRINCIPAL DA SOFIA
                    handleMenu(from, text); // <--- AQUI ESTÁ A CHAVE!
                }

                // A resposta HTTP 200 é crucial para evitar reenvio
                return res.sendStatus(200); 
            }
        });
    });
    
    // ... (restante do código)
};