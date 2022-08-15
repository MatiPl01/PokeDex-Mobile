import styled from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { relativeFill, flexCenter } from '@styles/shared';

export const Separator = styled.View<{ height?: number; width?: number }>`
  height: ${({ height }) => height || 0}px;
  width: ${({ width }) => width || 0}px;
`;

export const TouchableWrapper = styled(TouchableWithoutFeedback)`
  ${relativeFill}
  ${flexCenter};
`;
