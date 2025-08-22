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
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
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

// https://pokeapi.co/api/v2/pokemon?limit=1000
export function filterPokemons(query: string): PokemonSearch {
  const pokemons: PokemonSearch = [
    { name: "bulbasaur", id: 1, image: "/img/pokemon/bulbasaur.jpg", abilities: [] },
    { name: "ivysaur", id: 2, image: "/img/pokemon/ivysaur.jpg", abilities: [] },
    { name: "venusaur", id: 3, image: "/img/pokemon/venusaur.jpg", abilities: [] },
    { name: "charmander", id: 4, image: "/img/pokemon/charmander.jpg", abilities: [] },
    { name: "charmeleon", id: 5, image: "/img/pokemon/charmeleon.jpg", abilities: [] },
    { name: "charizard", id: 6, image: "/img/pokemon/charizard.jpg", abilities: [] },
    { name: "charizard", id: 7, image: "/img/pokemon/karate.jpg", abilities: [] },
    { name: "charizard", id: 8, image: "/img/pokemon/ninjutsu.jpg", abilities: [] },
    // Add more Pokémon as needed
  ];

  return pokemons.filter(pokemon => pokemon.name.includes(query.toLowerCase()));
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