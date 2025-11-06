# bookstore-app

## sobre
criação de um aplicativo para um sebo (livraria de livros usados) com as páginas: início, busca, livros salvos e perfil


## motivação:
o projeto foi realizado com intuito de praticar react native. além disso, a escolha do tema foi baseada no meu próprio interesse e nos benefícios que livros utilizados trazem, justamente por serem mais acessíveis e pela rotatividade que geram. ademais, antes da escolha do tema, eu já estava produzindo um projeto em react com o mesmo tema: [bookstore](https://github.com/rvvtici/bookstore)


## tecnologias utilizadas:
- framework: react native
- banco de dados: firebase realtime database
- autenticação: firebase authentication
- bibliotecas: react navigation, async storage, react native paper
- linguagem: javascript


## páginas e funcionalidades:
 - início: página de containers com livros em destaque → página com todos os livros do container → detalhe de livro específico (ações de salvar & add carrinho)*
   - início: lista de containers com título e capas de livros determinados pela tabela containerLivros do database. quando clicado, é possível ver todos os livros do container específico
   - container: lista de livros do container específico com informações dos livros: capa, título, autor, gênero, preço, estoque. ao clicar, é possível abrir informações sobre um livro específico
   - livro: dados de um livro específico determinados pela tabela "livro" do database. mostra capa, título, autor, descrição, gênero, língua, ISBN, ano, páginas, estoque, estado de conservação e preço. além disso, é possível salvar e adicionar o livro ao carrinho. 
 - busca: input de pesquisa + filtros → resultado pesquisa + filtros + ordenação dos livros → detalhe de livro específico (ações de salvar & add carrinho)*
   - busca: input de busca e opções de busca por título, autor e gênero.
   - resultado da busca: demonstra todos os livros buscados. é possível escolher a exibição dos livros (grade e lista). também é possível filtrar a busca por nome do autor e gênero. caso algum livro seja clicado, leva à página do livro específico.
   - livro: igual ao acima (início → livro)
 - salvos: mostra os livros salvos pelo usuário*
   - salvos: caso logado, mostra todos os livros salvos pelo usuário com um botão de "remover dos livros salvos". caso clicado, leva à página do livro específico.
   - livro: igual ao acima (início → livro)
 - perfil: login/cadastro → *[dados perfil (email e senha), editar perfil (senha), visualizar carrinho, visualizar compras]
   - login & cadastro: exigem email e senha
   - perfil: após login, mostra email do usuário e opções de navegação: editar perfil, carrinho, compras, sair
   - editar perfil: é possível alterar a senha do usuário.
   - carrinho: mostra livros adicionados ao carrinho, total da compra e botão de finalizar compra. quando confirmada, o carrinho é zerado e a compra é adicionada ao "compras"
   - compras: todas as compras feitas pelo usuário
   - sair: logout do usuário
<br>*necessitam de login<br>
todos os dados são buscados pelo firebase realtime database, exceto o carrinho, o qual foi utilizado asyncstorage)

 
## estrutura do banco de dados:
  - user: email(PK), livrosSalvos[](FK) (senha é desnecessária pois estou utilizando o auth do firebase)
  - livro: id(PK), id_escritor(FK), id_editora(FK), titulo, ano, numPags, estadoConservacao, descricao, genero, ISBN, língua, capa, preco, estoque
  - escritor: id(PK), nome, nascimento, país
  - editora: id(PK), nome
  - containerLivros: id(PK), nome, livrosContidos[](FK)
  - livrosComprados: id(PK), emailComprador(FK), data, livrosComprados[](FK)

    
## demonstração:
[vídeo demonstrando todas as funcionalidades do aplicativo](https://youtu.be/vSbk71NVQDQ)


## instalação e execução:
o projeto inteiro pode ser acessado e executado no seguinte repositório: https://snack.expo.dev/@rvvtici/sebo. após o acesso, um projeto no firebase deve ser criado com realtime database e authentication. depois disso, vá em config/config.js e modifique o firebaseConfig de acordo com os dados do seu firebase. no realtime database, importe o arquivo database.json.


## aprendizado e próximos passos:
a autenticação (caso o app exija login) e o banco de dados são as primeiras coisas a serem feitas depois que as funcionalidades são estabelecidas. sem elas, manter o projeto consistente se torna complicado. acredito que esse projeto me deu um ótimo senso crítico para qualquer aplicativo que eu utilizar daqui em diante, como se um universo tivesse se expandido. gosto muito de projetos práticos pois a parte da programação que mais me deixa animado é a capacidade de criar qualquer coisa.
