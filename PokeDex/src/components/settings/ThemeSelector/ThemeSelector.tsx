import React, { ComponentType } from 'react';
import { FlatListProps, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectCurrentModeThemesList,
  selectCurrentThemeName
} from '@store/theme/theme.selector';
import { ThemeName, ThemeWithName } from '@store/theme/theme.types';
import { ThemeCardsGrid } from './ThemeSelector.styles';
import ThemeCard from './ThemeCard';

type ThemeSelectorProps = {
  onChange: (selectedThemeName: ThemeName) => void;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onChange }) => {
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

  return (
    <ThemeCardsGrid<ComponentType<FlatListProps<ThemeWithName>>>
      data={themes}
      keyExtractor={(item: ThemeWithName) => item.name}
      renderItem={renderItem}
      numColumns={2}
    />
  );
};

export default ThemeSelector;
