import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { createAnimatedStyles } from '@utils/reanimated';
import { RootState } from '@store';
import {
  addPokemonToFavorites,
  removePokemonFromFavorites
} from '@store/favorites/favorites.actions';
import { selectPokemonIsFavourite } from '@store/favorites/favorites.selector';
import {
  TouchableWrapper,
  HeartIconOutline,
  HeartIconFilled,
  HeartIconEffect
} from './AddToFavoritesButton.styles';

const useAnimatedIconStyles = createAnimatedStyles({
  iconFilled: {
    opacity: [0, 1]
  },
  iconEffect: {
    transform: [{ scale: [1, 1.75] }],
    opacity: [0, 0.75, 0]
  }
});

type AddToFavoritesButtonProps = {
  pokemonId: string;
  size: number;
};

const AddToFavoritesButton: React.FC<AddToFavoritesButtonProps> = ({
  pokemonId,
  size
}) => {
  const dispatch = useDispatch();
  // Data
  const isFavorite = useSelector((rootState: RootState) =>
    selectPokemonIsFavourite(rootState, pokemonId)
  );
  // State
  const [isSelected, setIsSelected] = useState(false);
  // Animated values
  const heartFillAnimationProgress = useSharedValue(0);
  // Animated styles
  const animatedIconStyles = useAnimatedIconStyles(heartFillAnimationProgress);

  useEffect(() => {
    heartFillAnimationProgress.value = withTiming(+isSelected, {
      duration: 250
    });
  }, [isSelected]);

  useEffect(() => {
    setIsSelected(isFavorite);
  }, [isFavorite]);

  const handleButtonPress = () => {
    const newIsSelected = !isSelected;
    if (newIsSelected) dispatch(addPokemonToFavorites(pokemonId));
    else dispatch(removePokemonFromFavorites([pokemonId]));
    setIsSelected(newIsSelected);
  };

  return (
    <TouchableWrapper size={size} onPress={handleButtonPress}>
      <HeartIconOutline size={size} />
      <HeartIconFilled size={size} style={animatedIconStyles.iconFilled} />
      <HeartIconEffect size={size} style={animatedIconStyles.iconEffect} />
    </TouchableWrapper>
  );
};

export default AddToFavoritesButton;
