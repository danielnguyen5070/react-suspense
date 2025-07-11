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

const pokemonCache = new Map<string, Promise<Pokemon>>();
export function getPokemon(name: string, delay?: number): Promise<Pokemon> {
  const pokemonPromise = pokemonCache.get(name) ?? fetchPokemon(name, delay);
  pokemonCache.set(name, pokemonPromise);
  return pokemonPromise;
}

export async function fetchPokemon(
  name: string,
  delay?: number
): Promise<Pokemon> {
  if (delay) await new Promise((res) => setTimeout(res, delay));

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
  );
  if (!response.ok) {
    const message = await response.text();
    return Promise.reject(new Error(`Failed to fetch Pokémon: ${message}`));
  }

  const pokemon = await response.json();
  pokemon.image = getImageUrlForPokemon(pokemon.name);
  return pokemon as Pokemon;
}

const now = Date.now();
export function getImageUrlForPokemon(pokemonName: string): string {
  // Replace this with a third-party sprite service or fallback to the default one
  const sanitized = pokemonName.toLowerCase().replace(/\s+/g, "-");
  return `https://img.pokemondb.net/artwork/large/${sanitized}.jpg?ts=${now}`;
}

const imageCache = new Map<string, Promise<string>>();

export function getImage(url: string): Promise<string> {
  const cachedImage = imageCache.get(url) ?? preloadImage(url);
  imageCache.set(url, cachedImage);
  return cachedImage;
}

function preloadImage(url: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url); // Resolve with the image URL when loaded
    img.onerror = reject; // Resolve even if the image fails to load
  });
}
