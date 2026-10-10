"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDbConfigured = exports.getDbConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Retorna a configuração de banco de dados para conexão com PostgreSQL ou Supabase.
 * Pode ser consumida por pg.Pool, Prisma, Drizzle ou TypeORM.
 */
const getDbConfig = () => {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
        return {
            connectionString,
            ssl: process.env.NODE_ENV === 'production' ? true : false
        };
    }
    return {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'workly',
        ssl: false
    };
};
exports.getDbConfig = getDbConfig;
const isDbConfigured = () => {
    return !!process.env.DATABASE_URL;
};
exports.isDbConfigured = isDbConfigured;
