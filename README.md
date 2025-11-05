# bookstore-app

#### sobre
criação de um plicativo para um sebo (livraria de livros usados) com as funcionalidades de busca, salvar livros, perfil e carrinho


#### motivação:
projeto realizado com intuito de praticar react native. além disso, a escolha do tema foi baseada no meu próprio interesse em livros utilizados, justamente por serem mais acessíveis e pela rotatividade que geram. ademais, antes da escolha do tema eu já estava produzindo um projeto em react com o mesmo tema: bookstore[https://github.com/rvvtici/bookstore]


#### tecnologias utilizadas:
- framework: react native
- banco de dados: firebase realtime database
- autenticação: firebase authentication
- bibliotecas: react navigation, async storage, react native paper
- linguagens javascript


#### funcionalidades:
 - home: página de containers com livros em destaque -> página com todos os livros do container -> detalhe livro específico (ações de salvar & add carrinho)*
 - busca: input de pesquisa + filtros -> resultado pesquisa + filtros + ordenação -> detalhe livro específico (ações de salvar & add carrinho)*
 - salvos: mostra os livros salvos pelo usuario*
 - perfil: login/cadastro -> *[dados perfil (email e senha), editar perfil (senha), visualizar carrinho, visualizar compras
<br>
*necessitam de login
 
#### estrutura do banco de dados:
  - user: email(PK), livrosSalvos[](FK) (senha é desnecessária pois estou utilizando o auth do firebase)
  - livro: id(PK), id_escritor(FK), id_editora(FK), titulo, ano, numPags, estadoConservacao, descricao, genero, ISBN, língua, capa, preco, estoque
  - escritor: id(PK), nome, nascimento, país
  - editora: id(PK), nome
  - containerLivros: id(PK), nome, livrosContidos[](FK)
  - livrosComprados: id(PK), emailComprador(FK), data, livrosComprados[](FK)
    
#### demonstração:
youtube[https://youtu.be/vSbk71NVQDQ]

#### instalação e execução:
o projeto inteiro pode ser acessado e executado no seguinte repositório: https://snack.expo.dev/@rvvtici/sebo. após o acesso, um projeto no firebase deve ser criado com realtime database e authentication. depois disso, vá em config/config.js e modifique o firebaseConfig de acordo com os dados do seu firebase. no realtime database, importe o arquivo database.json.

#### aprendizado e próximos passos:
a autenticação (caso o app exija login) e o banco de dados são as primeiras coisas a serem feitas depois que as funcionalidades são estabelecidas. sem elas, manter o projeto consistente se torna complicado. acredito que esse projeto me deu um ótimo senso crítico para qualquer aplicativo que eu utilizar daqui em diante, como se um universo tivesse se expandido. achei algo genuinamente divertido de fazer e a parte da programação que realmente me motiva é a capacidade de criar qualquer coisa a partir da sua própria criatividade.