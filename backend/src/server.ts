import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Gerenciador de eventos WebSocket em tempo real
io.on('connection', (socket) => {
  console.log(`🔌 Cliente WebSocket conectado: ${socket.id}`);

  socket.on('join_conversation', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`👥 Cliente ${socket.id} sincronizado na conversa ${conversationId}`);
  });

  socket.on('send_message', (data: any) => {
    io.to(data.conversationId).emit('receive_message', data);
  });

  socket.on('escrow_update', (data: any) => {
    io.to(data.conversationId).emit('escrow_updated', data);
  });

  socket.on('score_update', (data: any) => {
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
app.use('/api/v1', routes);

// Diretório estático do front-end extraído
const appDir = path.resolve(__dirname, '../../app');
app.use(express.static(appDir));

// Fallback SPA para TanStack Router (rotas como /login, /jobs, /home, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(appDir, 'index.html'));
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

export { app, server, io };
export default server;
