import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
import { relativeFill } from '@styles/shared';

export const ThumbnailWrapper = styled(Animated.View)<{ size: number }>`
  ${({ theme, size }) => css`
    width: ${size}px;
    height: ${size}px;
    border: ${theme.space.sm}px solid ${theme.color.accent.primary};
    background-color: ${theme.color.background.primary};
    border-radius: ${theme.space.md}px;
    ${theme.shadow.box.medium.sm};
  `}
`;

export const ImageWrapper = styled(Animated.View)`
  ${relativeFill};
`;
