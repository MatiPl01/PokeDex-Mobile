import styled, { css } from 'styled-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { AbsoluteRoundButtonWrapper } from '@components/shared/styled/buttons';

export const ButtonWrapper = styled(AbsoluteRoundButtonWrapper)`
  /* z-index: 1; */

  ${({ theme }) => css`
    top: ${theme.space.lg}px;
    right: ${theme.space.lg}px;
  `};
`;

export const Icon = styled(MaterialIcon).attrs({
  size: 25
})`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.strong.md};
  `};
`;
