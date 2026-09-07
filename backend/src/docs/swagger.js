import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Token API',
            version: '1.0.0',
            description: 'Documentação da API do sistema de pedidos e avaliações.'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],

        tags: [
            {
                name: 'Health',
                description: 'Verificação da API'
            },
            {
                name: 'Pedidos',
                description: 'Operações relacionadas aos pedidos'
            },
            {
                name: 'Avaliações',
                description: 'Operações relacionadas às avaliações'
            }
        ],

        components: {
            schemas: {
                Pedido: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        pedido: {
                            type: 'string',
                            example: 'Kit 01'
                        },
                        cliente: {
                            type: 'string',
                            example: 'Gustavo Silva'
                        },
                        email: {
                            type: 'string',
                            example: 'gustavo@email.com'
                        },
                        telefone: {
                            type: 'string',
                            example: '11999999999'
                        },
                        sexualidade: {
                            type: 'string',
                            example: 'Prefiro não informar'
                        },
                        foi_aluno: {
                            type: 'boolean',
                            example: true
                        },
                        status: {
                            type: 'string',
                            enum: ['pendente', 'concluido'],
                            example: 'pendente'
                        }
                    }
                },

                Avaliacao: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        cliente: {
                            type: 'string',
                            example: 'Gustavo Silva'
                        },
                        avaliacao: {
                            type: 'number',
                            example: 5
                        }
                    }
                },

                Erro: {
                    type: 'object',
                    properties: {
                        erro: {
                            type: 'string',
                            example: 'Pedido não encontrado.'
                        }
                    }
                }
            }
        }
    },

    apis: ['./docs/schemas/routes.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
