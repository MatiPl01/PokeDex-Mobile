import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import PokemonScreen from '../../screens/pokemon/PokemonScreen';
import FavoritesScreen from '../../screens/favorites/FavoritesScreen';
import MapScreen from '../../screens/map/MapScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import SplashScreen from '../splash-screen/SplashScreen';
import ThemeTestScreen from '../../screens/theme-test/ThemeTestScreen';

MaterialIcon.loadFont();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Screens: React.FC = () => (
  <SplashScreen>
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () => null
      }}
    >
      <Stack.Screen name="Test" component={ThemeTestScreen} />
      <Stack.Screen name="Pokemon" component={PokemonScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </SplashScreen>
);

type DrawerContentProps = {
  navigation: any; // TODO - add more specific type
};

const DrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => (
  <DrawerContentScrollView>
    <DrawerItem label="Test" onPress={() => navigation.navigate('Test')} />
    <DrawerItem
      label="Pokemon"
      onPress={() => navigation.navigate('Pokemon')}
      icon={() => <MaterialIcon name="list-alt" size={20} />}
    />
    <DrawerItem
      label="Favorites"
      onPress={() => navigation.navigate('Favorites')}
      icon={() => <MaterialIcon name="favorite-outline" size={20} />}
    />
    <DrawerItem
      label="Map"
      onPress={() => navigation.navigate('Map')}
      icon={() => <Ionicon name="map-outline" size={20} />}
    />
    <DrawerItem
      label="Settings"
      onPress={() => navigation.navigate('Settings')}
      icon={() => <Ionicon name="settings-outline" size={20} />}
    />
  </DrawerContentScrollView>
);

const DrawerNavigation: React.FC = () => {
  return (
    // TODO - change menu icon color
    <Drawer.Navigator
      initialRouteName="Test" // TODO - replace this route with Pokemon route
      screenOptions={{
        headerTransparent: true,
        headerTitle: ''
      }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen name="Screens" component={Screens} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
