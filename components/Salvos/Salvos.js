import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../Autenticacao/useAuth';
import firebase from '../../config/config';

const cores = {
  verde: '#515f51',
  preto: '#3A3A3A',
  branco: '#E8E8E8',
  amarelo: '#E5DFCE',
  amareloEscuro: '#7D6E46',
  cinza: '#646464',
  vermelho: '#733232',
};

const Salvos = ({ navigation }) => {
  const { usuario } = useAuth(navigation);
  const [livrosSalvos, setLivrosSalvos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario) {
      const userUid = firebase.auth().currentUser?.uid;
      
      if (!userUid) {
        console.log("Usuário não autenticado");
        return;
      }

      console.log("UID do usuário:", userUid);
      
      // pega o user no database
      const userRef = firebase.database().ref(`users/${userUid}`);
      
      //aqui ele salva o usuario pra modificar ele ate que alguma alteracao na tabela desse usuario seja feita
      const unsubscribe = userRef.on('value', async (snapshot) => {
        console.log("Snapshot recebido:", snapshot.exists());

        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log("Dados do usuário:", userData);
          
          //pega os livros salvos pelo user
          const livrosIds = userData.livrosSalvos || [];
          console.log("IDs dos livros salvos:", livrosIds);
          
          if (livrosIds.length > 0) {
            await buscarDetalhesLivros(livrosIds);
          } else {
            setLivrosSalvos([]);
          }
        } else {
          console.log("Usuário não encontrado no banco");
          setLivrosSalvos([]);
        }
        setLoading(false);
      });

      // cleanup: remove o listener quando o componente desmontar
      return () => userRef.off('value', unsubscribe);
    }
  }, [usuario]);


  const buscarDetalhesLivros = async (livrosIds) => {
    const livrosDetalhes = [];
    
    for (const livroId of livrosIds) {
      try {
        const livroSnapshot = await firebase.database()
          .ref(`livro/${livroId}`)
          .once('value');
        
        if (livroSnapshot.exists()) {
          const livroData = livroSnapshot.val();
          
          // Busca também os detalhes do escritor
          const escritorSnapshot = await firebase.database()
            .ref(`escritor/${livroData.id_escritor}`)
            .once('value');
          
          const escritorData = escritorSnapshot.val();
          
          livrosDetalhes.push({
            id: livroId,
            ...livroData,
            nomeEscritor: escritorData?.nome || 'Escritor desconhecido'
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar livro ${livroId}:`, error);
      }
    }
    
    console.log("Livros encontrados:", livrosDetalhes);
    setLivrosSalvos(livrosDetalhes);
  };


  const removerLivro = async (livroId) => {
    const userUid = firebase.auth().currentUser?.uid;
    if (!userUid) return;

    try {
      // salva os livros salvos em "novosLivros
      const novosLivros = livrosSalvos
        .map(l => l.id) //mapeia todos os livros
        .filter(id => id !== livroId); //salva todos os livros menos o excluido
      
      await firebase.database()
        .ref(`users/${userUid}/livrosSalvos`)
        .set(novosLivros); //salva aq
      
      console.log("Livro removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover livro:", error);
    }
  };

  // nao logado
  if (!usuario) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          Logue para acessar seus livros salvos
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  
  return (
    <View style={styles.salvos}>

    <ScrollView showsVerticalScrollIndicator={false} >
      {livrosSalvos.length > 0 ? (
        livrosSalvos.map(livro => (
          <View key={livro.id} style={styles.cardContainer}>


            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => navigation.navigate('Livro', { livro })}
              activeOpacity={0.7}
            >
              {livro.capa && (
                <Image
                  source={{ uri: livro.capa }}
                  style={styles.imageRow}
                  resizeMode="cover"
                />
              )}

              <View style={styles.cardRowContent}>
                <Text style={styles.titleRow} numberOfLines={2}>
                  {livro.titulo}
                </Text>

                <View style={styles.rowBottom}>
                  <Text style={styles.price}>R$ {livro.preco.toFixed(2)}</Text>

                </View>
              </View>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => removerLivro(livro.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeText}>Remover dos Salvos</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum livro salvo</Text>
        </View>
      )}
    </ScrollView>

    </View>
  );
};
const styles = {
  salvos: {
    backgroundColor: cores.amarelo,
    flex: 1,
    padding: 20,
  },

  cardContainer: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    marginBottom: 16,
    paddingBottom:6,
  },

  cardRow: {
    flexDirection: 'row',
    padding: 0,
    alignItems: 'center',
  },
  
  imageRow: {
    width: 80,
    height: 120,
    borderRadius: 4,
    marginRight: 15,
  },
  
  cardRowContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  titleRow: {
    fontSize: 18,
    fontWeight: 570,
    color: cores.amareloEscuro,
    marginBottom: 5,
  },


  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 16,
    fontWeight:  620,
    color: cores.verde,
  },

  stockInfo: {
    fontSize: 14,
    color: cores.preto,
  },

  removeButton: {
    backgroundColor: cores.preto,
    marginHorizontal: 0,
    marginTop: 4,
    marginBottom: 0,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },

  removeText: {
    color: cores.amarelo,
    fontWeight: 'bold',
    fontSize: 12,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },

  emptyText: {
    fontSize: 16,
    color: cores.verde,
  },

};

export default Salvos;