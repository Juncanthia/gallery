import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/core/tooltip"
import { Button } from "@/components/core/button"

export default function TooltipBasicExample() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outlined">悬停我</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>这是提示文本</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="text" size="small">上方</Button>
          </TooltipTrigger>
          <TooltipContent side="top">顶部提示</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
