import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { JobController } from '../controllers/jobController';
import { WalletController } from '../controllers/walletController';
import { ScoreController } from '../controllers/scoreController';
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

export default router;
