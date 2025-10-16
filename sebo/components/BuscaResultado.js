import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, SafeAreaView, SegmentedButtons} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function BuscaResultado({ route }) {
  const { searchQuery } = route.params;
  const [value, setValue] = React.useState('column');

  const livros = [
    { id: '1', titulo: 'React Native Básico', preco: 20 },
    { id: '2', titulo: 'Aprenda JavaScript', preco: 20 },
  ].filter(l => l.titulo.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={{ padding: 6,  alignItems: 'center'}}>
          <SegmentedButtons style={{width:200}}
            value={value}
            showSelectedCheck={true}
            onValueChange={setValue}
            buttons={[
              {
                value: 'column',
                label:<MaterialCommunityIcons name="table-of-contents"/>,
              },
              {
                value: 'row',
                label:<MaterialCommunityIcons name="table-row"/>,
              },]}
          />


      <FlatList
        data={livros}
        keyExtractor={item => item.id} //cada item tem seu proprio id. o flatlist precisa disso para evitar repeticoes e erros

        //como item é exibido:
        
        renderItem={({ item }) => (
          value === "row" ? (
          <Card style={{ marginBottom: 3, marginLeft:0, marginRight:0 }}>
            <Card.Content>
              <Text>{item.titulo}</Text>
              <Text>{item.preco}</Text>
            </Card.Content>
          </Card>
          ) : 
          <Card>
            <Card.Content>
              <Text>{item.titulo}</Text>
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
    alignItems: 'center',
  },
});
