# Validade Facil

Aplicacao multiplataforma para controle de validade, lotes e movimentacoes de estoque. O Validade Facil concentra rotinas operacionais de cadastro, consulta e acompanhamento de produtos em uma interface preparada para uso recorrente em dispositivos moveis.

Este repositorio contem o cliente do produto. A API responsavel por autenticacao, persistencia e regras transacionais esta no repositorio [`validade-facil-api`](https://github.com/wellissonreis/validade-facil-api).

## Visao do produto

O aplicativo foi estruturado para reduzir perdas por vencimento e melhorar a rastreabilidade do estoque. Os principais fluxos incluem:

- painel com indicadores de produtos vencidos, proximos do vencimento e com estoque baixo;
- cadastro e consulta de produtos por codigo de barras;
- controle de entradas, saidas, lotes e datas de validade;
- baixa de itens vencidos e historico de movimentacoes;
- comparacao entre saldo atual, entradas e saidas registradas;
- relatorios operacionais para acompanhamento do inventario;
- autenticacao e integracao com uma instalacao propria da API.

## Arquitetura do cliente

O codigo e organizado por funcionalidades, com separacao entre apresentacao, navegacao, configuracao e acesso a dados.

```text
src/
|-- app/                 # composicao das rotas da aplicacao
|-- features/            # modulos funcionais e suas telas
|-- navigation/          # contratos e fluxos de navegacao
|-- shared/api/          # cliente HTTP, autenticacao e sessao
|-- shared/config/       # configuracao de ambiente
|-- shared/storage/      # contratos e implementacoes de persistencia
`-- assets/              # identidade visual e recursos estaticos
```

A camada de armazenamento expoe uma interface unica para as telas e permite dois modos de operacao:

- `storage`: dados mantidos localmente com AsyncStorage;
- `onpremise`: dados persistidos pela API REST, com sessao autenticada.

Essa separacao reduz o acoplamento da interface com a infraestrutura e permite evoluir os modos de implantacao sem duplicar os fluxos do produto.

## Stack

- React Native 0.85 e React 19;
- Expo SDK 56;
- TypeScript;
- React Navigation;
- AsyncStorage para persistencia local;
- Expo Camera para leitura de codigo de barras;
- cliente HTTP integrado a API do Validade Facil.

## Configuracao

### Pre-requisitos

- Node.js compativel com o Expo SDK 56;
- npm;
- Android Studio, Xcode ou um dispositivo com ambiente Expo, conforme a plataforma de destino.

Instale as dependencias e crie o arquivo de ambiente:

```sh
npm install
cp .env.example .env
```

Para executar somente com armazenamento local:

```env
EXPO_PUBLIC_APP_DATA_MODE=storage
```

Para conectar a uma instalacao da API:

```env
EXPO_PUBLIC_APP_DATA_MODE=onpremise
EXPO_PUBLIC_API_URL=http://localhost:8080
```

No emulador Android, use `http://10.0.2.2:8080` para acessar uma API executada na maquina host.

## Execucao

```sh
npm run start
```

Outros comandos disponiveis:

```sh
npm run android
npm run ios
npm run web
npm run typecheck
npm run lint
```

## Integracao com a API

No modo `onpremise`, o aplicativo autentica o usuario, mantem a sessao e delega a API as operacoes de catalogo, lotes e estoque. A URL deve apontar para uma instancia acessivel pelo dispositivo; `localhost` no dispositivo nao representa necessariamente a maquina de desenvolvimento.

O contrato HTTP e as instrucoes completas de infraestrutura estao documentados no repositorio do back-end.

## Qualidade e evolucao

Antes de publicar alteracoes, execute:

```sh
npm run typecheck
npm run lint
```

Novos modulos devem preservar a separacao entre componentes visuais, regras de fluxo e acesso a dados. Informacoes sensiveis e configuracoes especificas de ambiente devem permanecer no `.env`, que nao e versionado.

## Licenca

Consulte o arquivo [LICENSE](LICENSE) para os termos de uso e distribuicao.
