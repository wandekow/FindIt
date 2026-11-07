# Relatório de validação — FindIt

**Projeto:** FindIt — Sistema de Achados e Perdidos  
**Disciplina:** Programação para WEB II  
**Aluno responsável:** Wanderley da Silva  
**Data da validação:** 06/11/2026

## Verificações realizadas

| Verificação | Resultado | Evidência |
|---|---|---|
| Instalação das dependências | Aprovada | `npm install` concluído |
| Build de produção | Aprovado | `npm run build` concluído sem erros; bundle em `dist/findit` |
| Geração automática de ID | Aprovada | Teste unitário do serviço |
| Persistência e listagem | Aprovada | Teste unitário do serviço |
| Alteração de devolução | Aprovada | Teste unitário do serviço |
| Atualização e remoção | Aprovada | Teste unitário do serviço |
| Criação e abertura do componente | Aprovada | Testes unitários do componente |
| Layout e fluxos principais | Verificados | Capturas de painel, cadastro e situação |
| Campos do modelo | Aprovados | `ObjetoPerdido` contém as oito propriedades exigidas |

Os testes automatizados foram executados com `CHROME_BIN=/usr/bin/chromium NG_CLI_ANALYTICS=false npm test`, apontando explicitamente para o Chromium disponível no ambiente. O build foi executado com `NG_CLI_ANALYTICS=false npm run build`.

## Cobertura funcional conferida

Foram conferidos cadastro com validação, listagem, consulta de detalhes, edição, exclusão com confirmação, alteração de devolução, pesquisa textual, filtros de situação, contadores do painel e permanência dos dados via `localStorage`. O ID não é exibido como campo editável e é gerado pelo serviço.

## Limitações conhecidas

A solução é deliberadamente local, conforme permitido no enunciado quando não há backend exigido. Assim, os dados ficam no navegador/dispositivo utilizado e não são compartilhados entre dispositivos. Não foram usados dados pessoais reais; exemplos de demonstração usam valores fictícios.

## Conclusão

A entrega atende ao escopo exclusivo do FindIt e não implementa os demais projetos mencionados no documento geral. O projeto está pronto para execução local conforme o README.
