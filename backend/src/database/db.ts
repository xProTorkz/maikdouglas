import dotenv from 'dotenv';
dotenv.config();

export interface DbConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
}

/**
 * Retorna a configuração de banco de dados para conexão com PostgreSQL ou Supabase.
 * Pode ser consumida por pg.Pool, Prisma, Drizzle ou TypeORM.
 */
export const getDbConfig = (): DbConfig => {
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

export const isDbConfigured = (): boolean => {
  return !!process.env.DATABASE_URL;
};
