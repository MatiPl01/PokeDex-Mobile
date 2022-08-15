import React, { useState } from 'react';
import FavoritesGrid from '@components/favorites/FavoritesGrid/FavoritesGrid';
import FavoritesEditButton from '@components/favorites/FavoritesEditButton/FavoritesEditButton';

const FavoritesScreen: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <FavoritesEditButton onPress={setIsEditing} />
      <FavoritesGrid editable={isEditing} />
    </>
  );
};

export default FavoritesScreen;
