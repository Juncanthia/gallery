import { SVGDrawable } from "@/components/ui/svg-drawable"

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <SVGDrawable draw="0 1" duration={2000}>
        <svg
          viewBox="0 0 100 100"
          width="120"
          height="120"
          className="text-blue-500"
        >
          <path
            d="M10,50 Q50,10 90,50 T50,90 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </SVGDrawable>

      <SVGDrawable
        draw={["0 0", "0 1", "1 1"]}
        duration={3000}
        stagger={150}
        loop
      >
        <svg
          viewBox="0 0 200 60"
          width="200"
          height="60"
          className="text-green-500"
        >
          <path
            d="M10,30 L60,10 L110,30 L160,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10,45 L60,25 L110,45 L160,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SVGDrawable>
    </div>
  )
}
