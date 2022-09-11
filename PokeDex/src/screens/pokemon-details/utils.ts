import { API } from '@constants';
import { PokemonStatName } from '@store/pokemon/pokemon.types';

const { POKEMON } = API;

export const MAX_STAT_VALUES: Record<PokemonStatName, number> = {
  hp: POKEMON.MAX_HP,
  attack: POKEMON.MAX_ATTACK,
  defense: POKEMON.MAX_DEFENSE,
  specialAttack: POKEMON.MAX_SPECIAL_ATTACK,
  specialDefense: POKEMON.MAX_SPECIAL_DEFENSE,
  speed: POKEMON.MAX_SPEED
};
