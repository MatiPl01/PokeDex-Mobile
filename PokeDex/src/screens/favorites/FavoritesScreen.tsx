import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFavoritePokemonIdsList } from '@store/favorites/favorites.selector';
import { fetchPokemonBatchByIdsAsync } from '@store/pokemon/pokemon.actions';
import { selectPokemonStateListByIds } from '@store/pokemon/pokemon.selector';
import { RootState } from '@store';
import FavoritePokemonCard from '@components/pokemon/FavoritePokemonCard/FavoritePokemonCard';
import SortableGrid from '@components/shared/SortableGrid/SortableGrid';
import LoadingSpinner from '@components/shared/LoadingSpinner/LoadingSpinner';

const FavoritesScreen: React.FC = () => {
  const dispatch = useDispatch();
  const favoritesIds = useSelector(selectFavoritePokemonIdsList);
  const favoritePokemonStates = useSelector((rootState: RootState) =>
    selectPokemonStateListByIds(rootState, favoritesIds)
  );

  useEffect(() => {
    console.log({ favoritesIds });

    if (favoritesIds) dispatch(fetchPokemonBatchByIdsAsync(favoritesIds, false));
  }, [favoritesIds]);

  if (favoritePokemonStates.length < favoritesIds.length) {
    return <LoadingSpinner />;
  }

  return (
    <SortableGrid>
      {favoritePokemonStates.map(({ id, pokemon, isLoading }) => (
        <FavoritePokemonCard key={id} pokemon={pokemon} isLoading={isLoading} />
      ))}
    </SortableGrid>
  );
};

export default FavoritesScreen;
