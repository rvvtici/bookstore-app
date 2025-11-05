import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

export default function Compras({ navigation }) {
  const { usuario } = useAuth(navigation);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandidos, setExpandidos] = useState({});

  useEffect(() => {
    if (usuario) {
      carregarCompras();
    }
  }, [usuario]);

  const carregarCompras = async () => {
    try {
      const comprasSnapshot = await firebase.database()
        .ref('livrosComprados')
        .orderByChild('emailComprador')
        .equalTo(usuario)
        .once('value');

      if (comprasSnapshot.exists()) {
        const comprasData = comprasSnapshot.val();
        const comprasArray = [];

        for (const compraId in comprasData) {
          const compra = comprasData[compraId];
          
          const livrosDetalhes = [];
          for (const livroId of compra.livrosComprados) {
            const livroSnapshot = await firebase.database()
              .ref(`livro/${livroId}`)
              .once('value');
            
            if (livroSnapshot.exists()) {
              const livroData = livroSnapshot.val();
              
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

          comprasArray.push({
            id: compraId,
            ...compra,
            livrosDetalhes
          });
        }

        comprasArray.sort((a, b) => new Date(b.data) - new Date(a.data));
        setCompras(comprasArray);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
      setLoading(false);
    }
  };

  const toggleExpandir = (compraId) => {
    setExpandidos(prev => ({
      ...prev,
      [compraId]: !prev[compraId]
    }));
  };

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };


  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (compras.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhuma Compra</Text>
        <Text style={styles.emptyText}>
          Você não realizou nenhuma compra
        </Text>
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.exploreButtonText}>Explorar Livros</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {compras.length} {compras.length === 1 ? 'compra' : 'compras'}
        </Text>
      </View>

      {compras.map((compra) => (
        <View key={compra.id} style={styles.compraCard}>
          <TouchableOpacity 
            style={styles.compraHeader}
            onPress={() => toggleExpandir(compra.id)}
            activeOpacity={0.7}
          >
            <View style={styles.compraHeaderInfo}>
              <View style={styles.compraIdContainer}>
                <Text style={styles.compraIdLabel}>Pedido</Text>
                <Text style={styles.compraId}>#{compra.id}</Text>
              </View>
              
              <Text style={styles.compraData}>{formatarData(compra.data)}</Text>
              
              <View style={styles.compraResumo}>
                <Text style={styles.compraItens}>
                  {compra.livrosComprados.length} {compra.livrosComprados.length === 1 ? 'item' : 'itens'}
                </Text>
                <Text style={styles.compraTotal}>
                  R$ {compra.total.toFixed(2)}
                </Text>
              </View>
            </View>

            <Text style={styles.expandIcon}>
              {expandidos[compra.id] ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {expandidos[compra.id] && (
            <View style={styles.compraDetalhes}>
              
              {compra.livrosDetalhes.map((livro) => (
                <TouchableOpacity
                  key={livro.id}
                  style={styles.livroItem}
                  onPress={() => navigation.navigate('Livro', { livro })}
                  activeOpacity={0.7}
                >
                  {livro.capa && (
                    <Image 
                      source={{ uri: livro.capa }} 
                      style={styles.livroImage}
                      resizeMode="cover"
                    />
                  )}
                  
                  <View style={styles.livroInfo}>
                    <Text style={styles.livroTitulo} numberOfLines={2}>
                      {livro.titulo}
                    </Text>
                    <Text style={styles.livroAutor}>{livro.nomeEscritor}</Text>
                    <Text style={styles.livroPreco}>
                      R$ {livro.preco.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.amarelo
  },
  header: {
    padding: 20,
    paddingBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: cores.amareloEscuro,
    fontWeight: '550'
  },
  compraCard: {
    backgroundColor: cores.branco,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden'
  },
  compraHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: cores.branco
  },
  compraHeaderInfo: {
    flex: 1
  },
  compraIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  compraIdLabel: {
    fontSize: 12,
    color: cores.cinza,
    marginRight: 5,
    fontWeight: '500'
  },
  compraId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.verde
  },
  compraData: {
    fontSize: 13,
    color: cores.amareloEscuro,
    marginBottom: 8,
    fontWeight: '500'
  },
  compraResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  compraItens: {
    fontSize: 14,
    color: cores.preto,
    fontWeight: '500'
  },
  compraTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.verde
  },
  expandIcon: {
    fontSize: 16,
    color: cores.amareloEscuro,
    marginLeft: 10
  },
  compraDetalhes: {
    borderTopWidth: 1,
    borderTopColor: cores.amarelo,
    padding: 15,
    backgroundColor: cores.amarelo
  },
  detalhesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.amareloEscuro,
    marginBottom: 10
  },
  livroItem: {
    flexDirection: 'row',
    backgroundColor: cores.branco,
    padding: 12,
    borderRadius: 6,
    marginBottom: 10
  },
  livroImage: {
    width: 50,
    height: 75,
    borderRadius: 4,
    backgroundColor: cores.amarelo
  },
  livroInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between'
  },
  livroTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.amareloEscuro,
    marginBottom: 2
  },
  livroAutor: {
    fontSize: 12,
    color: cores.verde,
    marginBottom: 4,
    fontWeight: '500'
  },
  livroPreco: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.verde
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: cores.amarelo
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.amareloEscuro,
    marginBottom: 10
  },
  emptyText: {
    fontSize: 16,
    color: cores.verde,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    fontWeight: '500'
  },
  loadingText: {
    fontSize: 16,
    color: cores.verde,
    fontWeight: '500'
  },
  loginButton: {
    backgroundColor: cores.verde,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 6
  },
  loginButtonText: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: 'bold'
  },
  exploreButton: {
    backgroundColor: cores.verde,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 6
  },
  exploreButtonText: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: 'bold'
  }
});