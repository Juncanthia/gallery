import { ContributionGraph } from "@/components/blocks/contribution-graph"

function generateSampleData() {
  const data = []
  const today = new Date()
  for (let i = 0; i < 200; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const count = Math.floor(Math.random() * 5)
    data.push({
      date: date.toISOString().slice(0, 10),
      count,
      level: count,
    })
  }
  return data
}

export default function ContributionGraphBasicExample() {
  return <ContributionGraph data={generateSampleData()} className="w-full max-w-sm" />
}
