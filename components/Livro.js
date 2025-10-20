import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function Livro({ route }) {
  const { livros } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Image
          source={{ uri: livros.imagem }}
          style={styles.image}
          resizeMode="cover"
        />
        <Card.Content>
          <Text style={styles.title}>{livros.nome}</Text>
          <Text>Autor ID: {livros.idAutor}</Text>
          <Text>Descrição: {livros.descricao}</Text>
          <Text>Páginas: {livros.nPaginas}</Text>
          <Text>Ano: {livros.ano}</Text>
          <Text>Preço: R$ {livros.preco}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginBottom: 10 },
  image: { width: '100%', height: 250, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
});
