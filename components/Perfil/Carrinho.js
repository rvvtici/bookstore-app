import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function Carrinho({ navigation }) {
  const { usuario } = useAuth(navigation);
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCarrinho();
    
    const unsubscribe = navigation.addListener('focus', () => {
      carregarCarrinho();
    });

    return unsubscribe;
  }, [navigation]);

  const carregarCarrinho = async () => {
    try {
      const carrinhoJson = await AsyncStorage.getItem('carrinho');
      const itens = carrinhoJson ? JSON.parse(carrinhoJson) : [];
      setCarrinho(itens);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setLoading(false);
    }
  };

  const removerItem = async (livroId) => {
    try {
      const novosItens = carrinho.filter(item => item.id !== livroId);
      await AsyncStorage.setItem('carrinho', JSON.stringify(novosItens));
      setCarrinho(novosItens);
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const finalizarCompra = async () => {
    if (!usuario) {
      Alert.alert(
        'Login Necessário',
        'Você precisa estar logado para finalizar a compra',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Fazer Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }



    Alert.alert(
      'Confirmar compra?',
      `Total: R$ ${calcularTotal().toFixed(2)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: executarCompra
        }
      ]
    );
  };

  const executarCompra = async () => {
    try {
      setLoading(true);

      for (const item of carrinho) {
        const livroSnapshot = await firebase.database()
          .ref(`livro/${item.id}`)
          .once('value');
      }

      const compraId = firebase.database().ref('livrosComprados').push().key;
      const compraData = {
        id: compraId,
        emailComprador: usuario,
        data: new Date().toISOString().split('T')[0],
        livrosComprados: carrinho.map(item => item.id),
        total: calcularTotal()
      };

      await firebase.database()
        .ref(`livrosComprados/${compraId}`)
        .set(compraData);

      const updates = {};
      carrinho.forEach(item => {
        updates[`livro/${item.id}/estoque`] = 0;
      });
      await firebase.database().ref().update(updates);

      await AsyncStorage.setItem('carrinho', JSON.stringify([]));
      setCarrinho([]);

      Vibration.vibrate(200);

      Alert.alert(
        'Compra Realizada!',
        'Sua compra foi finalizada com sucesso',
        [
          { 
            text: 'Ver Compras', 
            onPress: () => navigation.navigate('Compras') 
          },
          { text: 'OK' }
        ]
      );

      setLoading(false);
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      Alert.alert('Erro', 'Não foi possível finalizar a compra');
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.preco, 0);
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (carrinho.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Carrinho Vazio</Text>
        <Text style={styles.emptyText}>
          Adicione livros ao carrinho para continuar
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >


        {carrinho.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            {item.capa && (
              <Image 
                source={{ uri: item.capa }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}
            
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.titulo}
              </Text>
              <Text style={styles.itemAuthor}>{item.nomeEscritor}</Text>
              <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removerItem(item.id)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            R$ {calcularTotal().toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutButton, loading && styles.buttonDisabled]}
          onPress={finalizarCompra}
          disabled={loading}
        >
          <Text style={styles.checkoutButtonText}>
            {loading ? 'Processando...' : 'Finalizar Compra'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.amarelo
  },
  scrollView: {
    flex: 1
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: cores.branco,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12
  },
  itemImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: cores.amarelo
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between'
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.amareloEscuro,
    marginBottom: 4
  },
  itemAuthor: {
    fontSize: 14,
    color: cores.verde,
    marginBottom: 8,
    fontWeight: '500'
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.verde
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: cores.amarelo,
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeButtonText: {
    fontSize: 18,
    color: cores.preto,
    fontWeight: 'bold'
  },
  spacer: {
    height: 20
  },
  footer: {
    backgroundColor: cores.branco,
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: cores.amarelo
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  totalLabel: {
    fontSize: 18,
    color: cores.amareloEscuro,
    fontWeight: '600'
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.verde
  },
  checkoutButton: {
    backgroundColor: cores.verde,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  checkoutButtonText: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: cores.amarelo
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
});