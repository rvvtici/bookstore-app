import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';

import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Perfil from './components/Perfil';
import Inicio from './components/Inicio';
import Busca from './components/Busca';
import BuscaResultado from './components/BuscaResultado';
import Livro from './components/Livro';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function NavBusca() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Busca" component={Busca} />
      <Stack.Screen name="Resultado" component={BuscaResultado} />
    </Stack.Navigator>
  );
}

function NavPerfil() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>

      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarIcon: ({color,size}) => (
            <MaterialCommunityIcons name="home"
            color={color} size={size}/>
          ),
          headerShown: false,
        }}
        />
      
      <Tab.Screen
        name="Busca"
        component={NavBusca}
        options={{
          tabBarIcon: ({color,size}) => (
            <MaterialCommunityIcons name="search-web"
            color={color} size={size}/>
          ),
          headerShown: false,
        }}
        />

      <Tab.Screen
        name="Livro"
        component={Livro}
        options={{
          tabBarIcon: ({color,size}) => (
            <MaterialCommunityIcons name="book"
            color={color} size={size}/>
          ),
          headerShown: false,
        }}
        />

        <Tab.Screen
          name="Perfil"
          component={NavPerfil}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />

        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
