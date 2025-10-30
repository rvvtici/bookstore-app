import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { Card, Text, SegmentedButtons, Chip, Appbar, ToggleButton, Menu, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from '../../config/config';

export default function Inicio({ route, navigation }) {
  // const [titulo, setTitulo] = useState("");
  // const [state, setState] = useState("books": []);
  const [containers, setContainers] = useState([]);
  const [detalhesLivros, setDetalhesLivros] = useState({});

  useEffect(() => {
    firebase.database().ref("containers").on('value', (snapshot) => { //acessa a pasta "containers" no database. snapshot -> dados firebase
      const data = snapshot.val(); // coleta os valores do database para a const data
      // const [dados, setDados] = useState(Object.values(data));
      // setState({books: dados})
      if (data) {
        const containersArray = Object.keys(data).map(key => ({ //
          id: key,    //id = nome do objeto (ex: new-additions). ela se torna a key
          ...data[key] //pega todos os valores referentes ao objeto
        }));
        setContainers(containersArray);
        buscarDetalhesLivros(containersArray);
      }
    });
  }, []);


  const buscarDetalhesLivros = async (containers) => {
    const idsLivros = [];

    containers.forEach(container => {
      if (container.books) { //books é um dict da pasta containers
        idsLivros.push(...Object.keys(container.books));
      }
    })
    const detalhes = {};
    for (const idLivro of idsLivros) {
      const snapshot = await firebase.database().ref(`livros/${idLivro}`).once(`value`);
      detalhes[idLivro] = snapshot.val();
    }

    setDetalhesLivros(detalhes);
  }


  return (
    <View>
      <FlatList
        data = {containers} // required. An array (or array-like list) of items to render. 
        renderItem= {({item}) => (  //required. Takes an item (objeto) from data and renders it into the list.
        //visualizacao do objeto
        <View>
            <Text>
              {item.title}
            </Text>

            <Text>
              Livros: {item.books ? Object.keys(item.books).map(bookId => (
                <Text key={bookId}>
                  {detalhesLivros[bookId]?.nome || bookId}
                </Text>
              )) : <Text>0</Text>}
            </Text>

        </View>   
        )}
            //{item.books ? Object.keys(item.books) : 0} 
                // if (item.books) -> return Object.keys(item.books).length
                // else -> return 0
      />
    </View>
  );
}
