-- =====================================================
-- AZTECA_OS - Schema PostgreSQL Completo
-- Data: 12/12/2025 - VERSÃO CORRIGIDA
-- =====================================================
-- COMO USAR:
-- 1. Crie o banco: createdb azteca_os
-- 2. Cole TODO este conteúdo na Query Tool do pgAdmin
-- 3. Execute
-- =====================================================

-- =====================================================
-- 1. TABELA: usuarios
-- =====================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. TABELA: clientes
-- =====================================================
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    email VARCHAR(150),
    informacao_adicional TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. TABELA: tipos_objeto
-- =====================================================
CREATE TABLE tipos_objeto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. TABELA: servicos
-- =====================================================
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) UNIQUE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. TABELA: ordens_servico
-- =====================================================
CREATE TABLE ordens_servico (
    id SERIAL PRIMARY KEY,
    numero SERIAL UNIQUE,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_entrega DATE NOT NULL,
    hora_entrega TIME,
    valor_total DECIMAL(10, 2) DEFAULT 0,
    valor_orcamento DECIMAL(10, 2) DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'ENTRADA' CHECK (estado IN ('ENTRADA', 'ORCAMENTO', 'EM_ANDAMENTO', 'CANCELADO', 'CONCLUIDO')),
    observacoes TEXT,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. TABELA: itens_ordem_servico
-- =====================================================
CREATE TABLE itens_ordem_servico (
    id SERIAL PRIMARY KEY,
    ordem_id INTEGER NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
    tipo_objeto_id INTEGER NOT NULL REFERENCES tipos_objeto(id),
    servico_id INTEGER NOT NULL REFERENCES servicos(id),
    quantidade INTEGER DEFAULT 1 CHECK (quantidade BETWEEN 1 AND 10),
    valor_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0,
    valor_total DECIMAL(10, 2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
    eh_orcamento BOOLEAN DEFAULT FALSE,
    estado VARCHAR(20) DEFAULT 'CADASTRADO' CHECK (estado IN ('CADASTRADO', 'EM_ANDAMENTO', 'CANCELADO', 'CONCLUIDO')),
    data_entrega DATE,
    hora_entrega TIME,
    foto_url VARCHAR(500),
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT itens_valor_unitario_check CHECK (
        (eh_orcamento = FALSE AND valor_unitario > 0) OR 
        (eh_orcamento = TRUE AND valor_unitario >= 0)
    )
);

-- =====================================================
-- TRIGGERS - AUTOMAÇÕES
-- =====================================================

-- TRIGGER 1: Preencher valor_unitario automaticamente do serviço
CREATE OR REPLACE FUNCTION itens_set_valor_unitario_from_servico()
RETURNS TRIGGER AS $$
BEGIN
    -- Se valor não foi informado (0 ou NULL), buscar do serviço
    IF NEW.valor_unitario IS NULL OR NEW.valor_unitario = 0 THEN
        SELECT valor INTO NEW.valor_unitario
        FROM servicos
        WHERE id = NEW.servico_id;
        
        IF NEW.valor_unitario IS NULL THEN
            RAISE EXCEPTION 'Serviço ID % não encontrado ou sem valor', NEW.servico_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_itens_set_valor_unitario
BEFORE INSERT OR UPDATE ON itens_ordem_servico
FOR EACH ROW
EXECUTE FUNCTION itens_set_valor_unitario_from_servico();

-- TRIGGER 2: Herdar data/hora da OS se não informado no item
CREATE OR REPLACE FUNCTION itens_default_data_entrega_from_ordem()
RETURNS TRIGGER AS $$
BEGIN
    -- Se data não informada, puxar da OS
    IF NEW.data_entrega IS NULL THEN
        SELECT data_entrega INTO NEW.data_entrega
        FROM ordens_servico
        WHERE id = NEW.ordem_id;
    END IF;
    
    -- Se hora não informada, puxar da OS
    IF NEW.hora_entrega IS NULL THEN
        SELECT hora_entrega INTO NEW.hora_entrega
        FROM ordens_servico
        WHERE id = NEW.ordem_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_itens_default_data_entrega
BEFORE INSERT ON itens_ordem_servico
FOR EACH ROW
EXECUTE FUNCTION itens_default_data_entrega_from_ordem();

-- TRIGGER 3: Recalcular totais da OS quando itens mudarem
CREATE OR REPLACE FUNCTION recompute_ordem_totais()
RETURNS TRIGGER AS $$
DECLARE
    sum_nao_orcamento NUMERIC(12,2);
    sum_orcamento NUMERIC(12,2);
    target_ordem INTEGER;
BEGIN
    -- Determinar qual OS recalcular
    IF (TG_OP = 'DELETE') THEN
        target_ordem := OLD.ordem_id;
    ELSE
        target_ordem := NEW.ordem_id;
    END IF;

    -- Somar itens NÃO orçamento (valor a cobrar)
    SELECT COALESCE(SUM(valor_total), 0) INTO sum_nao_orcamento
    FROM itens_ordem_servico
    WHERE ordem_id = target_ordem AND eh_orcamento = FALSE;

    -- Somar itens orçamento (apenas informativo)
    SELECT COALESCE(SUM(valor_total), 0) INTO sum_orcamento
    FROM itens_ordem_servico
    WHERE ordem_id = target_ordem AND eh_orcamento = TRUE;

    -- Atualizar OS
    UPDATE ordens_servico
    SET valor_total = sum_nao_orcamento,
        valor_orcamento = sum_orcamento,
        data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = target_ordem;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_itens_recompute_totals_ins
AFTER INSERT ON itens_ordem_servico
FOR EACH ROW
EXECUTE FUNCTION recompute_ordem_totais();

CREATE TRIGGER trg_itens_recompute_totals_upd
AFTER UPDATE ON itens_ordem_servico
FOR EACH ROW
EXECUTE FUNCTION recompute_ordem_totais();

CREATE TRIGGER trg_itens_recompute_totals_del
AFTER DELETE ON itens_ordem_servico
FOR EACH ROW
EXECUTE FUNCTION recompute_ordem_totais();

-- =====================================================
-- ÍNDICES - Performance
-- =====================================================

-- O.S. - Buscas frequentes
CREATE INDEX idx_os_numero ON ordens_servico(numero);
CREATE INDEX idx_os_estado ON ordens_servico(estado);
CREATE INDEX idx_os_cliente ON ordens_servico(cliente_id);
CREATE INDEX idx_os_usuario ON ordens_servico(usuario_id);
CREATE INDEX idx_os_entrega ON ordens_servico(data_entrega);
CREATE INDEX idx_os_usuario_estado ON ordens_servico(usuario_id, estado);
CREATE INDEX idx_os_entrega_estado ON ordens_servico(data_entrega, estado);

-- Items
CREATE INDEX idx_items_ordem ON itens_ordem_servico(ordem_id);
CREATE INDEX idx_items_servico ON itens_ordem_servico(servico_id);
CREATE INDEX idx_items_objeto ON itens_ordem_servico(tipo_objeto_id);
CREATE INDEX idx_items_estado ON itens_ordem_servico(estado);
CREATE INDEX idx_items_entrega ON itens_ordem_servico(data_entrega, hora_entrega);
CREATE INDEX idx_items_eh_orcamento ON itens_ordem_servico(eh_orcamento);

-- Clientes
CREATE INDEX idx_cliente_nome ON clientes(nome);
CREATE INDEX idx_cliente_telefone ON clientes(telefone);
CREATE INDEX idx_cliente_cpf ON clientes(cpf);

-- Serviços
CREATE INDEX idx_servico_nome ON servicos(nome);
CREATE INDEX idx_servico_ativo ON servicos(ativo);

-- =====================================================
-- DADOS INICIAIS - Usuários (4 funcionários)
-- =====================================================
INSERT INTO usuarios (nome, login, senha, ativo) VALUES
('Ariane', 'ariane', '$2b$12$W6e3j/nX8FgP8r8QXqC1pOYXZQJzQ9R2K5L6M7N8O9P0Q1R2S3T4U5V', true),
('Guilherme', 'guilherme', '$2b$12$W6e3j/nX8FgP8r8QXqC1pOYXZQJzQ9R2K5L6M7N8O9P0Q1R2S3T4U5V', true),
('Lucas', 'lucas', '$2b$12$W6e3j/nX8FgP8r8QXqC1pOYXZQJzQ9R2K5L6M7N8O9P0Q1R2S3T4U5V', true),
('Ricardo', 'ricardo', '$2b$12$W6e3j/nX8FgP8r8QXqC1pOYXZQJzQ9R2K5L6M7N8O9P0Q1R2S3T4U5V', true);

-- =====================================================
-- DADOS INICIAIS - Tipos de Objeto
-- =====================================================
INSERT INTO tipos_objeto (nome, descricao) VALUES
('Relógio de Pulso', 'Relógios de pulso em geral'),
('Relógio de Bolso', 'Relógios de bolso'),
('Anel Ouro', 'Anéis de ouro 18k/14k'),
('Anel Prata', 'Anéis de prata'),
('Pulseira', 'Pulseiras em geral'),
('Corrente', 'Correntes e correntes'),
('Brinco', 'Brincos diversos'),
('Colar', 'Colares'),
('Terço', 'Terços religiosos'),
('Tornozeleira', 'Tornozeleiras'),
('Pulseira Folheada', 'Pulseiras folheadas'),
('Corrente Folheada', 'Correntes folheadas');

-- =====================================================
-- DADOS INICIAIS - Serviços (com Preços)
-- =====================================================
INSERT INTO servicos (nome, valor, descricao, ativo) VALUES
('Bateria', 25.00, 'Bateria padrão', true),
('Bateria 395/371/394', 30.00, 'Bateria específica 395/371/394', true),
('Bateria 396/397', 32.00, 'Bateria específica 396/397', true),
('Vidro', 30.00, 'Vidro/Cristal para relógio', true),
('Vidro Safira', 50.00, 'Vidro de safira', true),
('Coroa', 45.00, 'Coroa/Coróglio do relógio', true),
('Fecho', 10.00, 'Fecho de correia/corrente', true),
('Borracha', 15.00, 'Correia de borracha', true),
('Colar Mostrador', 20.00, 'Colar do mostrador', true),
('Colar Número', 10.00, 'Colar do número', true),
('Diminuir Pulseira', 10.00, 'Ajustar/diminuir tamanho da pulseira', true),
('Fechar', 10.00, 'Fechar/Soldar peça', true),
('Limpar', 15.00, 'Limpeza geral', true),
('Polir', 25.00, 'Polimento da peça', true),
('Gravação', 30.00, 'Gravar texto ou imagem', true),
('Troca Pivot', 15.00, 'Troca de pivot', true),
('Troca Alavanca', 12.00, 'Troca de alavanca', true),
('Troca Espiral', 20.00, 'Troca de espiral', true),
('Regulagem', 15.00, 'Regulagem/Ajuste de relógio', true),
('Restauração', 100.00, 'Restauração completa', true),
('Conserto', 0.00, 'Conserto sem preço definido (orçamento)', true);

-- =====================================================
-- DADOS INICIAIS - Clientes (Exemplos)
-- =====================================================
INSERT INTO clientes (nome, telefone, cpf, email, informacao_adicional) VALUES
('Carlos Oliveira', '(11) 98765-4321', '12345678901', 'carlos@email.com', 'Cliente VIP'),
('Ana Souza', '(11) 99876-5432', '98765432100', 'ana@email.com', 'Alergias: níquel'),
('João Silva', '(21) 99876-5000', NULL, 'joao@email.com', NULL),
('Maria Santos', '(85) 98765-4567', NULL, NULL, 'Preferência: agendamento');

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
