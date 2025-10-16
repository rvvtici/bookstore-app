import React from 'react';
import { View } from 'react-native';
import { Card, Paragraph, Text } from 'react-native-paper';

export default function Livro({ route }) {

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Card>
        <Card.Title title="Livros" />
        <Card.Content>
          <Paragraph></Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}
