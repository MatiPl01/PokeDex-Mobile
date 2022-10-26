import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { absoluteFill } from '@styles/shared';

export const Wrapper = styled.View`
  flex-direction: row;
  margin: ${({ theme }) => `${theme.space.md}px 0`};
`;

export const MaskedWrapper = styled(MaskedView)`
  ${absoluteFill}
`;

export const ActiveTabBackground = styled(Animated.View)`
  border-radius: 50px;

  ${({ theme }) => css`
    background-color: ${theme.color.accent.secondary ||
    theme.color.text.primary};
    height: ${theme.fontSize.body + 2 * theme.space.md}px;
    margin-left: ${theme.space.md}px;
  `};
`;

export const ActiveTabBackgroundMask = styled(ActiveTabBackground)`
  background-color: transparent;
`;

export const ActiveTabTextMask = styled(ActiveTabBackground)`
  position: absolute;
  z-index: 1;
  background-color: ${({ theme }) => theme.color.background.primary};
`;

export const TabList = styled.FlatList`
  flex-direction: row;
  z-index: 1;
  ${absoluteFill};
`;

export const TabListMask = styled(Animated.View)`
  flex-direction: row;
  padding-left: ${({ theme }) => theme.space.md}px;
`;
