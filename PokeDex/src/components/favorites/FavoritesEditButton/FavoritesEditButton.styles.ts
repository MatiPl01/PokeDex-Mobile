import styled, { css } from 'styled-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { AbsoluteRoundButtonWrapper } from '@components/shared/styled/buttons';

export const ButtonWrapper = styled(AbsoluteRoundButtonWrapper).attrs(
  ({ theme }) => ({ size: theme.size.lg })
)``;

export const Icon = styled(MaterialIcon).attrs({
  size: 25
})`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.box.strong.md};
  `};
`;
