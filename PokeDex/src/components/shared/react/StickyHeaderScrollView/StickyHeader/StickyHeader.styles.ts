import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const HeaderWrapper = styled.View<{ statusBarHeight: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  ${({ theme }) => css`
    background-color: ${theme.color.background.primary};
    padding: ${theme.space.md}px;
  `};

  padding-top: ${({ statusBarHeight }) => statusBarHeight}px;
`;

export const TitleWrapper = styled.View`
  ${({ theme }) => css`
    padding: ${theme.space.md}px ${theme.space.sm}px;
  `};
`;

export const Title = styled(Animated.Text)`
  position: absolute;

  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-weight: ${theme.fontWeight.bold};
  `}
`;

export const TitlePlaceholder = styled.View`
  height: ${({ theme }) => theme.fontSize.h4}px;
`;
