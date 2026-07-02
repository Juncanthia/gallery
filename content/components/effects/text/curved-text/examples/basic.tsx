import { CurvedText } from "@/components/effects/text/curved-text"

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="w-full max-w-2xl">
        <CurvedText
          text="GooseUI Curved Text ✦ Smooth &amp; Elegant"
          direction="left"
          duration={20}
          fontSize={36}
          flatness={1.5}
          curve="down"
          separator="✦"
          separatorClassName="fill-amber-400"
        />
      </div>
      <div className="w-full max-w-2xl">
        <CurvedText
          text="Faster. Cleaner. Smarter."
          direction="right"
          duration={15}
          fontSize={28}
          flatness={2}
          curve="up"
        />
      </div>
    </div>
  )
}
