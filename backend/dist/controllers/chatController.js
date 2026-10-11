"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = exports.mockMessages = exports.mockConversations = void 0;
const uuid_1 = require("uuid");
// Armazenamento em memória para demonstração ativa e persistência de sessão
exports.mockConversations = [
    {
        id: 'conv-01',
        contratanteId: 'user-lara-nubank',
        contratanteNome: 'Lara — RH Nubank',
        contratanteAvatar: '💼',
        prestadorId: 'user-001-prof',
        prestadorNome: 'Lucas Vinícius',
        prestadorAvatar: '🧑‍💻',
        jobId: 'job-102',
        jobTitle: 'Desenvolvedor Full-Stack Sênior',
        status: 'contratado',
        lastMessage: 'Perfeito, o pagamento de R$ 4.500 foi retido em custódia Workly!',
        lastMessageTime: '10:42',
        unreadCountContratante: 0,
        unreadCountPrestador: 1
    },
    {
        id: 'conv-02',
        contratanteId: 'user-carlos-contratante',
        contratanteNome: 'Carlos Mendes',
        contratanteAvatar: '🏢',
        prestadorId: 'user-001-prof',
        prestadorNome: 'Lucas Vinícius',
        prestadorAvatar: '🧑‍💻',
        jobId: 'job-101',
        jobTitle: 'Instalação de Painel Elétrico',
        status: 'proposta_enviada',
        lastMessage: 'Posso comparecer amanhã às 9h para iniciar o serviço.',
        lastMessageTime: 'Ontem',
        unreadCountContratante: 1,
        unreadCountPrestador: 0
    },
    {
        id: 'conv-03',
        contratanteId: 'user-marina',
        contratanteNome: 'Marina Souza',
        contratanteAvatar: '✨',
        prestadorId: 'user-001-prof',
        prestadorNome: 'Lucas Vinícius',
        prestadorAvatar: '🧑‍💻',
        jobId: 'job-103',
        jobTitle: 'Design de Landing Page',
        status: 'concluido',
        lastMessage: 'Ficou ótimo, muito obrigado pelo trabalho!',
        lastMessageTime: '14:20',
        unreadCountContratante: 0,
        unreadCountPrestador: 0
    }
];
exports.mockMessages = {
    'conv-01': [
        {
            id: 'msg-01',
            conversationId: 'conv-01',
            senderId: 'user-lara-nubank',
            senderName: 'Lara — RH Nubank',
            senderRole: 'contratante',
            content: 'Olá Lucas! Vimos seu perfil no Workly com Score 885 e adoramos suas recomendações.',
            type: 'text',
            createdAt: '2026-10-10T10:15:00.000Z'
        },
        {
            id: 'msg-02',
            conversationId: 'conv-01',
            senderId: 'user-001-prof',
            senderName: 'Lucas Vinícius',
            senderRole: 'prestador',
            content: 'Olá Lara! Muito obrigado. Posso assumir o projeto para entrega em 15 dias.',
            type: 'text',
            createdAt: '2026-10-10T10:20:00.000Z'
        },
        {
            id: 'msg-03',
            conversationId: 'conv-01',
            senderId: 'user-001-prof',
            senderName: 'Lucas Vinícius',
            senderRole: 'prestador',
            content: 'Proposta formal enviada no valor de R$ 4.500,00 com garantia Workly Escrow.',
            type: 'proposal',
            metadata: { valor: 4500, jobTitle: 'Desenvolvedor Full-Stack Sênior', status: 'aceita' },
            createdAt: '2026-10-10T10:30:00.000Z'
        },
        {
            id: 'msg-04',
            conversationId: 'conv-01',
            senderId: 'user-lara-nubank',
            senderName: 'Lara — RH Nubank',
            senderRole: 'contratante',
            content: 'Perfeito, o pagamento de R$ 4.500 foi retido em custódia Workly! Assim que o código for homologado liberamos via QR Code.',
            type: 'text',
            createdAt: '2026-10-10T10:42:00.000Z'
        }
    ],
    'conv-02': [
        {
            id: 'msg-10',
            conversationId: 'conv-02',
            senderId: 'user-carlos-contratante',
            senderName: 'Carlos Mendes',
            senderRole: 'contratante',
            content: 'Olá amigo, temos um quadro elétrico trifásico que precisa de revisão urgente.',
            type: 'text',
            createdAt: '2026-10-09T16:00:00.000Z'
        },
        {
            id: 'msg-11',
            conversationId: 'conv-02',
            senderId: 'user-001-prof',
            senderName: 'Lucas Vinícius',
            senderRole: 'prestador',
            content: 'Posso comparecer amanhã às 9h para iniciar o serviço. Valor de R$ 350,00.',
            type: 'text',
            createdAt: '2026-10-09T16:15:00.000Z'
        }
    ]
};
class ChatController {
    // Lista todas as conversas do usuário autenticado
    static listConversations(req, res) {
        const currentUserId = req.user?.id || 'user-001-prof';
        // Retorna as conversas onde o usuário participa (ou todas para demo)
        const list = exports.mockConversations.map(c => {
            const isContratante = c.contratanteId === currentUserId;
            return {
                ...c,
                interlocutorNome: isContratante ? c.prestadorNome : c.contratanteNome,
                interlocutorAvatar: isContratante ? c.prestadorAvatar : c.contratanteAvatar,
                interlocutorRole: isContratante ? 'Prestador' : 'Contratante',
                myRole: isContratante ? 'contratante' : 'prestador'
            };
        });
        return res.json({ conversations: list });
    }
    // Obter mensagens de uma conversa
    static getMessages(req, res) {
        const { id } = req.params;
        const conversation = exports.mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversa não encontrada.' });
        }
        const messages = exports.mockMessages[id] || [];
        return res.json({ conversation, messages });
    }
    // Enviar mensagem na conversa
    static sendMessage(req, res) {
        const { id } = req.params;
        const { content, type = 'text', metadata } = req.body;
        const currentUserId = req.user?.id || 'user-001-prof';
        const conversation = exports.mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversa não encontrada.' });
        }
        if (!content && type === 'text') {
            return res.status(400).json({ error: 'Mensagem não pode ser vazia.' });
        }
        const isContratante = conversation.contratanteId === currentUserId;
        const senderRole = isContratante ? 'contratante' : 'prestador';
        const senderName = isContratante ? conversation.contratanteNome : conversation.prestadorNome;
        const newMessage = {
            id: 'msg-' + (0, uuid_1.v4)().slice(0, 8),
            conversationId: id,
            senderId: currentUserId,
            senderName,
            senderRole,
            content,
            type,
            metadata,
            createdAt: new Date().toISOString()
        };
        if (!exports.mockMessages[id]) {
            exports.mockMessages[id] = [];
        }
        exports.mockMessages[id].push(newMessage);
        // Atualiza conversa com a última mensagem real
        conversation.lastMessage = type === 'proposal' ? `Proposta de R$ ${metadata?.valor || 0}` : content;
        conversation.lastMessageTime = 'Agora';
        return res.status(201).json({ message: newMessage });
    }
    // Iniciar uma nova conversa real entre contratante e prestador
    static startConversation(req, res) {
        const { contratanteId, prestadorId, jobId, jobTitle, contratanteNome, prestadorNome } = req.body;
        if (!contratanteId || !prestadorId) {
            return res.status(400).json({ error: 'contratanteId e prestadorId são obrigatórios.' });
        }
        // Verifica se já existe conversa entre os dois para a vaga ou geral
        let conversation = exports.mockConversations.find(c => (c.contratanteId === contratanteId && c.prestadorId === prestadorId) ||
            (c.contratanteId === prestadorId && c.prestadorId === contratanteId));
        if (!conversation) {
            conversation = {
                id: 'conv-' + (0, uuid_1.v4)().slice(0, 8),
                contratanteId,
                contratanteNome: contratanteNome || 'Contratante',
                contratanteAvatar: '💼',
                prestadorId,
                prestadorNome: prestadorNome || 'Profissional',
                prestadorAvatar: '🧑‍💻',
                jobId,
                jobTitle: jobTitle || 'Serviço Profissional',
                status: 'ativa',
                lastMessage: 'Conversa iniciada',
                lastMessageTime: 'Agora',
                unreadCountContratante: 0,
                unreadCountPrestador: 0
            };
            exports.mockConversations.unshift(conversation);
            exports.mockMessages[conversation.id] = [];
        }
        return res.json({ conversation });
    }
    // Liberar custódia (Escrow) dentro da conversa
    static releaseEscrow(req, res) {
        const { id } = req.params;
        const conversation = exports.mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversa não encontrada.' });
        }
        const releaseMsg = {
            id: 'msg-' + (0, uuid_1.v4)().slice(0, 8),
            conversationId: id,
            senderId: 'sistema-workly',
            senderName: '🛡️ Workly Garantia',
            senderRole: 'sistema',
            content: '✅ PAGAMENTO LIBERADO COM SUCESSO! O valor foi creditado na carteira Workly Pay do prestador via Pix.',
            type: 'escrow_release',
            metadata: { status: 'concluido' },
            createdAt: new Date().toISOString()
        };
        if (!exports.mockMessages[id])
            exports.mockMessages[id] = [];
        exports.mockMessages[id].push(releaseMsg);
        conversation.status = 'concluido';
        conversation.lastMessage = '✅ Pagamento liberado com sucesso!';
        return res.json({ success: true, message: releaseMsg });
    }
}
exports.ChatController = ChatController;
