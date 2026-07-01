import { GitHubStarsWheel } from "@/components/blocks/github-stars-wheel"

export default function GitHubStarsWheelBasicExample() {
  return (
    <GitHubStarsWheel
      value={68500}
      step={100}
      direction="btt"
    />
  )
}
