import { combineReducers } from 'redux';
import themeReducer from './theme/theme.reducer';
import pokemonReducer from './pokemon/pokemon.reducer';

const rootReducer = combineReducers({
  theme: themeReducer,
  pokemon: pokemonReducer
});

export default rootReducer;
