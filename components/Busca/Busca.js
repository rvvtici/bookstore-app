import React, { useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Paragraph, Text, TextInput, Searchbar } from 'react-native-paper';


export default function Busca({ navigation, route }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const onSubmitSearch = () => {
    navigation.navigate('Resultado', { searchQuery: query });
  };

  return (
    <View>
      <Searchbar
        placeholder="Pesquisar"
        onChangeText={setQuery}
        value={query}
        onSubmitEditing={onSubmitSearch}
    />
    </View>
  );
}


const estilos = StyleSheet.create({
  input: {
    height: 16,
    padding: 14,
    fontSize: 10,
    borderColor: 'gray',
    borderWidth: 2,
    margin: 0,
    borderRadius: 0
  }
});