import React, { ComponentType } from 'react';
import { FlatListProps, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  selectCurrentModeThemesList,
  selectCurrentThemeName
} from '@store/theme/theme.selector';
import { ThemeName, ThemeWithName } from '@store/theme/theme.types';
import { ThemeCardsGrid } from './ThemeSelector.styles';
import ThemeCard from './ThemeCard';
import { Separator } from '@components/shared/styled/layout';

type ThemeSelectorProps = {
  listHeaderComponent: JSX.Element;
  onChange: (selectedThemeName: ThemeName) => void;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  listHeaderComponent,
  onChange
}) => {
  const theme = useTheme();
  const themes = useSelector(selectCurrentModeThemesList);
  const currentThemeName = useSelector(selectCurrentThemeName);

  const renderItem: ListRenderItem<ThemeWithName> = ({
    item: { name, theme }
  }) => (
    <ThemeCard
      name={name}
      theme={theme}
      selected={name === currentThemeName}
      onPress={() => onChange(name)}
    />
  );

  const renderSeparator = () => <Separator height={theme.space.md} />;

  return (
    <ThemeCardsGrid<ComponentType<FlatListProps<ThemeWithName>>>
      data={themes}
      keyExtractor={(item: ThemeWithName) => item.name}
      ListHeaderComponent={listHeaderComponent}
      renderItem={renderItem}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: theme.space.xl
      }}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

export default ThemeSelector;
