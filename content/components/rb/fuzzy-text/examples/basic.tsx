import { FuzzyText } from "@/components/ui/fuzzy-text"

export default function FuzzyTextBasicExample() {
  return (
    <div className="bg-black p-8">
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5}>
        Fuzzy Text
      </FuzzyText>
    </div>
  )
}
