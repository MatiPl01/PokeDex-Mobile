import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDisplayedFavoritePokemonIds } from '@store/favorites/favorites.actions';
import FavoritesGrid from '@components/favorites/FavoritesGrid/FavoritesGrid';
import FavoritesEditButton from '@components/favorites/FavoritesEditButton/FavoritesEditButton';

const FavoritesScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);

  useEffect(() => {
    // Clear displayed favorite Pokemon after favorites screen is unmounted
    return () => {
      dispatch(setDisplayedFavoritePokemonIds([]));
    };
  }, []);

  return (
    <>
      {isEditingEnabled && <FavoritesEditButton onPress={setIsEditing} />}
      <FavoritesGrid
        editable={isEditing}
        setEditingEnabled={(enabled: boolean) => {
          setIsEditingEnabled(enabled);
          if (!enabled) setIsEditing(false);
        }}
      />
    </>
  );
};

export default FavoritesScreen;
