import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Workly API Core',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rotas da API REST
app.use('/api/v1', routes);

// Diretório estático do front-end extraído
const appDir = path.resolve(__dirname, '../../app');
app.use(express.static(appDir));

// Fallback SPA para TanStack Router (todas as rotas como /login, /jobs, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(appDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 WORKLY SUPERAPP FULLSTACK NA PORTA ${PORT}`);
  console.log(`📡 Healthcheck API: http://localhost:${PORT}/health`);
  console.log(`🔌 Endpoints API:  http://localhost:${PORT}/api/v1/jobs`);
  console.log(`💻 Interface Web:  http://localhost:${PORT}/login`);
  console.log('==================================================');
});

export default app;
