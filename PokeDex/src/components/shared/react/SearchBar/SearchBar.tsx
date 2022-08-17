import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useTheme } from 'styled-components';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
// TODO - debug this app on an actual device and calculate the number of suggestions based on the available space after the keyboard is displayed
// import { useKeyboard } from '@react-native-community/hooks';
import { SCREEN, ANIMATION } from '@constants';
import { createAnimatedStyle, createAnimatedStyles } from '@utils/reanimated';
import { SearchItem, SearchSuggestionItem } from '@utils/search';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  OuterWrapper,
  InputWrapper,
  SearchButtonWrapper,
  IconWrapper,
  SearchInput
} from './SearchBar.styles';
import SearchSuggestions from './SearchSuggestions';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SEARCH_BUTTON_ANIMATION_DELAY = ANIMATION.DELAY.MENU_TOGGLE + 250;
const AnimatedIonIcon = Animated.createAnimatedComponent(IonIcon);

const useAnimatedSlideStyle = createAnimatedStyle({
  transform: [{ translateX: [-100, 0] }]
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

type SearchBarProps = {
  data: SearchItem[];
  onSearchSubmit: (items: SearchItem[]) => void;
  suggestionsLimit?: number;
  showSuggestions?: boolean;
  onSearchChange?: (value: string) => void;
  onSearchBarOpen?: () => void;
  onSearchBarClose?: () => void;
  onSearchFetchRequest?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  data,
  suggestionsLimit,
  showSuggestions,
  onSearchChange,
  onSearchSubmit,
  onSearchBarOpen,
  onSearchBarClose,
  onSearchFetchRequest
}) => {
  const theme = useTheme();
  const ICON_COLOR = theme.color.white;
  const SEARCH_BAR_HEIGHT = theme.size.md;
  const FOCUSED_SEARCH_BAR_HEIGHT = theme.size.lg;
  const SEARCH_BUTTON_SIZE = theme.size.lg;
  const SEARCH_BAR_PADDING_X = theme.space.lg;
  const SEARCH_BAR_PADDING_TOP = theme.space.lg;
  const SEARCH_WRAPPER_WIDTH = SCREEN.WIDTH - 2 * SEARCH_BAR_PADDING_X;
  // Component state
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [displayEraseIcon, setDisplayEraseIcon] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchSuggestionItem[]
  >([]);
  const [focusStylesEnabled, setFocusStylesEnabled] = useState(false);
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
  const animatedToggleIconStyles =
    useAnimatedToggleIconStyles(toggleIconProgress);
  const animatedFocusIconStyles = useAnimatedInputIconStyles(inputIconProgress);

  const animatedFocusStyles = createAnimatedStyles({
    wrapper: {
      width: [SEARCH_WRAPPER_WIDTH, SCREEN.WIDTH],
      left: [SEARCH_BAR_PADDING_X, 0],
      top: [SEARCH_BAR_PADDING_TOP, 0],
      paddingTop: [(SEARCH_BUTTON_SIZE - SEARCH_BAR_HEIGHT) / 2, 0],
      paddingRight: [SEARCH_BUTTON_SIZE / 2, 0]
    },
    inputWrapper: {
      height: [SEARCH_BAR_HEIGHT, FOCUSED_SEARCH_BAR_HEIGHT]
    },
    input: {
      borderRadius: [5, 0]
    }
  })(focusProgress);

  const animatedToggleStyles = createAnimatedStyles({
    wrapper: {
      width: [0, SEARCH_WRAPPER_WIDTH]
    },
    button: {
      right: [-SEARCH_BUTTON_SIZE / 2, 0]
    }
  })(toggleProgress);

  const animatedFocusButtonStyles = createAnimatedStyles({
    button: {
      backgroundColor: [theme.color.accent.primary, 'transparent']
    },
    icon: {
      color: [ICON_COLOR, theme.color.text.primary]
    }
  })(focusProgress);

  useEffect(() => {
    slideProgress.value = withDelay(
      SEARCH_BUTTON_ANIMATION_DELAY,
      withTiming(1, { duration: ANIMATION.DURATION.MENU_TOGGLE })
    );
  }, []);

  useEffect(() => {
    toggleProgress.value = withTiming(+isOpen, {
      duration: 500,
      easing: Easing.bezier(0.6, 0, 0.3, 1)
    });
    toggleIconProgress.value = withTiming(+isOpen, {
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
    if (!isOpen) {
      textInputRef.current?.blur();
      setIsFocused(false);
    }
    if (isOpen && !focusStylesEnabled) setFocusStylesEnabled(true);
  }, [isOpen]);

  useEffect(() => {
    animateOnFocusChange();
  }, [isFocused]);

  useEffect(() => {
    setDisplayEraseIcon(Boolean(searchValue) && isFocused);
  }, [searchValue, isFocused]);

  useEffect(() => {
    animateEraseIcon();
  }, [displayEraseIcon]);

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
    if (searchValue) {
      setSearchValue('');
      if (!isFocused) toggleSearchBar();
    } else {
      toggleSearchBar();
    }
  };

  const toggleSearchBar = () => {
    if (isOpen) {
      if (onSearchBarClose) onSearchBarClose();
    } else {
      if (onSearchBarOpen) onSearchBarOpen();
    }
    setIsOpen(!isOpen);
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (onSearchChange) onSearchChange(value);
  };

  const handleSuggestionsChange = (items: SearchSuggestionItem[]) => {
    setSearchSuggestions(items);
  };

  const handleSuggestionSelect = (item: SearchItem) => {
    setSearchValue(item.value);
    onSearchSubmit([item]);
  };

  const handleSubmit = () => {
    onSearchSubmit(searchSuggestions.map(({ item }) => item));
  };

  return (
    <OuterWrapper
      style={[
        animatedSlideStyle,
        animatedToggleStyles.wrapper,
        focusStylesEnabled && animatedFocusStyles.wrapper
      ]}
    >
      <SearchButtonWrapper
        style={[
          animatedToggleStyles.button,
          focusStylesEnabled && animatedFocusButtonStyles.button
        ]}
        shadowed={!isFocused}
        onPress={handleButtonClick}
      >
        <IconWrapper style={animatedToggleIconStyles.search}>
          <FontistoIcon name="search" size={25} color={ICON_COLOR} />
        </IconWrapper>
        <IconWrapper
          style={[
            animatedToggleIconStyles.close,
            focusStylesEnabled && animatedFocusIconStyles.close
          ]}
        >
          <AnimatedIonIcon
            name="close"
            size={35}
            color={theme.color.text.primary}
            style={focusStylesEnabled && animatedFocusButtonStyles.icon}
          />
        </IconWrapper>

        <IconWrapper
          style={focusStylesEnabled && animatedFocusIconStyles.erase}
        >
          <EntypoIcon name="erase" size={30} color={theme.color.text.primary} />
        </IconWrapper>
      </SearchButtonWrapper>
      <InputWrapper
        style={focusStylesEnabled && animatedFocusStyles.inputWrapper}
      >
        <SearchInput
          style={animatedFocusStyles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)} // TODO - maybe need a fix in Android (seems to be closing the suggestions bar after pressing outside the textInput)
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          value={searchValue}
          ref={textInputRef}
        />
      </InputWrapper>

      {showSuggestions && (
        <SearchSuggestions
          data={data}
          searchValue={searchValue}
          isRevealed={isFocused && Boolean(searchValue)}
          limit={suggestionsLimit}
          onSelect={handleSuggestionSelect}
          onSuggestionsChange={handleSuggestionsChange}
          onSearchFetchRequest={onSearchFetchRequest}
        />
      )}
    </OuterWrapper>
  );
};

export default SearchBar;
