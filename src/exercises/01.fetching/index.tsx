import React, { Suspense, use } from 'react'
import {
	getImageUrlForPokemon,
	getPokemon,
} from './utils.tsx'
import { ErrorBoundary } from 'react-error-boundary'
const pokemonName = 'ditto'

function ErrorFallback({ error }: { error: Error }) {
	return (
		<div className="text-center space-y-4">
			<h2 className="text-2xl font-semibold text-red-600">Error</h2>
			<p className="text-sm text-gray-500">{error.message}</p>
			<p className="text-sm text-gray-500">
				Please try again later or contact support.
			</p>
		</div>
	)	
}
function App() {
	return (
		<div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
			<div className="bg-white shadow-xl rounded-2xl max-w-md w-full">
				<div className="px-6 py-12">
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<Suspense fallback={<PokemonFallback />}>
							<PokemonDetails />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	)
}

const pokemonPromise = getPokemon(pokemonName)
function PokemonDetails() {
	const pokemon = use(pokemonPromise)
	console.log('PokemonDetails', pokemon)
	return (
		<div className="text-center space-y-4">
			<div className="flex justify-center">
				<img
					src={getImageUrlForPokemon(pokemon.name)}
					alt={pokemon.name}
					className="w-64 h-64 object-contain"
				/>
			</div>
			<section>
				<h2 className="text-2xl font-bold capitalize">
					{pokemon.name}
					<sup className="ml-1 text-sm text-gray-500">#{pokemon.id}</sup>
				</h2>
			</section>
			<section>
				{pokemon.abilities.length ? (
					<ul className="space-y-1">
						<li className="font-medium text-gray-700">Abilities:</li>
						{pokemon.abilities.map((t) => (
							<li key={t.ability.name} className="text-sm">
								<span className="capitalize text-gray-900">{t.ability.name}</span>
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-gray-500">
						This Pokémon has no type data.
					</p>
				)}
			</section>
		</div>
	)
}

function PokemonFallback() {
	return (
		<div className="text-center space-y-4 animate-pulse">
			<div className="flex justify-center">
				<img
					src="/img/fallback-ship.png"
					alt={pokemonName}
					className="w-64 h-64 object-contain opacity-50"
				/>
			</div>
			<section>
				<h2 className="text-2xl font-semibold text-gray-400">
					{pokemonName}
					<sup className="ml-1 text-sm text-gray-300">XX</sup>
				</h2>
			</section>
			<section>
				<ul className="space-y-1">
					{Array.from({ length: 2 }).map((_, i) => (
						<li key={i} className="text-sm text-gray-400">
							<span className="font-medium">Loading</span>: <span>...</span>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

export default App
