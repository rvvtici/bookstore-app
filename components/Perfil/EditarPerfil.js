import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
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

export default function EditarPerfil({ navigation }) {
  const { usuario, fazerLogout } = useAuth(navigation);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const user = firebase.auth().currentUser;
      
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        senhaAtual
      );
      
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(novaSenha);
      
      Alert.alert(
        'Sucesso!',
        'Senha alterada com sucesso',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      
      let mensagem = 'Erro ao alterar senha';
      if (error.code === 'auth/wrong-password') {
        mensagem = 'Senha atual incorreta';
      } else if (error.code === 'auth/weak-password') {
        mensagem = 'A senha é muito fraca';
      }
      
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{usuario}</Text>
          <Text style={styles.infoNote}>O email não pode ser alterado</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alterar Senha</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Senha Atual</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha atual"
            placeholderTextColor={cores.cinza}
            secureTextEntry
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a nova senha (mín. 6 caracteres)"
            placeholderTextColor={cores.cinza}
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a nova senha novamente"
            placeholderTextColor={cores.cinza}
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={alterarSenha}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </Text>
        </TouchableOpacity>
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.amarelo
  },
  section: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.amareloEscuro,
    marginBottom: 15
  },
  infoCard: {
    backgroundColor: cores.branco,
    padding: 20,
    borderRadius: 6
  },
  infoLabel: {
    fontSize: 12,
    color: cores.cinza,
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 16,
    color: cores.preto,
    fontWeight: '550',
    marginBottom: 8
  },
  infoNote: {
    fontSize: 13,
    color: cores.verde,
    fontStyle: 'italic',
    fontWeight: '500'
  },
  inputContainer: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 14,
    color: cores.amareloEscuro,
    marginBottom: 4,
    fontWeight: '600'
  },
  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.amarelo,
    borderRadius: 6,
    padding: 15,
    fontSize: 16,
    color: cores.preto
  },
  button: {
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6
  },
  primaryButton: {
    backgroundColor: cores.verde
  },

  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: 'bold'
  },

});