CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0,
    imagem VARCHAR(250) NOT NULL,

    CONSTRAINT chk_estoque
        CHECK (estoque >= 0)
);

CREATE TABLE IF NOT EXISTS pedidos (
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

CREATE UNIQUE INDEX IF NOT EXISTS pedidos_email_normalizado_unico
    ON pedidos (LOWER(email));

CREATE UNIQUE INDEX IF NOT EXISTS pedidos_telefone_normalizado_unico
    ON pedidos (REGEXP_REPLACE(telefone, '\D', '', 'g'));

CREATE INDEX IF NOT EXISTS pedidos_status_idx
    ON pedidos (status);

CREATE INDEX IF NOT EXISTS pedidos_produto_id_idx
    ON pedidos (produto_id);

INSERT INTO produtos (nome, descricao, estoque, imagem)
SELECT nome, descricao, estoque, imagem
FROM (
    VALUES
        ('Chaveiro GitHub', 'Chaveiro da plataforma de tecnologia GitHub', 2, '/imgs/git.png'),
        ('Imã de Geladeira', 'Imã de geladeira personalizado com estética de notebook', 2, '/imgs/ima.png'),
        ('Cartela de Figurinhas Software', 'Cartela de figurinhas com a temática de software', 2, '/imgs/figs-s.png'),
        ('Cartela de Figurinhas Hardware', 'Cartela de figurinhas com a temática de hardware', 2, '/imgs/figs-h.png')
) AS novos (nome, descricao, estoque, imagem)
WHERE NOT EXISTS (SELECT 1 FROM produtos);
