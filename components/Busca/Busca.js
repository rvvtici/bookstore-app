import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cores = {
  verde: '#515f51',
  preto: '#3A3A3A',
  branco: '#E8E8E8',
  amarelo: '#E5DFCE',
  amareloEscuro: '#7D6E46',
  cinza: '#646464',
  vermelho: "#733232"
};

export default function Busca({ navigation }) {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('titulo');

  const onSubmitSearch = () => {
    if (query.trim()) {
      console.log('navegando com:', { 
        searchQuery: query.trim(),
        filterType: filterType 
      });
      
      navigation.navigate('Resultado', { 
        searchQuery: query.trim(),
        filterType: filterType 
      });
    }
  };


  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Pesquisar livros..."
        onChangeText={setQuery}
        value={query}
        onSubmitEditing={onSubmitSearch}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
      />

      {/* filtros */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Buscar por:</Text>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'titulo' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('titulo')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'titulo' && styles.filterButtonTextActive
            ]}>
              Título
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'autor' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('autor')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'autor' && styles.filterButtonTextActive
            ]}>
              Autor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'genero' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('genero')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'genero' && styles.filterButtonTextActive
            ]}>
              Gênero
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.amarelo,
    padding: 20
  },

  searchbar: {
    borderRadius: 6,
    backgroundColor: cores.branco
  },

  searchInput: {
    fontSize: 16,
    fontWeight: '500'
  },

  filterContainer: {
    marginTop: 20,
    backgroundColor: cores.branco,
    borderRadius: 6,
    padding: 16
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.amareloEscuro,
    marginBottom: 12
  },

  filterButtons: {
    flexDirection: 'row',
    gap: 10
  },

  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: cores.amarelo,
    alignItems: 'center',
    justifyContent: 'center'
  },

  filterButtonActive: {
    backgroundColor: cores.verde
  },

  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.verde
  },

  filterButtonTextActive: {
    color: cores.amarelo,
    fontWeight: '600'
  }
  
});