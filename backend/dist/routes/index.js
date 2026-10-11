"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const jobController_1 = require("../controllers/jobController");
const walletController_1 = require("../controllers/walletController");
const scoreController_1 = require("../controllers/scoreController");
const chatController_1 = require("../controllers/chatController");
const submenuController_1 = require("../controllers/submenuController");
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
router.get('/score/breakdown', submenuController_1.SubmenuController.getScoreBreakdown);
// 5. ROTAS DE CHAT & MENSAGENS EM TEMPO REAL
router.get('/conversations', chatController_1.ChatController.listConversations);
router.get('/conversations/:id/messages', chatController_1.ChatController.getMessages);
router.post('/conversations/:id/messages', chatController_1.ChatController.sendMessage);
router.post('/conversations/:id/release-escrow', chatController_1.ChatController.releaseEscrow);
// 6. ROTAS DE SUBMENUS, PAGAMENTOS IN-APP & SUPORTE WEX AI
router.get('/proposals', submenuController_1.SubmenuController.listProposals);
router.get('/wallet/statement', submenuController_1.SubmenuController.getWalletStatement);
router.post('/wallet/withdraw', submenuController_1.SubmenuController.requestWithdraw);
router.post('/wallet/escrow/generate-pix', submenuController_1.SubmenuController.generateEscrowPix);
router.post('/wallet/escrow/simulate-payment', submenuController_1.SubmenuController.simulatePixPayment);
router.post('/wallet/escrow/validate-code', submenuController_1.SubmenuController.validateEscrowCode);
router.post('/support/chat', submenuController_1.SubmenuController.chatWithWex);
// 7. ROTAS DE CONTATO E INÍCIO DE CONVERSA REAL
router.get('/jobs/:id/contact', jobController_1.JobController.getContact);
router.post('/conversations/start', chatController_1.ChatController.startConversation);
// 8. ROTAS DE PLANOS & ASSINATURA PUSHIN PAY (DESBLOQUEIO DE CONTATOS)
const planController_1 = require("../controllers/planController");
router.post('/plans/subscribe', planController_1.PlanController.subscribe);
router.get('/plans/check-payment/:transacaoId', planController_1.PlanController.checkPayment);
router.get('/plans/status/:userId', planController_1.PlanController.getPlanStatus);
router.post('/plans/activate-manual', planController_1.PlanController.activateManual);
exports.default = router;
