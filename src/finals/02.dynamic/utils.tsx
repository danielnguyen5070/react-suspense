export type Pokemon = {
	name: string
	id: number
	abilities: Array<{
		slot: number
		ability: {
			name: string
			url: string
		}
	}>
}

const pokemonCache = new Map<string, Promise<Pokemon>>()
export function getPokemon(name: string, delay?: number): Promise<Pokemon> {
	const pokemonPromise = pokemonCache.get(name) ?? fetchPokemon(name, delay)
	pokemonCache.set(name, pokemonPromise)
	return pokemonPromise
}

function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result)
			} else {
				reject(new Error('Failed to convert image to base64'))
			}
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

export type CreatedPokemon = {
	name: string
	image: string // We'll convert the File into a base64 string
}
export async function createPokemon(formData: FormData, delay?: number, failed?: boolean): Promise<CreatedPokemon> {
	if (delay) await new Promise((res) => setTimeout(res, delay))
	const name = formData.get('name') as string
	const imageFile = formData.get('image') as File | null
	if (!name || !imageFile) throw new Error('Missing name or image')
	
	const image = await fileToBase64(imageFile)
	if (failed) return Promise.reject(new Error('Failed to create Pokémon'))
	const newPokemon: CreatedPokemon = { name, image }
	return newPokemon
}
export async function fetchPokemon(name: string, delay?: number): Promise<Pokemon> {
	if (delay) await new Promise((res) => setTimeout(res, delay))

	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
	if (!response.ok) {
		const message = await response.text()
		return Promise.reject(new Error(`Failed to fetch Pokémon: ${message}`))
	}

	const pokemon = await response.json()
	return pokemon as Pokemon
}

export function getImageUrlForPokemon(
	pokemonName: string
): string {
	// Replace this with a third-party sprite service or fallback to the default one
	const sanitized = pokemonName.toLowerCase().replace(/\s+/g, '-')
	return `https://img.pokemondb.net/artwork/large/${sanitized}.jpg`
}
