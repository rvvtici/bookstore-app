import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro({ navigation }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const gravar = async () => {
    try {
      await AsyncStorage.setItem(user, password);
      alert('Salvo com sucesso!');
      setUser('');
      setPassword('');
    } catch (erro) {
      alert('Erro ao salvar!');
    }
  };

  return (
    <View>
      <Text>Cadastrar Usuário:</Text>
      <TextInput
        value={user}
        onChangeText={setUser}
        style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
      />
      <Text>Cadastrar Senha:</Text>
      
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
      />

      <Button title="Cadastrar" 
      onPress={() => {
        gravar();
        navigation.navigate("Login");
        console.log('Botão clicado!');
  }}
       />


    </View>
  );
}



const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    margin: 20,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
