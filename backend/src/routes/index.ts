import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { JobController } from '../controllers/jobController';
import { WalletController } from '../controllers/walletController';
import { ScoreController } from '../controllers/scoreController';
import { ChatController } from '../controllers/chatController';
import { SubmenuController } from '../controllers/submenuController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// 1. ROTAS DE AUTENTICAÇÃO
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', authMiddleware, AuthController.me);

// 2. ROTAS DE VAGAS & EXPRESS
router.get('/jobs', JobController.listJobs);
router.post('/jobs', authMiddleware, JobController.createJob);
router.post('/jobs/express', authMiddleware, JobController.createExpressJob);

// 3. ROTAS DE CARTEIRA & PIX & CUSTÓDIA
router.get('/wallet', authMiddleware, WalletController.getWallet);
router.post('/wallet/deposit-pix', authMiddleware, WalletController.gerarDepositoPix);
router.post('/wallet/escrow/create', authMiddleware, WalletController.contratarComCustodia);
router.post('/wallet/escrow/release', authMiddleware, WalletController.liberarPagamento);

// 4. ROTAS DE SCORE & REPUTAÇÃO
router.get('/score', authMiddleware, ScoreController.getScore);
router.get('/score/breakdown', SubmenuController.getScoreBreakdown);

// 5. ROTAS DE CHAT & MENSAGENS EM TEMPO REAL
router.get('/conversations', ChatController.listConversations);
router.get('/conversations/:id/messages', ChatController.getMessages);
router.post('/conversations/:id/messages', ChatController.sendMessage);
router.post('/conversations/:id/release-escrow', ChatController.releaseEscrow);

// 6. ROTAS DE SUBMENUS, PAGAMENTOS IN-APP & SUPORTE WEX AI
router.get('/proposals', SubmenuController.listProposals);
router.get('/wallet/statement', SubmenuController.getWalletStatement);
router.post('/wallet/withdraw', SubmenuController.requestWithdraw);
router.post('/wallet/escrow/generate-pix', SubmenuController.generateEscrowPix);
router.post('/wallet/escrow/simulate-payment', SubmenuController.simulatePixPayment);
router.post('/wallet/escrow/validate-code', SubmenuController.validateEscrowCode);
router.post('/support/chat', SubmenuController.chatWithWex);

export default router;
