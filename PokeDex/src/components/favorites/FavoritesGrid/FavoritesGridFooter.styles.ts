import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { SIZE } from '@constants';
import { flexCenter } from '@styles/shared';

export const FooterWrapper = styled(Animated.View)`
  height: ${SIZE.SCREEN.HEIGHT / 4}px;
  ${flexCenter};
`;

export const FooterLoaderWrapper = styled.View`
  height: ${({ theme }) => 2 * theme.size.lg}px;
`;

export const FooterText = styled.Text`
  text-align: center;
  max-width: ${0.9 * SIZE.SCREEN.WIDTH}px;
  width: 100%;

  // TODO - code the same as below is repeated in multiple components. Refactor this code.
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-weight: ${theme.fontWeight.medium};
    line-height: ${theme.lineHeight.title}px;
    font-size: ${theme.fontSize.title}px;
  `}
`;
