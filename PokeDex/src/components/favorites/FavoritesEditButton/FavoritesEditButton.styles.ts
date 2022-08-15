import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  SearchButtonWrapper,
  SEARCH_BAR_PADDING_TOP as OFFSET_TOP,
  SEARCH_BAR_HORIZONTAL_PADDING as OFFSET_RIGHT
} from '@components/shared/SearchBar/SearchBar.styles';
import { flexCenter, absoluteFill } from '@styles/shared';

export const ButtonWrapper = styled(SearchButtonWrapper).attrs({
  displayShadow: true
})`
  z-index: 1;
  top: ${OFFSET_TOP}px;
  right: ${OFFSET_RIGHT}px;
`;

export const Icon = styled(MaterialIcon).attrs({
  size: 25
})`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.strong.md};
  `};
`;

export const IconWrapper = styled(Animated.View)`
  ${absoluteFill};
  ${flexCenter};
`;

export {
  SEARCH_ICON_SIZE as BUTTON_SIZE,
  SEARCH_BAR_PADDING_TOP as BUTTON_OFFSET_TOP,
  SEARCH_BAR_HORIZONTAL_PADDING as BUTTON_OFFSET_RIGHT
} from '@components/shared/SearchBar/SearchBar.styles';
