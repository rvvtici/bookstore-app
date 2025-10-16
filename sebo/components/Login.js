import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const ler = async () => {
    try {
      const senhaSalva = await AsyncStorage.getItem(usuario);
      if (senhaSalva != null) {
        if (senhaSalva === senha) {
          navigation.navigate('Perfil', { usuario });
        } else {
          alert('Senha incorreta!');
        }
      } else {
        alert('Usuário não foi encontrado!');
      }
    } catch (erro) {
      console.log(erro);
    }
  };

  return (
    <View>
      <Text>Usuário:</Text>
      <TextInput
        value={usuario}
        onChangeText={setUsuario}
        style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
      />
      <Text>Senha:</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
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
