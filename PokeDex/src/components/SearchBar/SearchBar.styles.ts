import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { flexCenter } from '@styles/shared';
import { SCREEN_WIDTH } from '@core/splash-screen/SplashScreen';

export const SEARCH_ICON_SIZE = 65;
export const SEARCH_BAR_HEIGHT = 45;
export const FOCUSED_SEARCH_BAR_HEIGHT = 60;
export const SEARCH_BAR_PADDING_TOP = 15;
export const SEARCH_BAR_HORIZONTAL_PADDING = 20;
export const SEARCH_WRAPPER_WIDTH =
  SCREEN_WIDTH - 2 * SEARCH_BAR_HORIZONTAL_PADDING;

export const OuterWrapper = styled(Animated.View)`
  position: absolute;
  height: ${SEARCH_ICON_SIZE}px;
  width: 0;
  z-index: 1;
`;

export const SearchButton = styled(TouchableWithoutFeedback)`
  height: 100%;
  width: 100%;
`;

export const IconWrapper = styled(Animated.View)`
  position: absolute;
  height: 100%;
  width: 100%;
  ${flexCenter};
`;

export const InputWrapper = styled(Animated.View)`
  z-index: -1;
  width: 100%;
  overflow: hidden;
`;

const StyledTextInput = styled.TextInput`
  padding: 0 ${SEARCH_ICON_SIZE - 10}px 0 10px;
  height: 100%;
  font-size: ${({ theme }) => theme.fontSize.title};
  /* TODO - maybe think of better theme structure (use something else than theme.color.text) for border color */
  border: 1px solid ${({ theme }) => theme.color.text.tertiary};
  color: ${({ theme }) => theme.color.text.primary};
  background-color: ${({ theme }) => theme.color.background.primary};
  ${({ theme }) => theme.shadow.soft.sm};
`;

export const SearchInput = Animated.createAnimatedComponent(StyledTextInput);

export const SearchButtonWrapper = styled(Animated.View)<{
  displayShadow?: boolean;
}>`
  position: absolute;
  width: ${SEARCH_ICON_SIZE}px;
  height: ${SEARCH_ICON_SIZE}px;
  right: 0;
  border-radius: ${SEARCH_ICON_SIZE}px;
  ${({ theme, displayShadow }) => displayShadow && theme.shadow.medium.md};
`;
