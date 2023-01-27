# aluraflix

A videos API made with sveltekit, made by me for a Alura coding back-end challenge.
Since this is a alura project and the interface is being done in portuguese, the documentation will be as well.

## Usando a API (endpoints)

### **AUTH**

Antes de usar a API é necessário **cadastrar um usuário** e obter um **token JWT**:

- `POST api/signup` envie um POST com "nome" e "senha" em JSON, se os campos forem válidos, a senha passa por hash e um novo usuário é criado no campo de dados.
- `POST api/login` envie um POST com "nome" e "senha", se as credenciais forem válidas, retorna um **token JWT que é necessário para quase todas as requisições da API**. O token tem validade de uma hora.
- `POST api/validar_token` envie um POST com "token" em JSON para saber se o token em questão ainda é válido.

### **GET**

- `api/videos/free` retorna os primeiros 25 videos da base de dados, sendo o **único endpoint que não requer um token JWT.**
- `api/videos` retorna todos os videos cadastrados na base de dados
  - **Parâmetros opcionais:**
  - `?search=[string]`: busca por vídeos que incluem a string de busca no título.
  - `?page=[page_number]`: ativa a paginação do resultado, sendo mostrados 5 vídeos por página.
- `api/videos/[id]` retorna um video de acordo com a id indicada.
- `api/categorias` retorna todas as categorias cadastradas.
- `api/categorias/[id]` retorna uma categoria de acordo com a id indicada.
- `api/categorias/[id]/videos` retorna todos os vídeos com a id de categoria indicada.

### **POST**

- `api/videos` recebe um JSON no corpo da requisição com os campos *titulo*, *descricao*, *url* e, <ins>opcionalmente (mas não recomendado)</ins>, *id*, todos de acordo com as regras indicadas no final desse README, e cria uma nova entrada de video na base de dados.
- `api/categorias` recebe um JSON no corpo da requisição com os campos *titulo*, *cor*  e, <ins>opcionalmente (mas não recomendado)</ins>, *id*, todos de acordo com as regras indicadas no final desse README, e cria uma nova entrada de categoria na base de dados.

### **PUT/PATCH** (requisições de PUT e PATCH são tratadas igualmente)

- `api/videos/[id]` recebe um JSON no corpo da requisição com os campos *titulo*, *descrição*  e/ou *url*, nesse caso, todos os campos são opcionais, mas ainda seguem suas respectivas regras e tipos de dados. Altera a o vídeo indicado pela id na url com as informações passadas no body, se alguma informação for inválida, por exemplo um titulo grande demais, o campo é ignorado e a edição procede normalmente.
- `api/categorias/[id]` recebe um JSON no corpo da requisição com os campos *titulo* e/ou *cor*, nesse caso, todos os campos são opcionais, mas ainda seguem suas respectivas regras e tipos de dados. Altera a o vídeo indicado pela id na url com as informações passadas no body, se alguma informação for inválida, o campo é ignorado e a edição procede normalmente.
  
### **DELETE**

- `api/videos/[id]` deleta o video indicado pela id na url.
- `api/categorias/[id]` deleta a categoria indicada pela id na url.
  
## Dados

- video
  - id: SERIAL PRIMARY KEY (int com auto-incremento)
  - titulo: VARCHAR(40) NOT NULL
  - descricao: TEXT NOT NULL
  - url: VARCHAR(100) NOT NULL
  - categoria: INT DEAFULT 1 REFERENCES categorias(id) ON DELETE SET DEFAULT ON UPDATE CASCADE;

- categoria
  - id: SERIAL PRIMARY KEY
  - titulo: VARCHAR(30) UNIQUE NOT NULL
  - cor: VARCHAR(6) NOT NULL (basicamente é o formato hexadecimal sem o #)

- usuario
  - nome VARCHAR(20) PRIMARY KEY
  - senha TEXT NOT NULL (a senha só é armazenada depois do salt e do hash)
