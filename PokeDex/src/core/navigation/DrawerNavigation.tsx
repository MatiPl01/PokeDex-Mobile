import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  useDrawerStatus
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
import HamburgerIcon from './hamburger-icon/HamburgerIcon';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
// import { interpolate } from 'react-native-reanimated';

// MaterialIcon.loadFont();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

type ScreensProps = {
  navigation: DrawerNavigationHelpers;
};

const Screens: React.FC<ScreensProps> = ({ navigation }) => {
  return (
    <SplashScreen menuToggle={<HamburgerIcon navigation={navigation} />}>
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
};

const DrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation
}) => (
  <DrawerContentScrollView>
    <DrawerItem label="Test" onPress={() => navigation.navigate('Test')} />
    <DrawerItem
      label="Pokemon"
      onPress={() => navigation.navigate('Pokemon')}
      labelStyle={{ marginLeft: -16 }}
      // icon={() => <MaterialIcon name="list-alt" size={20} />}
    />
    <DrawerItem
      label="Favorites"
      onPress={() => navigation.navigate('Favorites')}
      labelStyle={{ marginLeft: -16 }}
      // icon={() => <MaterialIcon name="favorite-outline" size={20} />}
    />
    <DrawerItem
      label="Map"
      onPress={() => navigation.navigate('Map')}
      labelStyle={{ marginLeft: -16 }}
      // icon={() => <Ionicon name="map-outline" size={20} />}
    />
    <DrawerItem
      label="Settings"
      onPress={() => navigation.navigate('Settings')}
      labelStyle={{ marginLeft: -16 }}
      // icon={() => <Ionicon name="settings-outline" size={20} />}
    />
  </DrawerContentScrollView>
);

const DrawerNavigation: React.FC = () => (
  <Drawer.Navigator
    initialRouteName="Test" // TODO - replace this route with Pokemon route
    screenOptions={{
      headerShown: false
    }}
    drawerContent={DrawerContent}
  >
    <Drawer.Screen name="Screens" component={Screens} />
  </Drawer.Navigator>
);

export default DrawerNavigation;
