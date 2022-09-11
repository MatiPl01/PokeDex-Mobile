import styled, { css } from 'styled-components/native';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { flexCenter } from '@styles/shared';

export const ItemCard = styled.View`
  height: 100%;
  border-radius: 5px;
  flex-direction: row;

  ${({ theme }) => css`
    border: 2px solid ${theme.color.background.secondary};
  `};
`;

export const ImageWrapper = styled.View<{ width: number }>`
  height: 100%;
  border-radius: 5px;
  position: relative;
  width: ${({ width }) => width}px;
  padding: ${({ theme }) => theme.space.md}px;
  ${flexCenter};
`;

export const ItemImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ImageSkeletonWrapper = styled.View<{
  size: number;
}>`
  position: absolute;

  ${({ theme, size }) => css`
    width: ${size - 2 * theme.space.md}px;
    height: ${size - 2 * theme.space.md}px;
  `};
`;

export const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CardColumn = styled.View`
  justify-content: center;
`;

export const ItemName = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.secondary};
    font-size: ${theme.fontSize.body}px;
    font-weight: ${theme.fontWeight.bold};
  `};
`;

export const ItemCostText = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.green.primary};
    font-size: ${theme.fontSize.caption}px;
    font-weight: ${theme.fontWeight.bold};
  `};
`;

export const DollarIcon = styled(FontistoIcon).attrs(({ theme }) => ({
  size: theme.fontSize.caption
}))`
  color: ${({ theme }) => theme.color.green.primary};
`;
