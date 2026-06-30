import { CandlestickChart } from "@/components/ui/bklit-candlestick-chart"
import { Candlestick } from "@/components/bklit/charts"

const data = [
  { date: new Date(2024, 0, 1), open: 100, high: 120, low: 90, close: 110 },
  { date: new Date(2024, 0, 2), open: 110, high: 130, low: 100, close: 125 },
  { date: new Date(2024, 0, 3), open: 125, high: 140, low: 115, close: 120 },
  { date: new Date(2024, 0, 4), open: 120, high: 135, low: 110, close: 130 },
  { date: new Date(2024, 0, 5), open: 130, high: 150, low: 125, close: 145 },
]

export default function Demo() {
  return (
    <CandlestickChart data={data}>
      <Candlestick />
    </CandlestickChart>
  )
}
