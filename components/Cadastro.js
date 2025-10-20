import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import firebase from '../config/config';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const gravar = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    firebase.auth()
      .createUserWithEmailAndPassword(email.toLowerCase(), password)
      .then(() => {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        setEmail('');
        setPassword('');
        navigation.navigate('Login');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Erro', 'Esse email já está em uso');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Erro', 'Senha fraca, digite outra senha');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Erro', 'Formato do email inválido');
        } else {
          Alert.alert('Erro', 'Ocorreu um erro: ' + error.message);
        }
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Cadastrar Usuário:</Text>
      <TextInput
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Text>Cadastrar Senha:</Text>
      <TextInput
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title="Cadastrar" onPress={gravar} />
    </View>
  );
}
