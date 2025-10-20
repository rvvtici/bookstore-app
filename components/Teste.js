import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, Text, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from '../config/config';

const screenWidth = Dimensions.get('window').width;

export default function BuscaResultado({ route, navigation }) {
  const { searchQuery } = route.params;
  const [layout, setLayout] = useState('column'); // column padrão
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    const ref = firebase.database().ref("livros");

    const listener = ref.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const livrosArray = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(l => l.nome.toLowerCase().includes(searchQuery.toLowerCase()));
        setLivros(livrosArray);
      }
    });

    // Cleanup listener
    return () => ref.off('value', listener);
  }, [searchQuery]);

  // Largura do card e tamanho da imagem
  const cardWidth = layout === 'column' ? (screenWidth / 3) - 10 : screenWidth - 20;
  const imageSize = layout === 'column' ? (screenWidth / 3) - 15 : 100;

const renderItem = ({ item }) => (
  <Card
    style={[styles.cardItem, { width: cardWidth, flexDirection: layout === 'row' ? 'row' : 'column' }]}
    onPress={() => navigation.navigate('Livro', { livros: item })}
  >
    <Image
      source={{ uri: item.imagem }}
      style={{ width: imageSize, height: imageSize, margin: 5 }}
      resizeMode="cover"
    />
    <Card.Content style={[styles.cardContent, { alignItems: layout === 'row' ? 'flex-start' : 'center' }]}>
      <Text style={styles.title}>{item.nome}</Text>

      {layout === 'row' && (
        <>
          <Text>Descrição: {item.descricao}</Text>
          <Text>Páginas: {item.nPaginas}</Text>
          <Text>Ano: {item.ano}</Text>
        </>
      )}

      <Text style={styles.price}>R$ {item.preco}</Text>
    </Card.Content>
  </Card>
);


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
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  cardItem: { margin: 5, alignItems: 'center', borderRadius: 8, overflow: 'hidden' },
  cardContent: { justifyContent: 'center' },
  title: { fontWeight: 'bold', marginBottom: 2 },
  price: { color: 'green', fontWeight: 'bold' },
});
