import styled, { css } from 'styled-components/native';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { SIZE } from '@constants';
import { hexToRGBAlphaCSS } from '@utils/colors';
import { absoluteFill } from '@styles/shared';

export const OuterWrapper = styled(Animated.View)`
  flex: 1;
  background-color: ${({ theme }) => hexToRGBAlphaCSS(theme.color.black, 0.85)};
`;

export const ContentWrapper = styled.View<{ top: number }>`
  ${absoluteFill};
  top: ${({ top }) => top}px;
  bottom: ${({ theme }) => theme.space.lg}px;
`;

export const ImageList = styled.FlatList``;

export const ImageWrapper = styled.View`
  width: ${SIZE.SCREEN.WIDTH}px;
  height: ${SIZE.SCREEN.HEIGHT}px;
`;

export const CloseButton = styled(Animated.createAnimatedComponent(Pressable))`
  position: absolute;
  z-index: 1;

  ${({ theme }) => css`
    top: ${theme.space.lg}px;
    right: ${theme.space.lg}px;
  `};
`;

export const CloseIcon = styled(AntDesignIcon).attrs(({ theme }) => ({
  name: 'close',
  size: theme.size.sm
}))`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.box.strong.lg};
  `}
`;
