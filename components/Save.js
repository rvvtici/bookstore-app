import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, Text, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function Save({ route }) {
  const { searchQuery } = route.params;
  const [layout, setLayout] = useState('column');

  const livros = [
    { 
      id: '1',
      titulo: 'React Native Básico',
      escritor: 'Fulano',
      descricao: 'Aprenda conceitos básicos',
      preco: 20,
      imagem: 'https://via.placeholder.com/100'
    },
    { 
      id: '2',
      titulo: 'Aprenda JavaScript',
      escritor: 'Ciclano',
      descricao: 'JavaScript do zero',
      preco: 25,
      imagem: 'https://via.placeholder.com/100'
    },
  ].filter(l => l.titulo.toLowerCase().includes(searchQuery.toLowerCase()));

  // Largura do card depende do layout
  const cardWidth = layout === 'column' ? (screenWidth / 3) - 10 : screenWidth - 20;
  const imageSize = layout === 'column' ? (screenWidth / 3) - 15 : 100; // 100px para row

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={layout}
        onValueChange={setLayout}
        buttons={[
          { value: 'column', label: <MaterialCommunityIcons name="table-large" size={20}/> },
          { value: 'row', label: <MaterialCommunityIcons name="table-of-contents" size={20}/> },
        ]}
      />

      <FlatList
        key={layout} // força recarregar FlatList ao mudar layout
        data={livros}
        keyExtractor={item => item.id}
        numColumns={layout === 'column' ? 3 : 1}
        renderItem={({ item }) => (
          <Card style={[styles.card, { width: cardWidth, flexDirection: layout === 'row' ? 'row' : 'column' }]}>
            {/* Imagem */}
            <Image
              source={{ uri: item.imagem }}
              style={{ width: imageSize, height: imageSize, margin: 5 }}
              resizeMode="cover"
            />

            {/* Conteúdo */}
            <Card.Content style={[styles.cardContent, { alignItems: layout === 'row' ? 'flex-start' : 'center' }]}>
              <Text style={styles.title}>{item.titulo}</Text>

              {layout === 'row' && (
                <>
                  <Text style={styles.author}>Autor: {item.escritor}</Text>
                  <Text style={styles.description}>{item.descricao}</Text>
                </>
              )}

              <Text style={styles.price}>R$ {item.preco}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 5,
    alignItems: 'center',
  },
  cardContent: {
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  author: {
    fontStyle: 'italic',
    marginBottom: 2,
  },
  description: {
    marginBottom: 2,
  },
  price: {
    color: 'green',
    fontWeight: 'bold',
  },
});
