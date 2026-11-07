# Apresentação — FindIt

## Objetivo

O FindIt é um sistema web de achados e perdidos criado para registrar objetos encontrados e apoiar o acompanhamento de sua devolução. A solução foi desenvolvida exclusivamente para o projeto nº 6 da disciplina Programação para WEB II.

## Como funciona

Na tela inicial, a equipe visualiza um resumo dos registros, com total de objetos, itens aguardando retirada e objetos já devolvidos. O cadastro solicita descrição, categoria, local e data em que o item foi encontrado, além do responsável, meio de contato e situação de devolução.

Os registros aparecem em cartões organizados. É possível pesquisar por texto em descrição, categoria, local, responsável ou contato; filtrar por situação; abrir os detalhes completos; editar qualquer informação; excluir com confirmação; e alternar rapidamente a situação entre “Aguardando retirada” e “Devolvido”.

## Tecnologias

- Angular 18 em arquitetura standalone.
- TypeScript com a interface `ObjetoPerdido` do enunciado.
- Reactive Forms para validação dos campos obrigatórios.
- Serviço Angular dedicado à persistência em `localStorage`.
- HTML semântico, CSS responsivo e interface em português do Brasil.

## Destaques da solução

A aplicação mantém separadas as responsabilidades da interface e do armazenamento, gera o ID automaticamente, preserva o tipo booleano da propriedade `devolvido` e funciona sem backend ou credenciais externas. O layout adapta-se a telas grandes e pequenas, e o estado é comunicado por texto e ícones, não apenas por cor.
