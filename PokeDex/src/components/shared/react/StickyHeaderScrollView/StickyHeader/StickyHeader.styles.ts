import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const HeaderWrapper = styled(Animated.View)<{ statusBarHeight: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  ${({ theme }) => css`
    background-color: ${theme.color.background.primary};
    padding: ${theme.space.md}px 0;
  `};

  padding-top: ${({ statusBarHeight }) => statusBarHeight}px;
`;

export const TitleWrapper = styled.View`
  ${({ theme }) => css`
    padding: ${theme.space.md}px ${theme.space.sm}px;
  `};
`;

export const TitlePlaceholder = styled.View`
  height: ${({ theme }) => theme.fontSize.h4}px;
`;
