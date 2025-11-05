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

const Livro = ({ route, navigation }) => {
  const { livro } = route.params;
  const { usuario } = useAuth(navigation);
  const [estaSalvo, setEstaSalvo] = useState(false);
  const [estaNoCarrinho, setEstaNoCarrinho] = useState(false);

  useEffect(() => {
    verificarSeEstaSalvo();
    verificarSeEstaNoCarrinho();
  }, [usuario]);

  const verificarSeEstaSalvo = async () => {
    if (!usuario) return;
    
    try {
      const userUid = firebase.auth().currentUser?.uid;
      if (!userUid) return;

      const snapshot = await firebase.database()
        .ref(`users/${userUid}/livrosSalvos`)
        .once('value');
      
      if (snapshot.exists()) {
        const livrosSalvos = snapshot.val() || [];
        setEstaSalvo(livrosSalvos.includes(livro.id)); //retorna true / false
      }

    } catch (error) {
      console.error("Erro ao verificar livros salvos:", error);
    }
  };

  const verificarSeEstaNoCarrinho = async () => {
    try {
      const carrinhoJson = await AsyncStorage.getItem('carrinho'); //pega oq tem no carrinho
      const carrinho = carrinhoJson ? JSON.parse(carrinhoJson) : []; // transforma em json / array vazio
      setEstaNoCarrinho(carrinho.some(item => item.id === livro.id)); // some -> percorre o array e retorna true caso item.id === livro.id
    } catch (error) {
      console.error("Erro ao verificar carrinho:", error);
    }
  };

  const salvarLivro = async () => {
    if (!usuario) {
      Alert.alert(
        "Realize seu login",
        "É necessário estar logado para salvar livros",
        [
          { text: "OK", style: "default" }
        ]
      );
      return;
    }

    try {
      const userUid = firebase.auth().currentUser?.uid;
      if (!userUid) return;

      const snapshot = await firebase.database()
        .ref(`users/${userUid}/livrosSalvos`)
        .once('value');
      
      let livrosSalvos = snapshot.exists() ? snapshot.val() : []; 
      
      if (estaSalvo) {
        // remove dos salvos
        livrosSalvos = livrosSalvos.filter(id => id !== livro.id);
        setEstaSalvo(false);

      } else {
        // adiciona aos salvos
        livrosSalvos.push(livro.id);
        setEstaSalvo(true);
        Vibration.vibrate(100);
      }
      
      //reescreve os dados no database
      await firebase.database()
        .ref(`users/${userUid}/livrosSalvos`)
        .set(livrosSalvos);
      
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      // Alert.alert("Erro", "Não foi possível salvar o livro");
    }
  };

  const adicionarAoCarrinho = async () => {
    if (!usuario) {
      Alert.alert(
        "Realize seu login",
        "É necessário estar logado para salvar livros",
        [
          { text: "OK", style: "default" }
        ]
      );
      return;
    }


    try {
      const carrinhoJson = await AsyncStorage.getItem('carrinho');
      let carrinho = carrinhoJson ? JSON.parse(carrinhoJson) : [];
      
      if (estaNoCarrinho) {
        // remove do carrinho
        carrinho = carrinho.filter(item => item.id !== livro.id);
        setEstaNoCarrinho(false);
      } else {
        // adiciona ao carrinho
        carrinho.push(livro);
        setEstaNoCarrinho(true);
        Vibration.vibrate(100);
      }
      
      //muda asyncstorage do carrinho
      await AsyncStorage.setItem('carrinho', JSON.stringify(carrinho));
      
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      Alert.alert("Erro", "Não foi possível adicionar ao carrinho");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {livro.capa && ( // se tiver livro.capa, executa o Image
        <Image 
          source={{ uri: livro.capa }} 
          style={styles.capa}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.titulo}>{livro.titulo}</Text>
        
        <Text style={styles.autor}> {livro.nomeEscritor}</Text>
        
        {livro.descricao && (
          <View style={styles.descricaoBox}>
            <Text style={styles.descricao}>{livro.descricao}</Text>
          </View>
        )}


        <View style={styles.detalhesBox}>
          <Text style={styles.detalheTitulo}>Detalhes</Text>

          <View style={styles.gradeDetalhes}>

            <View style={styles.gradeItem}>
              <Text style={styles.gradeLabel}>Gênero</Text>
              <Text style={styles.gradeValor}>{livro.genero}</Text>
            </View>

            <View style={styles.gradeItem}>
              <Text style={styles.gradeLabel}>Língua</Text>
              <Text style={styles.gradeValor}>{livro.lingua}</Text>
            </View>

            <View style={styles.gradeItem}>
              <Text style={styles.gradeLabel}>ISBN</Text>
              <Text style={styles.gradeValor}>{livro.ISBN}</Text>
            </View>

            <View style={styles.gradeItem}>
              <Text style={styles.gradeLabel}>Ano</Text>
              <Text style={styles.gradeValor}>{livro.ano}</Text>
            </View>

            <View style={styles.gradeItem}>
              <Text style={styles.gradeLabel}>Páginas</Text>
              <Text style={styles.gradeValor}>{livro.numPags}</Text>
            </View>

            <View style={styles.gradeItem}>
              <Text style={styles.gradeLabel}>Estoque</Text>
              <Text style={styles.gradeValor}>{livro.estoque}</Text>
            </View>

              <Text style={styles.conservacaoItem}>
            <Text style={styles.gradeLabel}>Estado de conservação: </Text>
            <Text style={styles.gradeValor}>{livro.estadoConservacao}</Text>
          </Text>
          </View>
        </View>

        
        <Text style={styles.preco}>R$ {livro.preco.toFixed(2)}</Text>
        
        <View style={styles.botoesContainer}>
          <TouchableOpacity 
            style={[styles.botao, styles.botaoSalvar, estaSalvo && styles.botaoSalvoAtivo]}
            onPress={salvarLivro}
            activeOpacity={0.7}
          >
            <Text style={styles.botaoTexto}>
              {estaSalvo ? '★ Salvo' : '☆ Salvar'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.botao, 
              styles.botaoCarrinho,
              estaNoCarrinho && styles.botaoCarrinhoAtivo,
              livro.estoque <= 0 && styles.botaoDesabilitado
            ]}
            onPress={adicionarAoCarrinho}
            activeOpacity={0.7}
            disabled={livro.estoque <= 0}
          >
            <Text style={styles.botaoTexto}>
              {livro.estoque <= 0 
                ? 'Esgotado' 
                : estaNoCarrinho 
                  ? '✓ No Carrinho' 
                  : '+ Adicionar ao Carrinho'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.branco,
  },

  capa: {
    width: '100%',
    height: 380,
    backgroundColor: cores.branco,
    marginBottom: 18,
  },

  content: {
    paddingHorizontal: 10,
  },

  titulo: {
    fontSize: 22,
    fontWeight: '650',
    color: cores.amareloEscuro,
    textAlign: 'center',
    marginBottom: 4,
  },


  autor: {
    fontSize: 16,
    fontWeight:'550',
    color: cores.verde,
    textAlign: 'center',
    marginBottom: 20,
  },

  descricaoBox: {
    backgroundColor: cores.amarelo,
    padding: 12,
    borderRadius: 0,
    marginBottom: 20,
    elevation: 3,
  },

  descricao: {
    fontSize: 15,
    color: cores.amareloEscuro,
    lineHeight: 22,
  },




 

  detalheTitulo: {
    fontSize: 16,
    fontWeight: '650',
    color: cores.amareloEscuro,
    textAlign: 'center',
    marginBottom: 8,
  },

  gradeDetalhes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gradeItem: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: cores.branco,
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  gradeLabel: {
    fontSize: 12,
    color: cores.amareloEscuro,
    fontWeight: '600',
    marginBottom: 2,
  },

  gradeValor: {
    fontSize: 13,
    color: cores.preto,
    fontWeight: '500',
  },

  detalhesBox: {
    marginTop: 10,
    backgroundColor: cores.amarelo,
    borderRadius: 6,
    padding: 10,
  },

  conservacaoItem: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
    backgroundColor: cores.branco,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontWeight: '500',
  },

  preco: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.verde,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
  },

  botoesContainer: {
    gap: 10,
    marginBottom: 30,
  },

  botao: {
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  botaoSalvar: {
    backgroundColor: cores.verde,
  },

  botaoSalvoAtivo: {
    backgroundColor: '#2b3b2b',
  },

  botaoCarrinho: {
    backgroundColor: cores.verde,
  },

  botaoCarrinhoAtivo: {
    backgroundColor: '#2b3b2b',
  },

  botaoTexto: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: 'bold',
  },
});


export default Livro;