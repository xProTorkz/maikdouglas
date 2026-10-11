"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
exports.io = io;
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Gerenciador de eventos WebSocket em tempo real
io.on('connection', (socket) => {
    console.log(`🔌 Cliente WebSocket conectado: ${socket.id}`);
    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`👥 Cliente ${socket.id} sincronizado na conversa ${conversationId}`);
    });
    socket.on('send_message', (data) => {
        io.to(data.conversationId).emit('receive_message', data);
    });
    socket.on('escrow_update', (data) => {
        io.to(data.conversationId).emit('escrow_updated', data);
    });
    socket.on('score_update', (data) => {
        io.emit('score_updated', data);
    });
    socket.on('disconnect', () => {
        console.log(`❌ Cliente WebSocket desconectado: ${socket.id}`);
    });
});
app.set('io', io);
// Healthcheck
app.get('/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        service: 'Workly API Core & Realtime Engine',
        timestamp: new Date().toISOString(),
        version: '1.2.0',
        websocket: 'ENABLED'
    });
});
// Rotas da API REST
app.use('/api/v1', routes_1.default);
// Diretório estático do front-end extraído
const appDir = path_1.default.resolve(__dirname, '../../app');
app.use(express_1.default.static(appDir));
// Fallback SPA para TanStack Router (rotas como /login, /jobs, /home, etc.)
app.get('*', (req, res) => {
    if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).send('Not Found');
    }
    res.sendFile(path_1.default.join(appDir, 'index.html'));
});
server.listen(PORT, () => {
    console.log('==================================================');
    console.log(`🚀 WORKLY SUPERAPP FULLSTACK NA PORTA ${PORT}`);
    console.log(`📡 Healthcheck API: http://localhost:${PORT}/health`);
    console.log(`🔌 Endpoints API:  http://localhost:${PORT}/api/v1/jobs`);
    console.log(`💬 WebSocket Realtime: ATIVO (Socket.io)`);
    console.log(`💻 Interface Web:  http://localhost:${PORT}/login`);
    console.log('==================================================');
});
exports.default = server;
