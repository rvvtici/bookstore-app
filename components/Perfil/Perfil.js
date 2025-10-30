import React from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { useAuth } from '../Autenticacao/useAuth';

const Perfil = ({ route, navigation }) => {
  const { usuario, token, tokenValido, fazerLogout } = useAuth(navigation);

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: fazerLogout }
      ]
    );
  };

  //perfil: login/cadastro -> *[dados perfil (email e senha), editar perfil/excluirperfil(email e senha), visualizar carrinho, visualizar compras

  return (
    <View style={{flex: 1, padding: 20}}>
      <Card style={{marginBottom: 20}}>
        <Card.Content>
          <Text>
            Email: {usuario}
          </Text>
        </Card.Content>
      </Card>

        <View style={{padding: 50}}>
          <Button
            title="Editar perfil"
            onPress={() => navigation.navigate('Editar Perfil')} 
          />

          <Button
            title="Carrinho"
            onPress={() => navigation.navigate('Carrinho')} 
          />

          <Button
            title="Compras"

            onPress={() => navigation.navigate('Compras')} 
          />

          <Button 
            title="Sair" 
            onPress={handleLogout}
            color="red"
          />
        </View>
      </View>
  );
};

export default Perfil;