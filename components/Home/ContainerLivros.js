import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from '../../config/config';

const cores = {
  verde: '#515f51',
  preto: '#3A3A3A',
  branco: '#E8E8E8',
  amarelo: '#E5DFCE',
  amareloEscuro: '#7D6E46',
  cinza: '#646464',
  vermelho: '#733232'
};

const ContainerLivros = ({ route, navigation }) => {
  const { containerId, containerNome, livrosIds } = route.params;
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarLivros();
  }, []);

  const buscarLivros = async () => {
    try {
      const livrosDetalhes = [];
      
      for (const livroId of livrosIds) {
        const livroSnapshot = await firebase.database()
          .ref(`livro/${livroId}`)
          .once('value');
        
        if (livroSnapshot.exists()) {
          const livroData = livroSnapshot.val();
          console.log(livroData);
          
          // Busca detalhes do escritor
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
      }
      
      setLivros(livrosDetalhes);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      setLoading(false);
    }
  };

  const navegarParaLivro = (livro) => {
    navigation.navigate('Livro', { livro });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando livros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      
      <ScrollView showsVerticalScrollIndicator={false}> 

        <Text style={styles.titulo}>{containerNome}</Text>

        {livros.length > 0 ? (

          livros.map(livro => (
            <TouchableOpacity
              key={livro.id}
              style={styles.livroCard}
              onPress={() => navegarParaLivro(livro)}
            >

              {livro.capa && (
                <Image 
                  source={{ uri: livro.capa }} 
                  style={styles.capa}
                  resizeMode="cover"
                />
              )}
              
                <View style={styles.infoContainer}>
                  <Text style={styles.titulo} numberOfLines={2}>
                    {livro.titulo}
                  </Text>
                  
                  <Text style={styles.autor}>
                    {livro.nomeEscritor}
                  </Text>
                  
                  <Text style={styles.genero}>
                    {livro.genero}
                  </Text>
                  
                  <View style={styles.bottomInfo}>
                    <Text style={styles.preco}>
                      R$ {livro.preco.toFixed(2)}
                    </Text>
                  
                  <Text style={styles.estoque}>
                    {livro.estoque > 0 
                      ? `${livro.estoque} em estoque` 
                      : 'Esgotado'}
                  </Text>

                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum livro disponível neste container</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: cores.amarelo
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  titulo: {
    fontSize: 20,
    fontWeight: 620,
    marginBottom: 10,
    color: cores.amareloEscuro
  },

  livroCard: {
    flexDirection: 'row',
    backgroundColor: cores.branco,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  capa: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },

  autor: {
    fontSize: 14,
    color: cores.verde,
    marginBottom: 3
  },
  genero: {
    fontSize: 13,
    color: cores.cinza,
    marginBottom: 5
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.verde
  },
  estoque: {
    fontSize: 12,
    color: cores.cinza
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  }
});

export default ContainerLivros;