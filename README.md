
# MapaFácil Market – Servidor Local (Node + Express)

Servidor local simples com **Admin** e **Totem**, upload de mapa, cadastro de produtos e posicionamento por clique. Persistência em arquivos JSON.

## Requisitos
- Node.js instalado (v16+). Você usa Windows? Rode com o `.bat` incluso.

## Como rodar
1. Extraia a pasta `mapafacil-market-local`.
2. Abra o Prompt/PowerShell dentro da pasta.
3. Instale as dependências:
   ```
   npm install
   ```
4. Inicie o servidor na porta **4000**:
   ```
   npm start
   ```
5. Acesse:
   - Admin: **http://localhost:4000/admin**
   - Totem: **http://localhost:4000/totem**

## Uso rápido
- Em **/admin**:
  - Faça **upload do mapa** (imagem da planta/loja) – vai para `/uploads/map.png` e é salvo no `data/config.json`.
  - Cadastre produtos e clique **“Posicionar”** → clique no mapa para gravar as coordenadas (%).
  - Clique em **Totem/Entrada** para posicionar onde o cliente está.
- Em **/totem**:
  - Busque por nome/categoria/corredor.
  - Clique **“ver no mapa”** para ver pino + linha tracejada + animação até o produto.

## Estrutura
```
mapafacil-market-local/
  data/
    products.json   # catálogo (auto-criado)
    config.json     # mapa e posição do totem (auto-criado)
  uploads/
    map.png         # imagem do mapa enviada via Admin
  public/
    admin.html
    totem.html
    css/style.css
    js/utils.js
  server.js
  package.json
  start_localhost4000.bat
  README.md
```

## Observações
- É um **MVP local**: não há autenticação. Para produção, recomendo Supabase/PostgreSQL e ACL.
- O caminho é **reta** da entrada ao produto (waypoints podem ser adicionados depois para contornar corredores).
- Os dados ficam nos arquivos `data/*.json`.

Qualquer ajuste que você quiser (tema Dazul/Saron, PWA, QR code, multi-loja), eu preparo.
