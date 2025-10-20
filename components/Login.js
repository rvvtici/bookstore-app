import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firebase from "../config/config"

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const ler = () =>{
    firebase.auth()
    .signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Logado!!!", "Login realizado com sucesso!");
        navigation.navigate("Perfil", { email });
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode == "auth/invalid-email") {
          console.log("Formato do email invalido");
          Alert.alert("Formato do email invalido");
        } else {
          console.log("Erro Desconhecido");
          Alert.alert("Ocorreu um erro");
        }
      });
  }

  return (
    <View>
      <Text>Usuário:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
      />
      <Text>Senha:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
      />
      <Button title="Logar" onPress={ler} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cadastro')}
      >
          <Text style={styles.buttonText}>Cadastro</Text>
      </TouchableOpacity>

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
