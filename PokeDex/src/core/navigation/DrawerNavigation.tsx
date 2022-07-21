import React from 'react';
import styled from 'styled-components/native';
import Animated, {
  Extrapolate,
  useAnimatedStyle,
  interpolate,
  SharedValue
} from 'react-native-reanimated';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItem,
  useDrawerProgress
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import PokemonScreen from '../../screens/pokemon/PokemonScreen';
import FavoritesScreen from '../../screens/favorites/FavoritesScreen';
import MapScreen from '../../screens/map/MapScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import SplashScreen from '../splash-screen/SplashScreen';
import ThemeTestScreen from '../../screens/theme-test/ThemeTestScreen';
import HamburgerIcon from './hamburger-icon/HamburgerIcon';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import {
  FINAL_SCREEN_SCALE,
  DrawerContentScrollView,
  DrawerWrapper
} from './DrawerNavigation.styles';
import Logo from '@assets/svg/logo.svg';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/theme/theme.selector';

MaterialIcon.loadFont();
IonIcon.loadFont();

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

type ScreensProps = {
  navigation: DrawerNavigationHelpers;
};

// This component must be declared in this file in order to work
// (styles aren't applied when component is imported from the styles file)
const OuterWrapper = Animated.createAnimatedComponent(styled.View`
  ${({ theme }) => theme.shadow.medium.lg};
`);

const Screens: React.FC<ScreensProps> = ({ navigation }) => {
  const progress = useDrawerProgress() as Readonly<SharedValue<number>>;
  const theme = useSelector(selectTheme);

  const animatedTransformStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progress.value,
      [0, 1],
      [1, FINAL_SCREEN_SCALE],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }]
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      progress.value,
      [0, 1],
      [0, 10],
      Extrapolate.CLAMP
    );

    return {
      borderRadius
    };
  });

  return (
    <OuterWrapper style={animatedTransformStyle}>
      <Animated.View style={[animatedBorderStyle, { overflow: 'hidden' }]}>
        <SplashScreen menuToggle={<HamburgerIcon navigation={navigation} />}>
          <Stack.Navigator
            screenOptions={{
              headerTransparent: true,
              headerTitle: '',
              cardOverlayEnabled: false,
              cardStyle: {
                backgroundColor: theme.color.background.primary
              },
              presentation: 'card',
              gestureEnabled: false,
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
      </Animated.View>
    </OuterWrapper>
  );
};

const DrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation
}) => {
  const theme = useSelector(selectTheme);
  // const themeMode = useSelector(selectThemeMode);
  const labelStyle = { marginLeft: -16, color: theme.color.text.primary };
  const iconProps = { size: 20, color: theme.color.text.primary };

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        paddingTop: 0
      }}
    >
      <Logo height={75} width={175} />
      <DrawerItem label="Test" onPress={() => navigation.navigate('Test')} />
      <DrawerItem
        label="Pokemon"
        onPress={() => navigation.navigate('Pokemon')}
        labelStyle={labelStyle}
        icon={() => <MaterialIcon name="list-alt" {...iconProps} />}
      />
      <DrawerItem
        label="Favorites"
        onPress={() => navigation.navigate('Favorites')}
        labelStyle={labelStyle}
        icon={() => <MaterialIcon name="favorite-outline" {...iconProps} />}
      />
      <DrawerItem
        label="Map"
        onPress={() => navigation.navigate('Map')}
        labelStyle={labelStyle}
        icon={() => <IonIcon name="map-outline" {...iconProps} />}
      />
      <DrawerItem
        label="Settings"
        onPress={() => navigation.navigate('Settings')}
        labelStyle={labelStyle}
        icon={() => <IonIcon name="settings-outline" {...iconProps} />}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigation: React.FC = () => (
  <DrawerWrapper>
    <Drawer.Navigator
      initialRouteName="Test" // TODO - replace this route with Pokemon route
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'transparent',
        sceneContainerStyle: {
          backgroundColor: 'transparent'
        },
        drawerStyle: {
          width: '50%',
          backgroundColor: 'transparent'
        },
        drawerContentStyle: {
          flex: 1
        }
      }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen name="Screens" component={Screens} />
    </Drawer.Navigator>
  </DrawerWrapper>
);

export default DrawerNavigation;
