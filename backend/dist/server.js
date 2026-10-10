"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.use('/api/v1', routes_1.default);
// Diretório estático do front-end extraído
const appDir = path_1.default.resolve(__dirname, '../../app');
app.use(express_1.default.static(appDir));
// Fallback SPA para TanStack Router (todas as rotas como /login, /jobs, etc.)
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(appDir, 'index.html'));
});
app.listen(PORT, () => {
    console.log('==================================================');
    console.log(`🚀 WORKLY SUPERAPP FULLSTACK NA PORTA ${PORT}`);
    console.log(`📡 Healthcheck API: http://localhost:${PORT}/health`);
    console.log(`🔌 Endpoints API:  http://localhost:${PORT}/api/v1/jobs`);
    console.log(`💻 Interface Web:  http://localhost:${PORT}/login`);
    console.log('==================================================');
});
exports.default = app;
