import { SmartForm, SmartFormField } from "@/components/ui/smart-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Demo() {
  return (
    <div className="w-full max-w-sm">
      <SmartForm
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <SmartFormField
          errorMessage="请输入有效的邮箱地址"
          successMessage="邮箱格式正确"
        >
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="请输入邮箱"
            required
          />
        </SmartFormField>

        <SmartFormField
          errorMessage="用户名至少3个字符"
          successMessage="用户名可用"
        >
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            type="text"
            placeholder="请输入用户名"
            required
            minLength={3}
          />
        </SmartFormField>

        <Button type="submit" className="submit-btn">
          提交
        </Button>
      </SmartForm>
    </div>
  )
}
