export const pokemonNameDefault = "squirtle";
export type Pokemon = {
  name: string;
  id: number;
  image: string; // Optional image URL for the Pokémon
  abilities: Array<{
    slot: number;
    ability: {
      name: string;
      url: string;
    };
  }>;
};

export type PokemonSearch = Array<Pokemon>;

const pokemonCache = new Map<string, Promise<Pokemon>>();
export function getPokemon(name: string, delay?: number): Promise<Pokemon> {
  const pokemonPromise = pokemonCache.get(name) ?? getPokemonImpl(name, delay);
  pokemonCache.set(name, pokemonPromise);
  return pokemonPromise;
}

// https://pokeapi.co/api/v2/pokemon/
async function getPokemonImpl(name: string, delay?: number): Promise<Pokemon> {
  const param = new URLSearchParams({ q: name });
  if (delay) {
    param.set("delay", delay.toString());
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}?${param.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
  }
  const data: Pokemon = await response.json();
  return data;
}

const nowAPI = Date.now();
export function getImageUrlForPokemon(pokemonName: string, now?: number): string {
  // Replace this with a third-party sprite service or fallback to the default one
  const time = now ?? nowAPI
  const sanitized = pokemonName.toLowerCase().replace(/\s+/g, "-");
  return `https://img.pokemondb.net/artwork/large/${sanitized}.jpg?ts=${time}`;
}

const filterCache = new Map<string, Promise<PokemonSearch>>();
export function filterPokemons(query: string, delay?: number): Promise<PokemonSearch> {
  const filterPromise = filterCache.get(query) ?? filterPokemonsImpl(query, delay);
  filterCache.set(query, filterPromise);
  return filterPromise;
}

// https://pokeapi.co/api/v2/pokemon?limit=1000
async function filterPokemonsImpl(query: string, delay?: number): Promise<PokemonSearch> {
  const param = new URLSearchParams({ q: query });
  if (delay) {
    param.set("delay", delay.toString());
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&${param.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
  }
  const data = await response.json();

  return (data.results as PokemonSearch).filter(pokemon => {
    pokemon.image = `/img/pokemon/${pokemon.name}.jpg`;
    return pokemon.name.includes(query.toLowerCase());
  });

}

const imageCache = new Map<string, Promise<string>>();
export function getImage(src: string): Promise<string> {
  const imagePromise = imageCache.get(src) ?? preloadImage(src);
  imageCache.set(src, imagePromise);
  return imagePromise;
}

function preloadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src)
    img.onerror = reject
  });
}