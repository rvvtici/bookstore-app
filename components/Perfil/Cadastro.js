import React, { useState } from 'react';
import { TextInput, Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const Cadastro = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const criarUsuario = async () => {
    if (!email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;
      const uid = user.uid;
      const token = await user.getIdToken(); //do proprio firebase

      await AsyncStorage.setItem('firebaseToken', token);
      await AsyncStorage.setItem('userEmail', user.email);
      await AsyncStorage.setItem('userUid', uid);

      //novo objeto na tabela users
      await firebase.database().ref('users/' + uid).set({
        uid,
        email: user.email,
        livrosSalvos: [],
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.', [
        {
          text: 'OK',
          onPress: () => {
            setEmail('');
            setSenha('');
            setConfirmarSenha('');
            navigation.navigate('Login');
          },
        },
      ]);
      
    } catch (error) {
      console.log('Erro no cadastro:', error);
      Alert.alert('Erro', getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email já está em uso';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      default:
        return 'Erro ao criar conta: ' + errorCode;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Conta</Text>
      <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={cores.cinza}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={cores.cinza}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor={cores.cinza}
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.botaoCriar} onPress={criarUsuario}>
        <Text style={styles.textoBotaoCriar}>Criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.botaoSecundario}>
        <Text style={styles.textoBotaoSecundario}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.amarelo,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.verde,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: cores.amareloEscuro,
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: cores.branco,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: cores.preto,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: cores.amareloEscuro,
  },
  botaoCriar: {
    backgroundColor: cores.amareloEscuro,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoCriar: {
    color: cores.branco,
    fontSize: 17,
    fontWeight: 'bold',
  },
  botaoSecundario: {
    marginTop: 20,
  },
  textoBotaoSecundario: {
    color: cores.verde,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Cadastro;
