import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../config/config';

const cores = {
  verde: '#515f51',
  preto: '#3A3A3A',
  branco: '#E8E8E8',
  amarelo: '#E5DFCE',
  amareloEscuro: '#7D6E46',
  cinza: '#646464',
  vermelho: '#733232',
};

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      //caso logado
      if (user) {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('firebaseToken', token);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('Usuário já logado:', user.email);
      }
    });


    const verificarUsuarioLogado = async () => {
        try {
          const token = await AsyncStorage.getItem('firebaseToken');
          const emailStorage = await AsyncStorage.getItem('userEmail');

          if (token && emailStorage && auth.currentUser) {
            navigation.navigate('Perfil', {
              usuario: emailStorage,
              token: token,
            });
          }
        } catch (error) {
          console.log('Erro ao verificar login:', error);
        }
      };


    verificarUsuarioLogado();



    //unmount (qnd sai da tela)
    return () => unsubscribe();
  }, []);


  

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, senha);
      const user = userCredential.user;
      const token = await user.getIdToken();

      await AsyncStorage.setItem('firebaseToken', token);
      await AsyncStorage.setItem('userEmail', user.email);

      setEmail('');
      setSenha('');

      navigation.navigate('Perfil', {
        usuario: user.email,
        token: token,
      });
    } catch (error) {
      console.log('Erro no login:', error);
      Alert.alert('Erro', getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      case 'auth/invalid-credential':
        return 'Email ou senha incorretos';
      default:
        return 'Erro ao fazer login: ' + errorCode;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo!</Text>
      <Text style={styles.subtitulo}>Acesse sua conta para continuar</Text>

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

      <TouchableOpacity style={styles.botaoEntrar} onPress={fazerLogin}>
        <Text style={styles.textoBotaoEntrar}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.botaoSecundario}>
        <Text style={styles.textoBotaoSecundario}>Criar conta</Text>
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
    fontSize: 28,
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
  botaoEntrar: {
    backgroundColor: cores.verde,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoEntrar: {
    color: cores.branco,
    fontSize: 17,
    fontWeight: 'bold',
  },
  botaoSecundario: {
    marginTop: 20,
  },
  textoBotaoSecundario: {
    color: cores.amareloEscuro,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Login;
