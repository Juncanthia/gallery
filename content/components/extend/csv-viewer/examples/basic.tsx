import { CsvViewer } from "@/components/ui/extend-csv-viewer"

const SAMPLE_CSV = `Name,Age,City,Role
Alice,30,New York,Engineer
Bob,25,San Francisco,Designer
Charlie,35,Chicago,Manager
Diana,28,Boston,Product Owner
Eve,32,Seattle,Data Scientist
Frank,29,Austin,Developer
Grace,27,Denver,Analyst
Henry,34,Miami,Architect
Ivy,26,Portland,Researcher
Jack,31,Phoenix,Director`

export default function Demo() {
  return (
    <div className="w-full">
      <CsvViewer data={SAMPLE_CSV} search />
    </div>
  )
}
