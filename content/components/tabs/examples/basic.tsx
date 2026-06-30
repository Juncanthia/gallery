import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsBasicExample() {
  return (
    <Tabs defaultActiveKey="tab1" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="tab1">标签一</TabsTrigger>
        <TabsTrigger value="tab2">标签二</TabsTrigger>
        <TabsTrigger value="tab3">标签三</TabsTrigger>
      </TabsList>
      <TabsContents>
        <TabsContent value="tab1">
          <p className="p-4 text-sm text-muted-foreground">标签一的内容</p>
        </TabsContent>
        <TabsContent value="tab2">
          <p className="p-4 text-sm text-muted-foreground">标签二的内容</p>
        </TabsContent>
        <TabsContent value="tab3">
          <p className="p-4 text-sm text-muted-foreground">标签三的内容</p>
        </TabsContent>
      </TabsContents>
    </Tabs>
  )
}
