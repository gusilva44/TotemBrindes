-- Active: 1789471383031@@localhost@5432@learning
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS produtos;

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0,
    imagem VARCHAR(250) NOT NULL,
    CONSTRAINT chk_estoque CHECK (estoque >= 0)
); 

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    codigo_pedido VARCHAR(10) NOT NULL UNIQUE,
    codigo_retirada VARCHAR(4) NOT NULL UNIQUE,
    cliente VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    foi_aluno BOOLEAN NOT NULL,
    produto_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    concluido_em TIMESTAMP NULL,

    CONSTRAINT fk_pedido_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id),

    CONSTRAINT chk_status
        CHECK (status IN ('pendente', 'concluido'))
);

-- 4. Criação dos índices únicos com funções
CREATE UNIQUE INDEX pedidos_email_normalizado_unico
    ON pedidos (LOWER(email));

CREATE UNIQUE INDEX pedidos_telefone_normalizado_unico
    ON pedidos (
        REGEXP_REPLACE(
            telefone,
            '\D',
            '',
            'g'
        )
    );

-- 5. Inserção dos dados com os caminhos relativos das imagens
INSERT INTO produtos (
    id,
    nome,
    descricao,
    estoque,
    imagem
)
VALUES
(
    1,
    'Chaveiro GitHub',
    'Chaveiro da plataforma de tecnologia GitHub',
    2,
    '/imgs/git.png'
),
(
    2,
    'Imã de Geladeira',
    'Imã de geladeira personalizado com estética de notebook',
    2,
    '/imgs/ima.png'
),
(
    3,
    'Cartela de Figurinhas Software',
    'Cartela de figurinhas com a temática de software',
    2,
    '/imgs/figs-s.png'
),
(
    4,
    'Cartela de Figurinhas Hardware',
    'Cartela de figurinhas com a temática de hardware',
    2,
    '/imgs/figs-h.png'
);

-- 6. Atualiza o contador da sequência SERIAL para evitar conflitos em novos INSERTs
SELECT setval(pg_get_serial_sequence('produtos', 'id'), COALESCE(MAX(id), 1)) FROM produtos;

-- 7. Consultas finais para verificação
SELECT * FROM produtos;
SELECT * FROM pedidos;

DROP TABLE produtos;