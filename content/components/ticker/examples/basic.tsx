import {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerPriceChange,
} from "@/components/blocks/ticker"

export default function TickerBasicExample() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <Ticker>
        <TickerIcon symbol="AAPL" />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <TickerSymbol symbol="AAPL" />
            <TickerPrice price={198.72} />
          </div>
          <TickerPriceChange change={2.34} />
        </div>
      </Ticker>

      <Ticker>
        <TickerIcon symbol="GOOGL" />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <TickerSymbol symbol="GOOGL" />
            <TickerPrice price={185.43} />
          </div>
          <TickerPriceChange change={-1.27} />
        </div>
      </Ticker>

      <Ticker currency="CNY" locale="zh-CN">
        <TickerIcon symbol="0700" />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <TickerSymbol symbol="0700" />
            <TickerPrice price={385.0} />
          </div>
          <TickerPriceChange change={5.20} />
        </div>
      </Ticker>
    </div>
  )
}
