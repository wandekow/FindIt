# FindIt — Sistema de Achados e Perdidos

Projeto individual desenvolvido para a disciplina **Programação para WEB II**, sob responsabilidade de **Wanderley da Silva**. O sistema permite registrar objetos encontrados, acompanhar a devolução e manter os dados no navegador.

## Requisitos

- Node.js 18.19 ou superior (recomendado Node.js 20+)
- npm 9 ou superior
- Navegador moderno com suporte a `localStorage`

## Instalação e execução

```bash
npm install
npm start
```

Acesse [http://localhost:4200](http://localhost:4200). O servidor de desenvolvimento recarrega automaticamente após alterações.

## Comandos

```bash
npm start                              # inicia o servidor local
npm run build                          # gera o build de produção em dist/findit
NG_CLI_ANALYTICS=false npm test        # executa os testes unitários
```

Em ambientes Linux nos quais o Chromium não esteja no PATH, informe o executável ao Karma:

```bash
CHROME_BIN=/usr/bin/chromium NG_CLI_ANALYTICS=false npm test
```

## Funcionalidades

- Cadastro de objetos com descrição, categoria, local, data, responsável, contato e situação.
- ID numérico gerado automaticamente, sem repetição.
- Listagem organizada com situação visual e textual.
- Consulta de detalhes em modal.
- Edição e exclusão com confirmação.
- Alternância rápida entre “Aguardando retirada” e “Devolvido”.
- Pesquisa por descrição, categoria, local, responsável ou contato.
- Filtros por todos, pendentes e devolvidos.
- Resumo com total, aguardando retirada e já devolvidos.
- Persistência encapsulada no serviço `ObjetoPerdidoService`, usando `localStorage`.
- Layout responsivo para desktop e celular, com validação dos campos obrigatórios.

## Organização

- `src/app/model/objeto-perdido.model.ts`: interface `ObjetoPerdido` conforme o enunciado.
- `src/app/services/objeto-perdido.service.ts`: leitura, gravação, atualização e remoção no `localStorage`.
- `src/app/app.component.ts`: regras de apresentação, formulário, filtros e ações.
- `src/app/app.component.html` e `.css`: interface do sistema.
- `src/app/**/*.spec.ts`: testes unitários do serviço e do componente.

Os dados ficam somente no armazenamento local do navegador e podem ser limpos pelas ferramentas de desenvolvedor. A aplicação não usa backend, credenciais, dados pessoais reais ou serviços pagos.
