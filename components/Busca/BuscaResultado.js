import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, Text, ScrollView, Modal } from 'react-native';
import { Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from '../../config/config';

const screenWidth = Dimensions.get('window').width;

const cores = {
  verde: '#515f51',
  preto: '#3A3A3A',
  branco: '#E8E8E8',
  amarelo: '#E5DFCE',
  amareloEscuro: '#7D6E46',
  cinza: '#646464',
  vermelho: "#733232"
};

export default function BuscaResultado({ route, navigation }) {
  const { searchQuery, filterType = 'titulo' } = route.params;
  const [layout, setLayout] = useState('column');
  const [livros, setLivros] = useState([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filtrosDisponiveis, setFiltrosDisponiveis] = useState({ autores: [], generos: [] });
  const [filtrosSelecionados, setFiltrosSelecionados] = useState({ autores: [], generos: [] });

  useEffect(() => {
    buscarLivros();
  }, [searchQuery, filterType]);

  useEffect(() => {
    aplicarFiltrosAvancados();
  }, [filtrosSelecionados, livros]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowFilterModal(true)} style={{ marginRight: 10 }}>
          <MaterialCommunityIcons name="filter" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const buscarLivros = async () => {
    setLoading(true);
    try {
      const livrosSnapshot = await firebase.database().ref('livro').once('value');

      if (livrosSnapshot.exists()) {
        const livrosData = livrosSnapshot.val();
        const livrosArray = [];

        for (const livroId in livrosData) {
          const livro = livrosData[livroId];
          const escritorSnapshot = await firebase.database().ref(`escritor/${livro.id_escritor}`).once('value');
          const escritorData = escritorSnapshot.val();

          livrosArray.push({
            id: livroId,
            ...livro,
            nomeEscritor: escritorData?.nome || 'Escritor desconhecido'
          });
        }

        // filtra os livros baseado na busca
        const livrosFiltrados = livrosArray.filter(livro => {
          const query = searchQuery.toLowerCase();
          if (filterType === 'titulo') return livro.titulo?.toLowerCase().includes(query);
          if (filterType === 'autor') return livro.nomeEscritor?.toLowerCase().includes(query);
          if (filterType === 'genero') return livro.genero?.toLowerCase().includes(query);
          return false;
        });

        setLivros(livrosFiltrados);
        setLivrosFiltrados(livrosFiltrados);
        
        // filtros disponíveis dos resultados da busca
        const autores = new Set();
        const generos = new Set();
        
        livrosFiltrados.forEach(livro => {
          if (livro.nomeEscritor) autores.add(livro.nomeEscritor);
          if (livro.genero) generos.add(livro.genero);
        });

        setFiltrosDisponiveis({
          autores: Array.from(autores).sort(),
          generos: Array.from(generos).sort(),
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setLoading(false);
    }
  };

  const aplicarFiltrosAvancados = () => {
    let resultado = [...livros];

    if (filtrosSelecionados.generos.length > 0) {
      resultado = resultado.filter(livro => filtrosSelecionados.generos.includes(livro.genero));
    }

    if (filtrosSelecionados.autores.length > 0) {
      resultado = resultado.filter(livro => filtrosSelecionados.autores.includes(livro.nomeEscritor));
    }

    setLivrosFiltrados(resultado);
  };

  const toggleFiltro = (categoria, valor) => {
    setFiltrosSelecionados(prev => {
      const novosFiltros = { ...prev };
      const index = novosFiltros[categoria].indexOf(valor);
      
      if (index > -1) {
        novosFiltros[categoria] = novosFiltros[categoria].filter(item => item !== valor);
      } else {
        novosFiltros[categoria] = [...novosFiltros[categoria], valor];
      }
      
      return novosFiltros;
    });
  };

  const removerFiltroEspecifico = (categoria, valor) => {
    setFiltrosSelecionados(prev => ({
      ...prev,
      [categoria]: prev[categoria].filter(item => item !== valor)
    }));
  };

  const limparFiltros = () => {
    setFiltrosSelecionados({ autores: [], generos: [] });
  };

  const cardWidth = layout === 'column' ? (screenWidth / 2) - 20 : screenWidth - 40;
  const imageHeight = layout === 'column' ? 180 : 120;

  const renderItem = ({ item }) => {
    if (layout === 'column') {
      return (
        <TouchableOpacity
          style={[styles.cardColumn, { width: cardWidth }]}
          onPress={() => navigation.navigate('Livro', { livro: item })}
          activeOpacity={0.7}
        >
          {item.capa && <Image source={{ uri: item.capa }} style={[styles.imageColumn, { height: imageHeight }]} resizeMode="cover" />}
          <View style={styles.cardColumnContent}>
            <Text style={styles.titleColumn} numberOfLines={2}>{item.titulo}</Text>
            <Text style={styles.authorColumn} numberOfLines={1}>{item.nomeEscritor}</Text>
            <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.cardRow} onPress={() => navigation.navigate('Livro', { livro: item })} activeOpacity={0.7}>
          {item.capa && <Image source={{ uri: item.capa }} style={styles.imageRow} resizeMode="cover" />}
          <View style={styles.cardRowContent}>
            <Text style={styles.titleRow} numberOfLines={2}>{item.titulo}</Text>
            <Text style={styles.authorRow}>{item.nomeEscritor}</Text>
            <Text style={styles.genreRow}>{item.genero}</Text>
            <View style={styles.rowBottom}>
              <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
              <Text style={styles.stockInfo}>{item.estoque > 0 ? `${item.estoque} em estoque` : 'Esgotado'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderFiltroSecao = (titulo, categoria, opcoes) => (
    <View style={styles.filtroSecao}>
      <Text style={styles.filtroSecaoTitulo}>{titulo}</Text>
      <View style={styles.filtroOpcoes}>
        {opcoes.map(opcao => (
          <TouchableOpacity
            key={opcao}
            style={[styles.filtroOpcao, filtrosSelecionados[categoria].includes(opcao) && styles.filtroOpcaoAtiva]}
            onPress={() => toggleFiltro(categoria, opcao)}
          >
            <Text style={[styles.filtroOpcaoTexto, filtrosSelecionados[categoria].includes(opcao) && styles.filtroOpcaoTextoAtivo]}>
              {opcao}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Buscando livros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* chips de busca e filtros */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          <Chip style={styles.chip} textStyle={styles.chipText} icon="magnify">{searchQuery}</Chip>
          {filtrosSelecionados.autores.map(autor => (
            <Chip key={`autor-${autor}`} style={styles.chipFiltro} textStyle={styles.chipFiltroText} onClose={() => removerFiltroEspecifico('autores', autor)} closeIcon="close">{autor}</Chip>
          ))}
          {filtrosSelecionados.generos.map(genero => (
            <Chip key={`genero-${genero}`} style={styles.chipFiltro} textStyle={styles.chipFiltroText} onClose={() => removerFiltroEspecifico('generos', genero)} closeIcon="close">{genero}</Chip>
          ))}
        </ScrollView>
      </View>

      {/* toggle de layout e contagem */}
      <View style={styles.controlsContainer}>
        <View style={styles.layoutToggle}>
          <TouchableOpacity style={[styles.layoutButton, layout === 'column' && styles.layoutButtonActive]} onPress={() => setLayout('column')}>
            <MaterialCommunityIcons name="view-grid" size={20} color={layout === 'column' ? cores.amarelo : cores.verde} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.layoutButton, layout === 'row' && styles.layoutButtonActive]} onPress={() => setLayout('row')}>
            <MaterialCommunityIcons name="view-list" size={20} color={layout === 'row' ? cores.amarelo : cores.verde} />
          </TouchableOpacity>
        </View>
        <Text style={styles.resultadoCount}>{livrosFiltrados.length} {livrosFiltrados.length === 1 ? 'resultado' : 'resultados'}</Text>
      </View>

      {/* modal de filtros */}
      <Modal visible={showFilterModal} animationType="slide" transparent={false} onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <MaterialCommunityIcons name="close" size={28} color={cores.preto} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {filtrosDisponiveis.autores.length > 0 && renderFiltroSecao('Autor', 'autores', filtrosDisponiveis.autores)}
            {filtrosDisponiveis.generos.length > 0 && renderFiltroSecao('Gênero', 'generos', filtrosDisponiveis.generos)}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.limparButton} onPress={limparFiltros}>
              <Text style={styles.limparButtonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aplicarButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.aplicarButtonText}>Aplicar ({livrosFiltrados.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* lista de resultados */}
      {livrosFiltrados.length > 0 ? (
        <FlatList
          key={layout}
          data={livrosFiltrados}
          keyExtractor={item => item.id}
          numColumns={layout === 'column' ? 2 : 1}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="book-search" size={64} color={cores.cinza} />
          <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
          <Text style={styles.emptySubtext}>Tente ajustar os filtros ou buscar por outro termo</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: cores.amarelo 
  },

  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: cores.amarelo 
  },

  loadingText: { 
    fontSize: 16, 
    color: cores.verde, 
    fontWeight: '500' 
  },

  chipsContainer: { 
    backgroundColor: cores.branco, 
    paddingVertical: 12, 
    borderBottomLeftRadius: 16, 
    borderBottomRightRadius: 16 
  },

  chipsScroll: { 
    paddingHorizontal: 16, 
    gap: 8 
  },

  chip: { 
    backgroundColor: cores.amarelo, 
    borderWidth: 1, 
    borderColor: cores.verde 
  },

  chipText: { 
    color: cores.verde, 
    fontWeight: '600', 
    fontSize: 13 
  },

  chipFiltro: { 
    backgroundColor: cores.verde 
  },

  chipFiltroText: { 
    color: cores.amarelo, 
    fontWeight: '600', 
    fontSize: 13 
  },

  controlsContainer: { 
    backgroundColor: cores.branco, 
    marginHorizontal: 6, 
    marginTop: 12, 
    borderRadius: 6, 
    padding: 12 
  },

  layoutToggle: { 
    flexDirection: 'row', 
    backgroundColor: cores.amarelo, 
    borderRadius: 8, 
    padding: 4, 
    marginBottom: 8 
  },

  layoutButton: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 8, 
    borderRadius: 6 
  },

  layoutButtonActive: { 
    backgroundColor: cores.verde 
  },

  resultadoCount: { 
    fontSize: 14, 
    color: cores.amareloEscuro, 
    textAlign: 'center', 
    fontWeight: '600' 
  },

  listContent: { 
    padding: 10 
  },

  cardColumn: { 
    backgroundColor: cores.branco, 
    borderRadius: 12, 
    margin: 5, 
    overflow: 'hidden', 
    elevation: 2 
  },

  imageColumn: { 
    width: '100%', 
    backgroundColor: cores.amarelo 
  },

  cardColumnContent: { 
    padding: 10 
  },

  titleColumn: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: cores.amareloEscuro, 
    marginBottom: 4 
  },

  authorColumn: { 
    fontSize: 12, 
    color: cores.cinza, 
    marginBottom: 6 
  },

  cardRow: { 
    flexDirection: 'row', 
    backgroundColor: cores.branco, 
    borderRadius: 12, 
    marginBottom: 10, 
    padding: 10, 
    elevation: 2 
  },

  imageRow: { 
    width: 80, 
    height: 120, 
    borderRadius: 8, 
    backgroundColor: cores.amarelo 
  },

  cardRowContent: { 
    flex: 1, 
    marginLeft: 12, 
    justifyContent: 'space-between' 
  },

  titleRow: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: cores.amareloEscuro, 
    marginBottom: 4 
  },

  authorRow: { 
    fontSize: 14, 
    color: cores.cinza, 
    marginBottom: 2 
  },

  genreRow: { 
    fontSize: 12, 
    color: cores.verde, 
    marginBottom: 8, 
    fontWeight: '500' 
  },

  rowBottom: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  stockInfo: { 
    fontSize: 11, 
    color: cores.cinza 
  },

  price: { 
    fontSize: 16, 
    fontWeight: '620', 
    color: cores.verde 
  },

  modalContainer: { 
    flex: 1, 
    backgroundColor: cores.amarelo 
  },

  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: cores.branco, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    paddingTop: 50 
  },

  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: cores.amareloEscuro 
  },

  modalContent: { 
    flex: 1, 
    padding: 20 
  },

  filtroSecao: { 
    marginBottom: 24 
  },

  filtroSecaoTitulo: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: cores.amareloEscuro, 
    marginBottom: 12 
  },

  filtroOpcoes: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },

  filtroOpcao: { 
    backgroundColor: cores.branco, 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: cores.branco 
  },

  filtroOpcaoAtiva: { 
    backgroundColor: cores.verde, 
    borderColor: cores.verde 
  },

  filtroOpcaoTexto: { 
    fontSize: 14, 
    color: cores.preto, 
    fontWeight: '500' 
  },

  filtroOpcaoTextoAtivo: { 
    color: cores.amarelo, 
    fontWeight: '600' 
  },

  modalFooter: { 
    flexDirection: 'row', 
    padding: 20, 
    backgroundColor: cores.branco, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    gap: 12 
  },

  limparButton: { 
    flex: 1, 
    backgroundColor: cores.amarelo, 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: cores.verde 
  },

  limparButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: cores.verde 
  },

  aplicarButton: { 
    flex: 1, 
    backgroundColor: cores.verde, 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },

  aplicarButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: cores.amarelo 
  },

  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40 
  },

  emptyText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: cores.verde, 
    marginTop: 16, 
    marginBottom: 8 
  },

  emptySubtext: { 
    fontSize: 14, 
    color: cores.cinza, 
    textAlign: 'center' 
  }
});
