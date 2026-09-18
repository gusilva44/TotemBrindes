-- Active: 1789471383031@@db.guarnz.com@5432@learning@public
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS produtos;

select * from pedidos;

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    descricao TEXT NOT NULL,

    estoque INTEGER NOT NULL DEFAULT 0,

    imagem TEXT NOT NULL,

    CONSTRAINT chk_estoque
        CHECK (estoque >= 0)
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
    2
),
(
    2,
    'Imã de Geladeira',
    'Imã de geladeira personalizado com estética de notebook',
    2
),
(
    3,
    'Cartela de Figurinhas Software',
    'Cartela de figurinhas com a temática de software',
    2
),
(
    4,
    'Cartela de Figurinhas Hardware',
    'Cartela de figurinhas com a temática de hardware',
    2
);

SELECT * FROM produtos;

SELECT * FROM pedidos;

ALTER TABLE produtos
ADD COLUMN imagem varchar(250) not null;