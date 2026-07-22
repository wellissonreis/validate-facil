# Validade Fácil

Aplicativo mobile para controle de produtos, lotes, movimentações de estoque e datas de validade em pequenos comércios.

## Sobre o projeto

O Validade Fácil busca simplificar o acompanhamento de produtos perecíveis. A aplicação permite registrar produtos e lotes, consultar saldos e identificar itens vencidos ou próximos do vencimento sem depender de planilhas ou controles dispersos.

Este repositório contém atualmente o aplicativo cliente. Os dados são persistidos localmente no dispositivo com AsyncStorage; a integração com um backend está em desenvolvimento.

## Problema de negócio

Pequenos comércios podem enfrentar:

- perdas financeiras causadas por produtos vencidos;
- dificuldade para acompanhar manualmente diferentes lotes e validades;
- falta de uma visão centralizada dos itens vencidos ou próximos do vencimento;
- lentidão no registro de entradas e saídas de estoque.

O projeto concentra essas informações em um fluxo mobile com leitura de código de barras e consultas rápidas.

## Estado atual do projeto

### Implementado

- cadastro, edição, consulta e exclusão lógica de produtos;
- controle de produtos perecíveis e não perecíveis;
- registro de lotes, quantidades e datas de validade;
- entrada de estoque por produto e lote;
- saída de estoque com validação de saldo disponível;
- leitura de código de barras com a câmera;
- busca por nome ou código de barras;
- listagem de produtos vencidos e com vencimento em 7 ou 15 dias;
- identificação de estoque baixo;
- dashboard com indicadores locais;
- histórico de movimentações;
- posição de estoque e comparação entre entradas e saídas;
- associação de imagem ao produto pela câmera ou galeria;
- persistência local com AsyncStorage.

### Parcialmente implementado

- a tela de login e a navegação de autenticação existem, mas não há autenticação real comprovada neste repositório;
- as telas de relatórios e opções adicionais ainda fazem parte da evolução do produto.

### Planejado

- integração do aplicativo com backend e banco de dados remoto;
- autenticação e gerenciamento de usuários;
- sincronização dos dados entre dispositivos;
- testes automatizados.

## Funcionalidades

### Produtos e lotes

O cadastro reúne código de barras, nome, quantidade, validade e lote opcional. Novas entradas podem ser vinculadas a um produto existente, e o detalhe do produto apresenta seus lotes e movimentações.

### Entrada e saída de estoque

A entrada rápida localiza o produto pelo código de barras ou cria um novo cadastro. As saídas validam o saldo disponível e, quando existem lotes, distribuem a baixa priorizando as validades mais próximas.

### Validade e indicadores

O aplicativo calcula localmente produtos vencidos, itens que vencem em 7 ou 15 dias e produtos com estoque baixo. Esses dados alimentam o resumo da tela inicial e as listagens específicas.

### Histórico e posição de estoque

As movimentações registram entradas, saídas, ajustes e remoções por vencimento. A aplicação também apresenta posição por produto e lote, além de comparação entre entradas, saídas e saldo atual.

## Tecnologias

- React Native 0.85
- Expo SDK 56
- TypeScript
- React Navigation
- Expo Camera
- Expo Image e Expo Image Picker
- AsyncStorage
- ESLint

## Arquitetura e estrutura

O código é organizado por funcionalidades, com recursos compartilhados separados da navegação e da inicialização da aplicação:

```text
validate-facil/
├── App.tsx                         # Composição inicial do aplicativo
├── index.ts                        # Registro do componente raiz no Expo
├── src/
│   ├── app/                        # Rotas complementares
│   ├── assets/                     # Ícones e imagens
│   ├── features/                   # Telas, componentes e estilos por funcionalidade
│   ├── navigation/                 # Navegadores, rotas e tipos
│   └── shared/
│       ├── media/                  # Seleção e persistência de imagens
│       └── storage/                # Estado local, projeções e movimentações
├── app.json                        # Configuração do Expo
├── package.json                    # Dependências e scripts
└── tsconfig.json                   # Configuração do TypeScript
```

O módulo `src/shared/storage/products.ts` mantém o estado de inventário local, registra movimentações e calcula as projeções de saldo utilizadas pelas telas.

## Como executar

### Pré-requisitos

- Node.js compatível com o Expo SDK 56;
- npm;
- Android Studio, Xcode ou um dispositivo compatível com Expo, conforme a plataforma escolhida.

### Instalação

```bash
git clone https://github.com/wellissonreis/validate-facil.git
cd validate-facil
npm install
```

### Iniciar o projeto

```bash
npm start
```

Para executar comandos específicos por plataforma:

```bash
npm run android
npm run ios
npm run web
```

O uso da câmera e da galeria depende das permissões concedidas no dispositivo.

## Qualidade

Os comandos disponíveis no projeto são:

```bash
npm run lint
npm run typecheck
```

Ainda não foi identificada uma suíte de testes automatizados no repositório.

## Próximos passos

- implementar autenticação real;
- integrar o cliente a uma API;
- persistir e sincronizar dados em banco remoto;
- adicionar testes para regras de movimentação, lotes e validade;
- concluir os módulos de relatórios e configurações;
- documentar o fluxo de publicação do aplicativo.
