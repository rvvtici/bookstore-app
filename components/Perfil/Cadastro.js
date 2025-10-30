import React, { useState } from 'react';
import { TextInput, Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../config/config';
import firebase from 'firebase';

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
      const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;
      
      const token = await user.getIdToken();
      
      await AsyncStorage.setItem('firebaseToken', token);
      await AsyncStorage.setItem('userEmail', user.email);
      
      await db.collection('users').doc(user.email).set({
        email: user.email,
        livrosSalvos: [],
        dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
        ultimoAcesso: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('Conta criada com sucesso!');
      
      Alert.alert(
        'Sucesso', 
        'Conta criada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              setSenha('');
              setConfirmarSenha('');
              
              navigation.navigate('LoginStack', {
                screen: 'Perfil',
                params: { 
                  usuario: user.email,
                  token: token 
                }
              });
            }
          }
        ]
      );
      
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
        style={{borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5}}
        placeholder="Mínimo 6 caracteres"
        value={senha}
      />
      
      <Text style={{fontSize: 18, marginBottom: 10}}>Confirmar Senha:</Text>
      <TextInput 
        onChangeText={setConfirmarSenha}
        secureTextEntry={true}
        style={{borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5}}
        placeholder="Digite novamente sua senha"
        value={confirmarSenha}
      />
      
      <Button title="Criar Conta" onPress={criarUsuario}/>
      <View style={{marginTop: 10}}>
        <Button 
          title="Voltar para Login" 
          onPress={() => navigation.navigate('LoginStack')} 
          color="gray"
        />
      </View>
    </View>
  );
};

export default Cadastro;