import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../Autenticacao/useAuth';
import firebase from '../../config/config';

  const cores = {
  verde: '#515f51',
  preto: '#3A3A3A',
  branco: '#E8E8E8',
  amarelo: '#E5DFCE',
  amareloEscuro: '#7D6E46',
  cinza: '#646464',
  vermelho: "#733232"
};

const Perfil = ({ navigation }) => {
  const { usuario, fazerLogout } = useAuth(navigation);
  const [userData, setUserData] = useState(null);



useEffect(() => {
  if (!usuario) return;

  const carregarDadosUsuario = async () => {
    try {
      const userUid = firebase.auth().currentUser?.uid;
      if (!userUid) return;

      const snapshot = await firebase.database()
        .ref(`users/${userUid}`)
        .once('value');
      
      //salva os dados na const userData
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  carregarDadosUsuario();

}, [usuario]);


  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          onPress: fazerLogout,
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
     

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {usuario.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.emailText}>{usuario}</Text>
      </View>



      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Editar Perfil')}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Editar Perfil</Text>
            <Text style={styles.menuSubtitle}>Altere seus dados pessoais</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>


        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Carrinho</Text>
            <Text style={styles.menuSubtitle}>Veja seus itens</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>


        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Compras')}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Minhas Compras</Text>
            <Text style={styles.menuSubtitle}>Confira seus pedidos</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>


        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, styles.logoutText]}>Sair</Text>
            <Text style={styles.menuSubtitle}>Desconectar da conta</Text>
          </View>
          <Text style={[styles.menuArrow, styles.logoutText]}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.amarelo,
  },


  header: {
    backgroundColor: cores.verde ,
    padding: 30,
    alignItems: 'center',
    paddingTop: 50
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: cores.amarelo,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },

  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: cores.verde
  },

  emailText: {
    fontSize: 17,
    color: cores.amarelo,
    fontWeight: '450'
  },


  menuContainer: {
    marginTop: 20,
    backgroundColor: cores.branco,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.amarelo,
  },

  menuTextContainer: {
    flex: 1
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.amareloEscuro,
    marginBottom: 2
  },

  menuSubtitle: {
    fontSize: 13,
    color: '#999'
  },

  menuArrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: 'bold'
  },

  logoutItem: {
    borderBottomWidth: 0
  },

  logoutText: {
    color: cores.preto
  }

});

export default Perfil;