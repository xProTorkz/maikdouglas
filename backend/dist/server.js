"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
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
// Rotas da API
app.use('/api/v1', routes_1.default);
// Middleware 404
app.use((req, res) => {
    res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});
app.listen(PORT, () => {
    console.log('==================================================');
    console.log(`🚀 WORKLY BACKEND OPERACIONAL NA PORTA ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/health`);
    console.log(`🔌 Endpoints: http://localhost:${PORT}/api/v1/jobs`);
    console.log('==================================================');
});
exports.default = app;
