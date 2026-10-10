-- =============================================================================
-- ESQUEMA RELACIONAL POSTGRESQL / SUPABASE — WORKLY BRASIL
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TIPOS ENUMERADOS
CREATE TYPE user_role AS ENUM ('profissional', 'contratante', 'empresa', 'admin');
CREATE TYPE person_type AS ENUM ('pf', 'pj');
CREATE TYPE score_tier AS ENUM ('bronze', 'prata', 'ouro', 'diamante');
CREATE TYPE job_mode AS ENUM ('padrao', 'express');
CREATE TYPE job_urgency AS ENUM ('baixa', 'media', 'alta', 'imediata');
CREATE TYPE job_status AS ENUM ('aberto', 'em_andamento', 'concluido', 'cancelado');
CREATE TYPE contract_status AS ENUM (
    'aguardando_pagamento',
    'em_custodia',
    'em_execucao',
    'concluido_aguardando_aprovacao',
    'liberado',
    'em_disputa',
    'reembolsado'
);
CREATE TYPE transaction_type AS ENUM (
    'deposito_pix',
    'bloqueio_custodia',
    'liberacao_prestador',
    'taxa_express',
    'assinatura_verified',
    'saque_pix'
);
CREATE TYPE transaction_status AS ENUM ('pendente', 'concluido', 'falhou', 'estornado');

-- 2. TABELA DE USUÁRIOS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    cpf_cnpj VARCHAR(30) UNIQUE,
    role user_role NOT NULL DEFAULT 'profissional',
    tipo_pessoa person_type NOT NULL DEFAULT 'pf',
    avatar_url TEXT,
    bio TEXT,
    profissao_principal VARCHAR(150),
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Métricas de Reputação
    workly_score INTEGER NOT NULL DEFAULT 400,
    score_tier score_tier NOT NULL DEFAULT 'bronze',
    verificado BOOLEAN NOT NULL DEFAULT FALSE,
    elite_member BOOLEAN NOT NULL DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIAS DE SERVIÇOS
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icone VARCHAR(50),
    descricao TEXT,
    ordem_destaque INTEGER DEFAULT 0
);

-- 4. VAGAS E DEMANDAS DE SERVIÇOS (JOBS)
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contratante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    categoria_id UUID NOT NULL REFERENCES categories(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    orcamento_estimado DECIMAL(10, 2) NOT NULL,
    modalidade job_mode NOT NULL DEFAULT 'padrao',
    urgencia job_urgency NOT NULL DEFAULT 'media',
    status job_status NOT NULL DEFAULT 'aberto',
    
    -- Localização
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    bairro VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Taxa Express (se aplicável)
    taxa_express_paga DECIMAL(10, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PROPOSTAS / CANDIDATURAS
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    prestador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    valor_proposto DECIMAL(10, 2) NOT NULL,
    prazo_estimado_horas INTEGER,
    mensagem TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente', -- pendente, aceita, recusada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CONTRATOS & CUSTÓDIA DE PAGAMENTO (ESCROW ANTI-FRAUDE)
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    proposal_id UUID REFERENCES proposals(id),
    contratante_id UUID NOT NULL REFERENCES users(id),
    prestador_id UUID NOT NULL REFERENCES users(id),
    
    valor_bruto DECIMAL(10, 2) NOT NULL,
    taxa_plataforma_percentual DECIMAL(5, 2) NOT NULL DEFAULT 12.00,
    valor_taxa_plataforma DECIMAL(10, 2) NOT NULL,
    fundo_garantia_taxa DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    valor_liquido_prestador DECIMAL(10, 2) NOT NULL,
    
    status contract_status NOT NULL DEFAULT 'aguardando_pagamento',
    
    codigo_seguranca_conclusao VARCHAR(10), -- Código fornecido pelo cliente para o prestador liberar o serviço
    iniciado_em TIMESTAMP WITH TIME ZONE,
    concluido_em TIMESTAMP WITH TIME ZONE,
    liberado_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CARTEIRAS DIGITAIS (WORKLY PAY)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    saldo_disponivel DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    saldo_em_custodia DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    chave_pix VARCHAR(150),
    tipo_chave_pix VARCHAR(30), -- cpf, email, telefone, aleatoria
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TRANSAÇÕES FINANCEIRAS & PIX
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    contract_id UUID REFERENCES contracts(id),
    tipo transaction_type NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pendente',
    
    -- Integração Gateway Pix (Asaas / Mercado Pago)
    id_gateway_externo VARCHAR(255),
    pix_qr_code TEXT,
    pix_copia_cola TEXT,
    pix_expiracao TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pago_em TIMESTAMP WITH TIME ZONE
);

-- 9. AVALIAÇÕES & CÁLCULO DE REPUTAÇÃO (WORKLY SCORE)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    avaliador_id UUID NOT NULL REFERENCES users(id),
    avaliado_id UUID NOT NULL REFERENCES users(id),
    
    nota_geral INTEGER CHECK (nota_geral BETWEEN 1 AND 5) NOT NULL,
    pontualidade_nota INTEGER CHECK (pontualidade_nota BETWEEN 1 AND 5) NOT NULL,
    qualidade_nota INTEGER CHECK (qualidade_nota BETWEEN 1 AND 5) NOT NULL,
    comentario TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES DE PERFORMANCE
CREATE INDEX idx_jobs_status_urgencia ON jobs(status, urgencia);
CREATE INDEX idx_jobs_cidade ON jobs(cidade, estado);
CREATE INDEX idx_users_score ON users(workly_score DESC);
CREATE INDEX idx_contracts_status ON contracts(status);
