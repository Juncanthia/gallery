"use client"

import { Terminal } from "@/components/agent-tools/terminal/terminal"

export default function Demo() {
  return (
    <Terminal
      id="demo-terminal"
      command="git log --oneline -5"
      cwd="~/project"
      exitCode={0}
      durationMs={342}
      stdout={"[33mabc1234[0m [32mfeat:[0m add terminal component\n[33mdef5678[0m [32mfix:[0m resolve ANSI rendering edge case\n[33mghi9012[0m [32mrefactor:[0m extract copy-to-clipboard hook\n[33mjkl3456[0m [32mdocs:[0m update component API docs\n[33mmno7890[0m [32mchore:[0m bump dependencies"}
    />
  )
}
