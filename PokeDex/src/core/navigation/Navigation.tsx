import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components';
import Animated, { SharedValue } from 'react-native-reanimated';
import { SIZE } from '@constants';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItem,
  useDrawerProgress
} from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SplashScreen from '@core/splash-screen/SplashScreen';
import PokemonScreen from '@screens/pokemon/PokemonScreen';
import FavoritesScreen from '@screens/favorites/FavoritesScreen';
import MapScreen from '@screens/map/MapScreen';
import SettingsScreen from '@screens/settings/SettingsScreen';
import { createAnimatedStyles } from '@utils/reanimated';
import PokemonDetailsScreen from '@screens/pokemon-details/PokemonDetailsScreen';
import Logo from '@assets/svg/logo.svg';
import HamburgerIcon from './hamburger-icon/HamburgerIcon';
import {
  FINAL_SCREEN_SCALE,
  DrawerContentView,
  DrawerWrapper,
  ScreensInnerWrapper
} from './Navigation.styles';
import { NavigatorScreenParams } from '@react-navigation/native';

export type HeaderStackParamList = {
  Pokemon: undefined;
  Favorites: undefined;
  Map: undefined;
  Settings: undefined;
};

export type FullScreenParamList = {
  PokemonDetails: { pokemonId: string };
};

export type RootStackParamList = {
  HeaderStack: NavigatorScreenParams<HeaderStackParamList>;
  FullScreenStack: NavigatorScreenParams<FullScreenParamList>;
};

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const HeaderStack = createStackNavigator<HeaderStackParamList>();
const FullScreenStack = createStackNavigator<FullScreenParamList>();

const useAnimatedScreensStyles = createAnimatedStyles({
  outerWrapper: {
    transform: [{ scale: [1, FINAL_SCREEN_SCALE] }]
  },
  innerWrapper: {
    borderRadius: [0, 10],
    transform: [{ rotate: [0, 5] }]
  }
});

type ScreensProps = PropsWithChildren<{
  navigation: DrawerNavigationHelpers;
}>;

const HeaderStackScreens: React.FC<ScreensProps> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SplashScreen menuToggle={<HamburgerIcon navigation={navigation} />}>
      <HeaderStack.Navigator
        screenOptions={{
          headerTitle: '',
          headerTransparent: true,
          cardOverlayEnabled: false,
          cardStyle: {
            backgroundColor: theme.color.background.secondary
          },
          presentation: 'card',
          gestureEnabled: false,
          headerLeft: () => null,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
        }}
      >
        <HeaderStack.Screen name="Pokemon" component={PokemonScreen} />
        <HeaderStack.Screen name="Favorites" component={FavoritesScreen} />
        <HeaderStack.Screen name="Map" component={MapScreen} />
        <HeaderStack.Screen name="Settings" component={SettingsScreen} />
      </HeaderStack.Navigator>
    </SplashScreen>
  );
};

const FullScreenStackScreens: React.FC<ScreensProps> = () => {
  const theme = useTheme();

  return (
    <FullScreenStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyle: {
          backgroundColor: theme.color.background.tertiary
        }
      }}
    >
      <FullScreenStack.Screen
        name="PokemonDetails"
        component={PokemonDetailsScreen}
      />
    </FullScreenStack.Navigator>
  );
};

const RootStackScreens: React.FC<ScreensProps> = () => {
  const theme = useTheme();
  const progress = useDrawerProgress() as Readonly<SharedValue<number>>;
  const animatedStyles = useAnimatedScreensStyles(progress);

  return (
    <Animated.View style={animatedStyles.outerWrapper}>
      <ScreensInnerWrapper style={animatedStyles.innerWrapper}>
        <View style={{ height: SIZE.SCREEN.HEIGHT }}>
          <RootStack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              cardStyle: {
                backgroundColor: theme.color.background.tertiary
              }
            }}
          >
            <RootStack.Screen
              name="HeaderStack"
              component={HeaderStackScreens}
            />
            <RootStack.Screen
              name="FullScreenStack"
              component={FullScreenStackScreens}
            />
          </RootStack.Navigator>
        </View>
      </ScreensInnerWrapper>
    </Animated.View>
  );
};

const DrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation
}) => {
  const theme = useTheme();
  const iconProps = { size: 20, color: theme.color.text.primary };
  const labelStyle = { marginLeft: -16, color: theme.color.text.primary };

  return (
    <DrawerContentView
      contentContainerStyle={{
        paddingTop: 0
      }}
    >
      <Logo height={75} width={175} />
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
    </DrawerContentView>
  );
};

const Navigation: React.FC = () => (
  <DrawerWrapper>
    <Drawer.Navigator
      initialRouteName="Screens"
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
        },
        unmountOnBlur: false
      }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen name="Root" component={RootStackScreens} />
    </Drawer.Navigator>
  </DrawerWrapper>
);

export default Navigation;
