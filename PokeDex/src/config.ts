const API_URL = 'https://pokeapi.co/api/v2/';
const FETCH_POKEMON_LIMIT = 10;

const config = {
  INITIAL_POKEMON_FETCH_URL: `${API_URL}/pokemon?offset=0&limit=${FETCH_POKEMON_LIMIT}`
};

export default config;
