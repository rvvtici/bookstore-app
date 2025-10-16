import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';

export default function Perfil({ route }) {
  const { usuario } = route.params;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Bem-vindo!" />
        <Card.Content>
          <Paragraph>Usuário: {usuario}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
