import React from 'react';
import { useSelector } from 'react-redux';
import Animated, { SharedValue } from 'react-native-reanimated';
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
import { selectCurrentTheme } from '@store/theme/theme.selector';
import { createAnimatedStyles } from '@utils/reanimated';
import PokemonDetailsScreen from '@screens/pokemon-details/PokemonDetailsScreen';
import Logo from '@assets/svg/logo.svg';
import HamburgerIcon from './hamburger-icon/HamburgerIcon';
import {
  FINAL_SCREEN_SCALE,
  DrawerContentView,
  DrawerWrapper,
  ScreensInnerWrapper
} from './DrawerNavigation.styles';

export type RootStackParamList = {
  Pokemon: undefined;
  PokemonDetails: { pokemonId: string };
  Favorites: undefined;
  Map: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const useAnimatedScreensStyles = createAnimatedStyles({
  outerWrapper: {
    transform: [{ scale: [1, FINAL_SCREEN_SCALE] }]
  },
  innerWrapper: {
    borderRadius: [0, 10],
    transform: [{ rotate: [0, 5] }]
  }
});

type ScreensProps = {
  navigation: DrawerNavigationHelpers;
};

const Screens: React.FC<ScreensProps> = ({ navigation }) => {
  const theme = useSelector(selectCurrentTheme);
  const progress = useDrawerProgress() as Readonly<SharedValue<number>>;
  const animatedStyles = useAnimatedScreensStyles(progress);

  return (
    <Animated.View style={animatedStyles.outerWrapper}>
      <ScreensInnerWrapper style={animatedStyles.innerWrapper}>
        <SplashScreen menuToggle={<HamburgerIcon navigation={navigation} />}>
          <Stack.Navigator
            screenOptions={{
              headerTransparent: true,
              headerTitle: '',
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
            <Stack.Screen name="Pokemon" component={PokemonScreen} />
            <Stack.Screen
              name="PokemonDetails"
              component={PokemonDetailsScreen}
            />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </SplashScreen>
      </ScreensInnerWrapper>
    </Animated.View>
  );
};

const DrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation
}) => {
  const theme = useSelector(selectCurrentTheme);
  const labelStyle = { marginLeft: -16, color: theme.color.text.primary };
  const iconProps = { size: 20, color: theme.color.text.primary };

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

const DrawerNavigation: React.FC = () => (
  <DrawerWrapper>
    <Drawer.Navigator
      initialRouteName="Pokemon"
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
