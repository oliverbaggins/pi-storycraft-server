# StoryCraft – Gerador de Histórias de Usuário com GPT

**StoryCraft** é um back-end Node.js que utiliza a API da OpenAI para auxiliar usuários na criação de histórias de usuário (user stories) com base em perguntas e respostas simples. Ele permite a criação de projetos, geração automática de histórias, edição manual e organização das histórias para auxiliar times de desenvolvimento ágil.

**Se o projeto não estiver gerando as histórias é devido a falta de créditos**

## Funcionalidades

- Autenticação de usuários com JWT
- Criação de projetos personalizados
- Geração automática de histórias de usuário com base em entradas do usuário
- Edição, exclusão e organização das histórias
- Armazenamento e recuperação de histórias por projeto
- Integração com a API do ChatGPT

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB com Mongoose
- JWT para autenticação
- OpenAI API (ChatGPT)
- JavaScript

## Estrutura do Projeto

```
pi-storycraft-server/
├── configuration/         # Configurações do projeto (ex: JWT)
├── controllers/           # Lógica de controle das rotas
├── models/                # Modelos do Mongoose (User, ProjectStory, UserStory)
├── routes/                # Definição das rotas da API
├── services/              # Lógica de negócio (login, cadastro, etc)
├── utils/                 # Funções utilitárias (ex: JWT helpers)
├── server.js              # Ponto de entrada da aplicação
├── package.json           # Dependências e scripts
└── README.md              # Documentação do projeto
```

## Autenticação

O sistema usa **JSON Web Tokens (JWT)** para autenticação. Após login, o token deve ser enviado no cabeçalho `Authorization` para acessar rotas protegidas.

## Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/oliverbaggins/pi-storycraft-server.git
   cd pi-storycraft-server
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz com as seguintes chaves:

```env
PORT=3000
MONGO_URI=seu_mongodb_uri
JWT_SECRET=sua_chave_jwt
OPENAI_API_KEY=sua_chave_da_openai
```

4. Inicie o servidor:
   ```bash
   npm start
   ```

## Scripts Disponíveis

| Comando         | Descrição                            |
|----------------|----------------------------------------|
| `npm start`    | Inicia o servidor                     |
| `npm run dev`  | Inicia o servidor com nodemon (dev)   |

## Endpoints Principais

| Método | Rota                  | Descrição                        |
|--------|-----------------------|----------------------------------|
| POST   | `/signup`             | Cadastro de novo usuário         |
| POST   | `/login`              | Login de usuário                 |
| GET    | `/user-stories/:id`   | Recupera histórias por projeto   |
| POST   | `/user-stories`       | Gera nova história com ChatGPT   |
| PUT    | `/user-stories/:id`   | Edita uma história existente     |
| DELETE | `/user-stories/:id`   | Remove uma história              |

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Colaboradores

- **Back-end:** [Luiz Lopes](https://github.com/luizlopesbr)  
- **Front-end:** [Kauan Ribeiro](https://github.com/KauanRibeiroGondim)  
- **UX/UI:** [Emmanuel Soares](https://www.linkedin.com/in/emmanuelss/)  

#### Projeto para apoiar times ágeis na criação eficiente de histórias de usuário com auxílio da IA 
