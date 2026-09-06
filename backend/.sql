CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,

    codigo_pedido VARCHAR(10) NOT NULL UNIQUE,
    codigo_retirada VARCHAR(4) NOT NULL UNIQUE,

    cliente VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,

    sexualidade VARCHAR(50) NOT NULL,
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

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    imagem TEXT NOT NULL
);

INSERT INTO produtos (id, nome, descricao, imagem)
VALUES
(
    1,
    'Chaveiro GitHub',
    'Chaveiro da plataforma de tecnologia GitHub',
    'https://www.chaveirosecanetas.com.br/image/cache/data/Metalicos/prof-ciencia-da-comp-500x500.jpg'
),
(
    2,
    'Imã de Geladeira',
    'Imã de geladeira personalizado com estética de notebook',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT15Ex-ktLyO0N8FolGwiOkiiz_1EYzy35eW22vIHHvgg&s'
),
(
    3,
    'Cartela de Figurinhas Software',
    'Cartela de figurinhas com a temática de software',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrNDV8RvKMFm3BYWtlmI2ADCKWXHVAQonbkhQTXimOkvND6r0FVTiTnq0m&s=10'
),
(
    4,
    'Cartela de Figurinhas Hardware',
    'Cartela de figurinhas com a temática de hardware',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrNDV8RvKMFm3BYWtlmI2ADCKWXHVAQonbkhQTXimOkvND6r0FVTiTnq0m&s=10'
);

