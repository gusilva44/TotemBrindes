# API do Totem

## Segurança configurada

- `POST /auth/cadastro` valida e normaliza os dados do cadastro e retorna um JWT de sessão.
- `POST /pedidos` exige `Authorization: Bearer <token>` e aceita somente `produtoId`; os demais dados vêm do token assinado.
- `GET /pedidos/:id` exige o mesmo token e só devolve o pedido do próprio cliente.
- As rotas de listagem e conclusão são administrativas e exigem o cabeçalho `X-Admin-Key` com `ADMIN_API_KEY`.
- A criação é transacional e há índices únicos normalizados por e-mail e telefone, impedindo dois pedidos para o mesmo cadastro.

Antes de implantar, defina `JWT_SECRET` e `ADMIN_API_KEY` com chaves aleatórias longas e ajuste `CORS_ORIGIN`. Use o arquivo `.env.example` como referência, sem versionar o `.env` real.

Para bancos já existentes, aplique os dois índices do arquivo `.sql`. Caso existam pedidos duplicados antigos, resolva-os antes da criação dos índices.
