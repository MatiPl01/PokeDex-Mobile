import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useTheme } from 'styled-components';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { createAnimatedStyle, createAnimatedStyles } from '@utils/reanimated';
import {
  MENU_TOGGLE_ANIMATION_DURATION,
  MENU_TOGGLE_ANIMATION_DELAY,
  SCREEN_WIDTH
} from '@core/splash-screen/SplashScreen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {
  OuterWrapper,
  InputWrapper,
  SearchButtonWrapper,
  SearchButton,
  IconWrapper,
  SearchInput,
  SEARCH_ICON_SIZE,
  SEARCH_BAR_HEIGHT,
  FOCUSED_SEARCH_BAR_HEIGHT,
  SEARCH_BAR_PADDING_TOP,
  SEARCH_BAR_HORIZONTAL_PADDING,
  SEARCH_WRAPPER_WIDTH
} from './SearchBar.styles';

const SEARCH_BUTTON_ANIMATION_DELAY = MENU_TOGGLE_ANIMATION_DELAY + 250;

Fontisto.loadFont(); // TODO - check if loading fonts in each file is correct
IonIcon.loadFont();
EntypoIcon.loadFont();
const AnimatedIonIcon = Animated.createAnimatedComponent(IonIcon);

const useAnimatedSlideStyle = createAnimatedStyle({
  transform: [{ translateX: [-100, 0] }]
});

const useAnimatedToggleStyles = createAnimatedStyles({
  wrapper: {
    width: [0, SEARCH_WRAPPER_WIDTH]
  },
  button: {
    transform: [{ translateX: [SEARCH_ICON_SIZE / 2, 0] }]
  }
});

const useAnimatedToggleIconStyles = createAnimatedStyles({
  search: {
    transform: [{ scale: [1, 0.5] }],
    opacity: [1, 0]
  },
  close: {
    transform: [{ scale: [0.5, 1] }],
    opacity: [0, 1]
  }
});

const useAnimatedFocusStyles = createAnimatedStyles({
  wrapper: {
    width: [SEARCH_WRAPPER_WIDTH, SCREEN_WIDTH],
    left: [SEARCH_BAR_HORIZONTAL_PADDING, 0],
    top: [SEARCH_BAR_PADDING_TOP, 0],
    paddingTop: [(SEARCH_ICON_SIZE - SEARCH_BAR_HEIGHT) / 2, 0],
    paddingRight: [SEARCH_ICON_SIZE / 2, 0]
  },
  inputWrapper: {
    height: [SEARCH_BAR_HEIGHT, FOCUSED_SEARCH_BAR_HEIGHT]
  },
  input: {
    borderRadius: [5, 0]
  }
});

const useAnimatedInputIconStyles = createAnimatedStyles({
  close: {
    transform: [{ scale: [1, 0.5] }],
    opacity: [1, 0]
  },
  erase: {
    transform: [{ scale: [0.5, 1] }],
    opacity: [0, 1]
  }
});

const SearchBar: React.FC = () => {
  const theme = useTheme();
  const iconColor = theme.color.white;
  // Component state
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [displayEraseIcon, setDisplayEraseIcon] = useState(false);
  // Component references
  const textInputRef = useRef<TextInput | null>(null);
  // Animation progress values
  const slideProgress = useSharedValue(0);
  const toggleProgress = useSharedValue(0);
  const toggleIconProgress = useSharedValue(0);
  const focusProgress = useSharedValue(0);
  const inputIconProgress = useSharedValue(0);
  // Animated styles
  const animatedSlideStyle = useAnimatedSlideStyle(slideProgress);
  const animatedToggleStyles = useAnimatedToggleStyles(toggleProgress);
  const animatedToggleIconStyles =
    useAnimatedToggleIconStyles(toggleIconProgress);
  const animatedFocusStyles = useAnimatedFocusStyles(focusProgress);
  const animatedFocusIconStyles = useAnimatedInputIconStyles(inputIconProgress);
  const animatedFocusButtonStyles = createAnimatedStyles({
    button: {
      backgroundColor: [theme.color.accent.primary, 'transparent']
    },
    icon: {
      color: [iconColor, theme.color.text.primary]
    }
  })(focusProgress);

  useEffect(() => {
    slideProgress.value = withDelay(
      SEARCH_BUTTON_ANIMATION_DELAY,
      withTiming(1, { duration: MENU_TOGGLE_ANIMATION_DURATION })
    );
  }, []);

  useEffect(() => {
    animateOnFocusChange();
  }, [isFocused]);

  useEffect(() => {
    setDisplayEraseIcon(Boolean(inputText) && isFocused);
  }, [inputText, isFocused]);

  useEffect(() => {
    animateEraseIcon();
  }, [displayEraseIcon]);

  const toggleSearchBar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      textInputRef.current?.blur();
      setIsFocused(false);
    }
    toggleProgress.value = withTiming(+isOpen, {
      duration: 500,
      easing: Easing.bezier(0.6, 0, 0.3, 1)
    });
    toggleIconProgress.value = withTiming(+isOpen, {
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
  };

  const animateOnFocusChange = () => {
    focusProgress.value = withTiming(+isFocused, {
      duration: 150
    });
  };

  const animateEraseIcon = () => {
    inputIconProgress.value = withTiming(+displayEraseIcon, {
      duration: 500,
      easing: Easing.bezier(0.5, 1.25, 0.85, 1.65)
    });
  };

  const handleButtonClick = () => {
    if (inputText) {
      setInputText('');
      if (!isFocused) toggleSearchBar();
    } else {
      toggleSearchBar();
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    // TODO - update and display search suggestions
  };

  return (
    <OuterWrapper
      style={[
        animatedSlideStyle,
        animatedFocusStyles.wrapper,
        animatedToggleStyles.wrapper
      ]}
    >
      <SearchButtonWrapper
        style={[animatedToggleStyles.button, animatedFocusButtonStyles.button]}
        displayShadow={!isFocused}
      >
        <SearchButton onPress={handleButtonClick}>
          <IconWrapper style={animatedToggleIconStyles.search}>
            <Fontisto name="search" size={25} color={iconColor} />
          </IconWrapper>
          {(!inputText || !isFocused) && (
            <IconWrapper
              style={[
                animatedFocusIconStyles.close,
                animatedToggleIconStyles.close
              ]}
            >
              <AnimatedIonIcon
                name="close"
                size={35}
                color={theme.color.text.primary}
                style={animatedFocusButtonStyles.icon}
              />
            </IconWrapper>
          )}

          <IconWrapper style={animatedFocusIconStyles.erase}>
            <EntypoIcon
              name="erase"
              size={30}
              color={theme.color.text.primary}
            />
          </IconWrapper>
        </SearchButton>
      </SearchButtonWrapper>
      <InputWrapper style={animatedFocusStyles.inputWrapper}>
        <SearchInput
          style={animatedFocusStyles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={handleInputChange}
          value={inputText}
          ref={textInputRef}
        />
      </InputWrapper>
    </OuterWrapper>
  );
};

export default SearchBar;
