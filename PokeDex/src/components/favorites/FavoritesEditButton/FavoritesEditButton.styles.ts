import styled, { css } from 'styled-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { relativeFill } from '@styles/shared';
import { AbsoluteRoundButtonWrapper } from '@components/shared/styled/buttons';

export const ButtonWrapper = styled(AbsoluteRoundButtonWrapper).attrs(
  ({ theme }) => ({ size: theme.size.lg })
)`
  ${({ theme }) => css`
    top: ${theme.space.lg}px;
    right: ${theme.space.lg}px;
  `};
`;

export const IconsWrapper = styled.View`
  ${relativeFill};
`;

export const Icon = styled(MaterialIcon).attrs({
  size: 25
})`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.strong.md};
  `};
`;
