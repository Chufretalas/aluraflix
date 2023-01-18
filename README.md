# aluraflix

A fake videos API made with sveltekit, made by me for a Alura coding back-end challenge. 
Since this is a alura project and the interface is being done in portuguese, the documentation will be as well.

## Usando a API (endpoints)

> **Atualmente a API não está no ar para qualquer um usar, mas planejo colocá-la na vercel quando estiver pronta.**

#### GET
  - `/videos` retorna todos os videos cadastrados na base de dados
  - `/videos/[id]` retorna um video de acordo com sua id ou um erro **400** se o video não for encontrado
    - exemplo: `/videos/1` retorna o video com a id=1, se ele existir na base de dados
    
#### POST
  - `/videos` recebe um JSON no corpo da requisição com os campos *titulo*, *descrição* e, <ins>opcionalmente (mas não recomendado)</ins>, *id*, todos de acordo com as regras indicadas no final desse README, e cria uma nova entrada de video na base de dados. Retorna o video criado ou um erro 400 se a requisição for inválida.
  
#### PUT/PATCH (requisições de PUT e PATCH são tratadas igualmente)
  - `/videos/[id]` recebe um JSON no corpo da requisição com os campos *titulo*, *descrição*  e/ou *url*, nesse caso, todos os campos são opcionais, mas ainda seguem suas respectivas regras e tipos de dados. Altera a o vídeo indicado pela id na url com as informações passadas no body, se alguma informação for inválida, por exemplo um titulo grande demais, o campo é ignorado e a edição procede normalmente. Retorna o video editado ou um erro 400 em caso de requisição inválida.
  
 #### DELETE
  - `/videos/[id]` deleta o video indicado pela id na url. Retorna o vídeo deletetado ou um erro 400 em caso de requisição inválida.
  
## Dados

* video
  * id: SERIAL PRIMARY KEY (int com auto-incremento)
  * titulo: VARCHAR(40) NOT NULL
  * descricao: TEXT NOT NULL
  * url: VARCHAR(100) NOT NULL
