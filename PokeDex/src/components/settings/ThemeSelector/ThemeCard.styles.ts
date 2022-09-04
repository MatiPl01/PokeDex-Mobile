import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableWrapper } from '@components/shared/styled/buttons';
import { CardTitle as DefaultCardTitle } from '@components/shared/styled/cards';
import { Separator } from '@components/shared/styled/layout';
import { absoluteFill } from '@styles/shared';

export const CardSelectionWrapper = styled.View<{
  width: number;
  gap: number;
  selected?: boolean;
}>`
  border-radius: 5px;
  margin-right: ${({ gap }) => gap}px;
  width: ${({ width }) => width}px;

  ${({ theme, selected }) => css`
    padding: ${theme.space.sm}px;
    /* TODO - change this selection outline color */
    background-color: ${selected ? theme.color.text.primary : 'transparent'};
  `};
`;

export const CardWrapper = styled(TouchableWrapper)`
  height: auto;
  border-radius: 5px;
  overflow: hidden;
  align-items: stretch;
`;

export const CardTitle = styled(DefaultCardTitle)<{ color: string }>`
  color: ${({ color }) => color};

  ${({ theme }) => css`
    font-size: ${theme.fontSize.body}px;
    padding-top: ${theme.space.sm}px;
  `};
`;

export const CardHeader = styled.View<{ backgroundColor: string }>`
  ${({ theme, backgroundColor }) => css`
    padding: ${theme.space.sm}px ${theme.space.lg}px;
    background-color: ${backgroundColor};
  `};
`;

export const CardBody = styled.View`
  position: relative;

  ${({ theme }) => css`
    padding: ${theme.space.lg}px ${theme.space.md}px;
  `};
`;

export const CardRow = styled.View`
  flex-direction: row;
  padding-bottom: ${({ theme }) => theme.space.sm}px;
`;

export const RowItemsSeparator = styled(Separator).attrs(({ theme }) => ({
  width: theme.space.sm
}))``;

export const RowsSeparator = styled(Separator).attrs(({ theme }) => ({
  height: theme.space.md
}))``;

export const CardBar = styled.View<{ color: string; width: number }>`
  border-radius: 5px;
  background-color: ${({ color }) => color};
  width: ${({ width }) => width}px;

  ${({ theme }) => css`
    height: ${theme.fontSize.caption}px;
    ${theme.shadow.box.soft.sm};
  `};
`;

export const BackgroundGradient = styled(LinearGradient).attrs(() => ({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
}))`
  ${absoluteFill};
`;
