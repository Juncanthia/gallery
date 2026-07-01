import { PokemonImage } from "@/components/marketing-blocks/gooseui/complex-component/components/pokemon-image"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      <PokemonImage name="Bulbasaur" number={1} />
      <PokemonImage name="Charmander" number={4} />
      <PokemonImage name="Squirtle" number={7} />
    </div>
  )
}
