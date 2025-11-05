import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../Autenticacao/useAuth';
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

const Inicio = ({ navigation }) => {
  const { usuario } = useAuth(navigation);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarContainers();
  }, []);

  //sem async nao seria possivel carregar todos os dados e o snapshot retornaria um "promise" (que quebraria o codigo)
  const buscarContainers = async () => {
    try {
      const containersSnapshot = await firebase.database()
        .ref('containerLivros')
        .once('value');
      
      //se conseguir carregar o database:
      if (containersSnapshot.exists()) {
        const containersData = containersSnapshot.val();
        const containersArray = [];

        //for para cada container no database
        for (const key in containersData) {
          const container = containersData[key];
          const livrosIds = container.livrosContidos || [];
          const livros = [];
          
          for (const livroId of livrosIds) {
            try {
              const livroSnapshot = await firebase.database()
                .ref(`livro/${livroId}`)
                .once('value');
              
              if (livroSnapshot.exists()) {
                const livroData = livroSnapshot.val();
                livros.push({
                  id: livroId,
                  capa: livroData.capa
                });
              }
            } catch (error) {
              console.error(`Erro ao buscar livro ${livroId}:`, error);
            }
          }

          containersArray.push({
            id: key,
            ...container, //const container = containersData[key];
            livros
          });
        }
        setContainers(containersArray);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar containers:", error);
      setLoading(false);
    }
  };

  const navegarParaContainer = (container) => {
    navigation.navigate('Container', { 
      containerId: container.id,
      containerNome: container.nome,
      livrosIds: container.livrosContidos 
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {containers.length > 0 ? (
          containers.map(container => {
            const exibicaoLivros = container.livros.slice(0, 5);

            return (
              <View key={container.id} style={styles.containerCard}>
                <TouchableOpacity 
                  onPress={() => navegarParaContainer(container)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.headerTop}>
                      <Text style={styles.containerNome}>{container.nome}</Text>
                      <Text style={styles.seta}>›</Text>
                    </View>
                    <Text style={styles.containerInfo}>
                      {container.livrosContidos?.length || 0} {container.livrosContidos?.length === 1 ? 'livro' : 'livros'}
                    </Text>
                  </View>

                  
           

                {/* capas */}
                {container.livros && container.livros.length > 0 && (
                  <View>
                      <View style={styles.capasContainer}>
                        {exibicaoLivros.map((livro) => (
                          <View 
                            key={livro.id} //key é necessario pro map
                            style={styles.capaWrapper}
                          >
                            {livro.capa ? (
                              <Image 
                                source={{ uri: livro.capa }} 
                                style={styles.capaImagem}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={styles.capaSemImagem}>
                                <Text style={styles.capaSemImagemTexto}>?</Text>
                              </View>
                            )}
                          </View>
                        ))}
                        
              
                      </View>
                  </View>
                )}     
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum container disponível</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: cores.amarelo
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.amarelo
  },

  loadingText: {
    fontSize: 16,
    color: cores.verde,
    fontWeight: '500'
  },

  containerCard: {
    backgroundColor: cores.branco,
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },

  cardHeader: {
    marginBottom: 4
  },

  containerNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.amareloEscuro
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0
  },

  containerInfo: {
    fontSize: 14,
    color: cores.verde,
    fontWeight: '500',
    marginBottom: 4,
  },

  capasScroll: {
    marginBottom: 15,
  },

  capasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 120,
  },

  seta: {
    fontSize: 24,
    color: cores.verde,
    fontWeight: 'bold'
  },

  capaWrapper: {
    width: 70,
    height: 120,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: cores.amarelo,
    backgroundColor: cores.amarelo
  },

  capaImagem: {
    width: '100%',
    height: '100%'
  },

  capaSemImagem: {
    width: '100%',
    height: '100%',
    backgroundColor: cores.amarelo,
    justifyContent: 'center',
    alignItems: 'center'
  },

  capaSemImagemTexto: {
    fontSize: 32,
    color: cores.amareloEscuro,
    fontWeight: 'bold'
  },



  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },

  emptyText: {
    fontSize: 16,
    color: cores.verde,
    textAlign: 'center',
    fontWeight: '500'
  }
});

export default Inicio;