"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const jobController_1 = require("../controllers/jobController");
const walletController_1 = require("../controllers/walletController");
const scoreController_1 = require("../controllers/scoreController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// 1. ROTAS DE AUTENTICAÇÃO
router.post('/auth/register', authController_1.AuthController.register);
router.post('/auth/login', authController_1.AuthController.login);
router.get('/auth/me', auth_1.authMiddleware, authController_1.AuthController.me);
// 2. ROTAS DE VAGAS & EXPRESS
router.get('/jobs', jobController_1.JobController.listJobs);
router.post('/jobs', auth_1.authMiddleware, jobController_1.JobController.createJob);
router.post('/jobs/express', auth_1.authMiddleware, jobController_1.JobController.createExpressJob);
// 3. ROTAS DE CARTEIRA & PIX & CUSTÓDIA
router.get('/wallet', auth_1.authMiddleware, walletController_1.WalletController.getWallet);
router.post('/wallet/deposit-pix', auth_1.authMiddleware, walletController_1.WalletController.gerarDepositoPix);
router.post('/wallet/escrow/create', auth_1.authMiddleware, walletController_1.WalletController.contratarComCustodia);
router.post('/wallet/escrow/release', auth_1.authMiddleware, walletController_1.WalletController.liberarPagamento);
// 4. ROTAS DE SCORE & REPUTAÇÃO
router.get('/score', auth_1.authMiddleware, scoreController_1.ScoreController.getScore);
exports.default = router;
