"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.mockUsers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const JWT_SECRET = process.env.JWT_SECRET || 'workly-secret-key-2026';
// Memória operacional para execução imediata / sincronização com banco
exports.mockUsers = [
    {
        id: 'user-001-prof',
        nome: 'Rafael Lima',
        email: 'rafael@workly.com.br',
        senhaHash: bcryptjs_1.default.hashSync('123456', 8),
        telefone: '64999990001',
        role: 'profissional',
        tipoPessoa: 'pf',
        profissao: 'Desenvolvedor Full-Stack',
        cidade: 'Goiânia',
        estado: 'GO',
        worklyScore: 920,
        scoreTier: 'diamante',
        verificado: true,
        eliteMember: true
    },
    {
        id: 'user-002-empresa',
        nome: 'Construtech Engenharia',
        email: 'contato@construtech.com.br',
        senhaHash: bcryptjs_1.default.hashSync('123456', 8),
        telefone: '64999990002',
        role: 'empresa',
        tipoPessoa: 'pj',
        cidade: 'Goiânia',
        estado: 'GO',
        worklyScore: 850,
        scoreTier: 'ouro',
        verificado: true,
        eliteMember: false
    }
];
class AuthController {
    static async register(req, res) {
        const { nome, email, senha, telefone, role, tipoPessoa, profissao, cidade, estado } = req.body;
        if (!nome || !email || !senha || !telefone) {
            return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
        }
        const exists = exports.mockUsers.find(u => u.email === email);
        if (exists) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }
        const newUser = {
            id: (0, uuid_1.v4)(),
            nome,
            email,
            senhaHash: bcryptjs_1.default.hashSync(senha, 8),
            telefone,
            role: role || 'profissional',
            tipoPessoa: tipoPessoa || 'pf',
            profissao: profissao || 'Prestador Autônomo',
            cidade: cidade || 'Goiânia',
            estado: estado || 'GO',
            worklyScore: 400,
            scoreTier: 'bronze',
            verificado: false,
            eliteMember: false,
            createdAt: new Date()
        };
        exports.mockUsers.push(newUser);
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
        const { senhaHash, ...userClean } = newUser;
        return res.status(201).json({ user: userClean, token });
    }
    static async login(req, res) {
        const { email, senha } = req.body;
        const user = exports.mockUsers.find(u => u.email === email);
        if (!user || !bcryptjs_1.default.compareSync(senha, user.senhaHash)) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { senhaHash, ...userClean } = user;
        return res.json({ user: userClean, token });
    }
    static async me(req, res) {
        if (!req.user)
            return res.status(401).json({ error: 'Não autenticado' });
        const user = exports.mockUsers.find(u => u.id === req.user?.id);
        if (!user)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        const { senhaHash, ...userClean } = user;
        return res.json({ user: userClean });
    }
}
exports.AuthController = AuthController;
