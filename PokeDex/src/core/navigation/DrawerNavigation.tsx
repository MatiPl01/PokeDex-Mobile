import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
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
import { selectTheme } from '@store/theme/theme.selector';
import { createAnimatedStyles } from '@utils/reanimated';
import Logo from '@assets/svg/logo.svg';
import HamburgerIcon from './hamburger-icon/HamburgerIcon';
import {
  FINAL_SCREEN_SCALE,
  DrawerContentScrollView,
  DrawerWrapper
} from './DrawerNavigation.styles';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// This component must be declared in this file in order to work
// (styles aren't applied when component is imported from the styles file)
const OuterWrapper = Animated.createAnimatedComponent(styled.View`
  ${({ theme }) => theme.shadow.medium.lg};
`);

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
  const theme = useSelector(selectTheme);
  const progress = useDrawerProgress() as Readonly<SharedValue<number>>;
  const animatedStyles = useAnimatedScreensStyles(progress);

  return (
    <OuterWrapper style={animatedStyles.outerWrapper}>
      <Animated.View
        style={[{ overflow: 'hidden' }, animatedStyles.innerWrapper]}
      >
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
              headerLeft: () => null,
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
            }}
          >
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
  const labelStyle = { marginLeft: -16, color: theme.color.text.primary };
  const iconProps = { size: 20, color: theme.color.text.primary };

  return (
    <DrawerContentScrollView
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
    </DrawerContentScrollView>
  );
};

const DrawerNavigation: React.FC = () => (
  <DrawerWrapper>
    <Drawer.Navigator
      initialRouteName="Pokemon" // TODO - change to Pokemon
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
