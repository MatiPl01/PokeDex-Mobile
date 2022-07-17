import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PokeBall from '@assets/svg/poke-ball.svg';
import Logo from '@assets/svg/logo.svg';

const SplashScreen: React.FC = () => {
  const edges = useSafeAreaInsets();
  const startAnimation = useRef(new Animated.Value(0)).current;
  const scaleLogo = useRef(new Animated.Value(1)).current;
  const scaleTitle = useRef(new Animated.Value(1)).current;
  const moveIcon = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const moveLogo = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(startAnimation, {
          toValue:
            -Dimensions.get('window').height +
            (Platform.OS === 'ios' ? edges.top : 0) +
            65,
          useNativeDriver: true
        }),
        Animated.timing(scaleLogo, {
          toValue: 0.35,
          useNativeDriver: true
        }),
        Animated.timing(scaleTitle, {
          toValue: 0.8,
          useNativeDriver: true
        }),
        Animated.timing(moveIcon, {
          toValue: {
            x: -Dimensions.get('window').width / 2 + 40,
            y:
              Dimensions.get('window').height / 2 -
              (Platform.OS === 'ios' ? 27.5 : 5)
          },
          useNativeDriver: true
        }),
        Animated.timing(moveLogo, {
          toValue: {
            x: 0,
            y:
              Dimensions.get('window').height / 2 -
              (Platform.OS === 'ios' ? 25 : 0) -
              145
          },
          useNativeDriver: true
        })
      ]).start();
    }, 500);
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: edges.top,
        backgroundColor: '#8C0004',
        transform: [
          {
            translateY: startAnimation
          }
        ]
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Animated.View
          style={{
            transform: [
              { translateX: moveIcon.x },
              { translateY: moveIcon.y },
              { scale: scaleLogo }
            ]
          }}
        >
          <PokeBall width={200} height={200} />
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              { translateX: moveLogo.x },
              { translateY: moveLogo.y },
              { scale: scaleTitle }
            ]
          }}
        >
          <Logo width={200} height={75} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default SplashScreen;
