import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'workly-secret-key-2026';

// Memória operacional com contas demonstrativas oficiais
export const mockUsers: any[] = [
  {
    id: 'user-001-prof',
    nome: 'Lucas Vinícius',
    email: 'lucas@workly.com',
    senhaHash: bcrypt.hashSync('123456', 8),
    telefone: '11999887766',
    role: 'profissional',
    tipoPessoa: 'pf',
    profissao: 'Especialista Elétrica & Full-Stack',
    cidade: 'São Paulo',
    estado: 'SP',
    worklyScore: 885,
    scoreTier: 'ouro',
    verificado: true,
    eliteMember: true,
    avatar: '🧑‍💻'
  },
  {
    id: 'user-lara-nubank',
    nome: 'Lara — RH Nubank',
    email: 'lara@nubank.com.br',
    senhaHash: bcrypt.hashSync('123456', 8),
    telefone: '11988776655',
    role: 'empresa',
    tipoPessoa: 'pj',
    profissao: 'Recrutadora & Gestora de Facilities',
    cidade: 'São Paulo',
    estado: 'SP',
    worklyScore: 940,
    scoreTier: 'diamante',
    verificado: true,
    eliteMember: true,
    avatar: '💼'
  },
  {
    id: 'user-carlos-contratante',
    nome: 'Carlos Mendes',
    email: 'carlos@gmail.com',
    senhaHash: bcrypt.hashSync('123456', 8),
    telefone: '11977665544',
    role: 'contratante',
    tipoPessoa: 'pf',
    profissao: 'Contratante Residencial',
    cidade: 'Campinas',
    estado: 'SP',
    worklyScore: 780,
    scoreTier: 'prata',
    verificado: true,
    eliteMember: false,
    avatar: '🏢'
  }
];

export class AuthController {
  public static async register(req: Request, res: Response) {
    const { nome, email, senha, telefone, role, tipoPessoa, profissao, cidade, estado } = req.body;

    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const newUser = {
      id: uuidv4(),
      nome,
      email,
      senhaHash: bcrypt.hashSync(senha, 8),
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

    mockUsers.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { senhaHash, ...userClean } = newUser;
    return res.status(201).json({ user: userClean, token });
  }

  public static async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const user = mockUsers.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(senha, user.senhaHash)) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { senhaHash, ...userClean } = user;
    return res.json({ user: userClean, token });
  }

  public static async me(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
    const user = mockUsers.find(u => u.id === req.user?.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const { senhaHash, ...userClean } = user;
    return res.json({ user: userClean });
  }
}
