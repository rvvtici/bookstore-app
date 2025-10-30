# bookstore-app

secondhand bookstore app


funcionalidades:
 - home: página de containers com livros em destaque -> página com todos os livros do container -> detalhe livro específico (ações de salvar & add carrinho)*
 - busca: input de pesquisa + filtros -> resultado pesquisa + filtros + ordenacao -> detalhe livro específico (ações de salvar & add carrinho)*
 - salvos: mostra os livros salvos pelo usuario*
 - perfil: login/cadastro -> *[dados perfil (email e senha), editar perfil/excluirperfil(email e senha), visualizar carrinho, visualizar compras
 *necessitam de login
 -> o carrinho tem apenas a opção de comprar que automaticamente deixa o estoque do livro como zero e a de cancelar compra que tira os livros do asyncstorage
 -> celular vibra quando livro é salvo ou adicionado ao carrinho


 banco de dados:
  - user: email(PK), livrosSalvos[](FK) (senha é desnecessária pois estou utilizando o auth do firebase)
  - livro: id(PK), id_escritor(FK), id_editora(FK), titulo, ano, numPags, estadoConservacao, descricao, genero, ISBN, língua, capa, preco, estoque
  - escritor: id(PK), nome, nascimento, país
  - editora: id(PK), nome
  - containerLivros: id(PK), nome, livrosContidos[](FK)
  - livrosComprados: id(PK), emailComprador(FK), data, livrosComprados[](FK)


- configurar asyncstorage para o login e carregar a verificação para todas as páginas. email carrega para todas as páginas 
- ainda sim o firebase
