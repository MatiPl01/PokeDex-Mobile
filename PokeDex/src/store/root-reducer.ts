import { combineReducers } from 'redux';
import themeReducer from './theme/theme.reducer';
import searchReducer from './search/search.reducer';
import pokemonReducer from './pokemon/pokemon.reducer';

const rootReducer = combineReducers({
  theme: themeReducer,
  search: searchReducer,
  pokemon: pokemonReducer
});

export default rootReducer;
