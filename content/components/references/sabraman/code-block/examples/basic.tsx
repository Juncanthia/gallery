import { LegacyCodeBlockCommand } from "@/components/_internal/sabraman"

export default function Demo() {
  return (
    <div className="w-full max-w-xl">
      <LegacyCodeBlockCommand
        bun="bun add react react-dom"
        npm="npm install react react-dom"
        pnpm="pnpm add react react-dom"
        yarn="yarn add react react-dom"
      />
    </div>
  )
}
