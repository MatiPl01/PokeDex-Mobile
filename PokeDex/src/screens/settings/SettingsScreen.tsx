import React from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeName, ThemeMode } from '@store/theme/theme.types';
import { setThemeName, setThemeMode } from '@store/theme/theme.actions';
import { catchAsync } from '@utils/errors';
import {
  SettingsRow,
  SettingsSection,
  SectionSeparator,
  ColumnSeparator,
  SectionHeading,
  SectionSubheading,
  SettingsText,
  SettingsWrapper
} from './SettingsScreen.styles';
import DayNightSwitch from '@components/settings/DayNightSwitch/DayNightSwitch';
import ThemeSelector from '@components/settings/ThemeSelector/ThemeSelector';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();

  const saveThemeMode = catchAsync(async (themeMode: ThemeMode) => {
    await AsyncStorage.setItem('@theme-mode', themeMode);
  });

  const saveThemeName = catchAsync(async (themeName: ThemeName) => {
    await AsyncStorage.setItem('@theme-name', themeName);
  });

  const switchThemeMode = (newThemeMode: ThemeMode) => {
    dispatch(setThemeMode(newThemeMode));
    saveThemeMode(newThemeMode);
  };

  const changeTheme = (newThemeName: ThemeName) => {
    dispatch(setThemeName(newThemeName));
    saveThemeName(newThemeName);
  };

  return (
    <SettingsWrapper>
      <ThemeSelector
        onChange={changeTheme}
        listHeaderComponent={
          <>
            <SettingsSection>
              <SectionHeading>Theme mode</SectionHeading>
              <SettingsRow>
                <DayNightSwitch onChange={switchThemeMode} />
                <ColumnSeparator />
                <SettingsText>Light / Dark mode</SettingsText>
              </SettingsRow>
            </SettingsSection>
            <SectionSeparator />
            <SettingsSection>
              <SectionHeading>Theme colors</SectionHeading>
              <SectionSubheading>
                Select a theme to personalize app appearance
              </SectionSubheading>
            </SettingsSection>
          </>
        }
      />
    </SettingsWrapper>
  );
};

export default SettingsScreen;
