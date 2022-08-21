import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { absoluteFill, flexCenter } from '@styles/shared';

export const SwitchWrapper = styled(TouchableWithoutFeedback)`
  position: relative;

  ${({ theme }) => css`
    width: ${theme.size.xl}px;
    height: ${theme.size.sm + 2 * theme.space.xs}px;
    padding: ${theme.space.xs}px;
    border-radius: ${theme.size.sm}px;
    ${theme.shadow.box.soft.sm};
  `};
`;

export const GradientsWrapper = styled.View`
  ${absoluteFill};
  border-radius: ${({ theme }) => theme.size.sm}px;
  overflow: hidden;
`;

export const SwitchGradient = styled(
  Animated.createAnimatedComponent(LinearGradient)
).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 }
})`
  ${absoluteFill};
`;

export const SwitchThumb = styled(Animated.View)`
  position: absolute;

  ${({ theme }) => css`
    top: ${theme.space.xs}px;
    left: ${theme.space.xs}px;
    width: ${theme.size.sm}px;
    height: ${theme.size.sm}px;
    border-radius: ${theme.size.sm}px;
    background-color: ${theme.color.white};
    ${theme.shadow.box.medium.sm};
  `};
`;

const ThumbIcon = styled(FeatherIcon).attrs(({ theme }) => ({
  size: theme.size.xs
}))`
  ${({ theme }) => theme.shadow.text.soft.md}
`;

export const SunIcon = styled(ThumbIcon).attrs({
  name: 'sun'
})`
  color: ${({ theme }) => theme.color.dayNightSwitch.day.secondary};
`;

export const MoonIcon = styled(ThumbIcon).attrs({
  name: 'moon'
})`
  color: ${({ theme }) => theme.color.dayNightSwitch.night.primary};
`;

export const SwitchTextWrapper = styled(Animated.View)`
  position: absolute;
  height: 100%;
  ${flexCenter};
`;

export const SwitchText = styled.Text`
  text-transform: uppercase;

  ${({ theme }) => css`
    font-weight: ${theme.fontWeight.bold};
    font-size: ${theme.fontSize.button}px;
    color: ${theme.color.white};
  `};
`;
