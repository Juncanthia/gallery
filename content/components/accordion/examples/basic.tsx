import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AccordionBasicExample() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>什么是组件库？</AccordionTrigger>
        <AccordionContent>
          组件库是一套可复用的 UI 组件集合，提供统一的视觉风格和交互行为。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>如何安装？</AccordionTrigger>
        <AccordionContent>
          通过 npm 安装依赖后，直接从 @/components/ui 导入所需组件即可使用。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>支持自定义样式吗？</AccordionTrigger>
        <AccordionContent>
          支持通过 className 和 variant 属性自定义组件外观。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
