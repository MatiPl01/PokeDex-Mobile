import React from 'react';
import { DefaultTheme, useTheme } from 'styled-components';
import { SIZE } from '@constants';
import { ThemeName } from '@store/theme/theme.types';
import {
  CardHeader,
  CardWrapper,
  CardTitle,
  CardBody,
  CardBar,
  CardRow,
  RowItemsSeparator,
  BackgroundGradient,
  RowsSeparator,
  CardSelectionWrapper
} from './ThemeCard.styles';

type ThemeCardProps = {
  name: ThemeName;
  theme: DefaultTheme;
  onPress?: (themeName: ThemeName) => void;
  selected?: boolean;
};

const ThemeCard: React.FC<ThemeCardProps> = ({
  name,
  theme,
  selected,
  onPress
}) => {
  const currentTheme = useTheme();
  const GAP = currentTheme.space.lg;
  const CARD_WIDTH = (SIZE.SCREEN.WIDTH - 2 * currentTheme.space.lg - GAP) / 2;
  const BACKGROUND_COLORS = theme.color.background;

  return (
    <CardSelectionWrapper gap={GAP} width={CARD_WIDTH} selected={selected}>
      <CardWrapper onPress={onPress && (() => onPress(name))}>
        <CardHeader backgroundColor={theme.color.accent.primary}>
          <CardTitle color={theme.color.text.primary}>{name}</CardTitle>
        </CardHeader>
        <CardBody>
          <BackgroundGradient
            colors={[
              BACKGROUND_COLORS.primary,
              BACKGROUND_COLORS.primary,
              BACKGROUND_COLORS.secondary,
              BACKGROUND_COLORS.tertiary
            ]}
          />
          <CardRow>
            <CardBar color={theme.color.text.primary} width={theme.size.lg} />
            <RowItemsSeparator />
            <CardBar color={theme.color.text.primary} width={theme.size.md} />
          </CardRow>
          <CardRow>
            <CardBar color={theme.color.text.secondary} width={theme.size.md} />
            <RowItemsSeparator />
            <CardBar color={theme.color.text.secondary} width={theme.size.sm} />
          </CardRow>
          <CardRow>
            <CardBar color={theme.color.text.tertiary} width={theme.size.sm} />
            <RowItemsSeparator />
            <CardBar color={theme.color.text.tertiary} width={theme.size.xs} />
          </CardRow>
          <RowsSeparator />
          <CardBar color={theme.color.accent.primary} width={theme.size.md} />
        </CardBody>
      </CardWrapper>
    </CardSelectionWrapper>
  );
};

export default React.memo(ThemeCard);
