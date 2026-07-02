import { QuestionFlow } from "@/components/agent-tools/question-flow/question-flow"

const options = [
  { id: "web", label: "Web 应用", description: "浏览器端运行的在线应用" },
  { id: "mobile", label: "移动应用", description: "iOS / Android 原生 App" },
  {
    id: "desktop",
    label: "桌面应用",
    description: "macOS / Windows / Linux 原生应用",
  },
  {
    id: "cli",
    label: "命令行工具",
    description: "终端 CLI 工具或脚本",
    disabled: true,
  },
]

export default function Demo() {
  return (
    <QuestionFlow
      id="demo-question-flow"
      step={1}
      title="你想构建什么类型的项目？"
      description="选择项目类型以获取对应的模板推荐。"
      options={options}
      selectionMode="single"
    />
  )
}
