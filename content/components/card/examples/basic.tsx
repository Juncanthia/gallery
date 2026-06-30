import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CardBasicExample() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
        <CardDescription>这是卡片的描述信息，用于补充说明。</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">卡片主体内容区域。</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="small" variant="outlined">取消</Button>
        <Button size="small" color="primary" variant="solid">确认</Button>
      </CardFooter>
    </Card>
  )
}
