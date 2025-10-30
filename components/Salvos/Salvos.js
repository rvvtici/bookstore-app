import React from 'react';
import { View } from 'react-native';
import { Card, Paragraph, Text } from 'react-native-paper';

import { useAuth } from '../Autenticacao/useAuth';

const Salvos = ({ route, navigation }) => {
  const { usuario, token, tokenValido, fazerLogout } = useAuth(navigation);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Card>
        <Card.Title title="Inicio" />
        <Card.Content>
        //arrumar aqui. primeiro fazer no database. dps colocar os livros aq
        </Card.Content>
      </Card>
    </View>
  );
}
