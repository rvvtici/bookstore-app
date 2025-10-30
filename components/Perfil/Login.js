import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../config/config';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    // Listener para mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      //user ja logado
      if (user) {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('firebaseToken', token);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('Usuário já logado:', user.email);
      }
    });

    verificarUsuarioLogado();

    return () => unsubscribe();
  }, []);

  const verificarUsuarioLogado = async () => {
    try {
      //pega token e email pra logar
      const token = await AsyncStorage.getItem('firebaseToken');
      const emailStorage = await AsyncStorage.getItem('userEmail');
      
      //conseguiu os dados
      if (token && emailStorage && auth.currentUser) {
        console.log('Redirecionando usuário logado');
        navigation.navigate('Perfil', { 
          usuario: emailStorage,
          token: token 
        });
      } //nao conseguiu os dados/celular sem login
    } catch (error) {
      console.log('Erro ao verificar login:', error);
    }
  };

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      //firebase retorna a usercredential dps do login
      const userCredential = await auth.signInWithEmailAndPassword(email, senha);
      //user tb é do firebase. ele pega as infos do user (id, email)
      const user = userCredential.user;
      
      //igual o de cima, mas usa esse token para conseguir andar entre as paginas sem deslogar
      const token = await user.getIdToken();
      
      //salva no cache os dados do user
      await AsyncStorage.setItem('firebaseToken', token);
      await AsyncStorage.setItem('userEmail', user.email);
      
      console.log('Login realizado com sucesso!');
      
      setEmail('');
      setSenha('');
      
      navigation.navigate('Perfil', { 
        usuario: user.email,
        token: token 
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
    <View style={{padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 10}}>Email:</Text>
      <TextInput 
        onChangeText={setEmail}
        style={{borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5}}
        placeholder="seu@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
      />
      
      <Text style={{fontSize: 18, marginBottom: 10}}>Senha:</Text>
      <TextInput 
        onChangeText={setSenha}
        secureTextEntry={true}
        style={{borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5}}
        placeholder="Sua senha"
        value={senha}
      />
      
      <Button title="Entrar" onPress={fazerLogin}/>
      <View style={{marginTop: 10}}>
        <Button 
          title="Criar Conta" 
          onPress={() => navigation.navigate('Criar Usuário')} 
          color="gray"
        />
      </View>
    </View>
  );
};

export default Login;