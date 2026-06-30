import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function CollapsibleBasicExample() {
  return (
    <Collapsible className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">可折叠区域</h4>
        <CollapsibleTrigger asChild>
          <Button variant="text" size="small" icon={<ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />} />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded border px-4 py-3 text-sm text-muted-foreground">
          折叠面板的内容，展开后可见。
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
