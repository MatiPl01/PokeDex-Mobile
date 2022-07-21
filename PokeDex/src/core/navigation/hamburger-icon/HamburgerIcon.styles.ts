import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export const AnimatedButton = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const TouchableWrapper = styled(TouchableWithoutFeedback)`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

export const AnimatedBar = styled(Animated.View)`
  width: 100%;
  height: 3px;
  border-radius: 5px;
  background-color: white;
  ${({ theme }) => theme.shadow.strong.md};
`;
