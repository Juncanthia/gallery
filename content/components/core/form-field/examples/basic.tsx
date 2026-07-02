import { FormItem, Field, FieldLabel, FieldDescription } from "@/components/core/form-field"
import { Input } from "@/components/core/input"

export default function FormFieldBasicExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <FormItem>
        <FieldLabel required>用户名</FieldLabel>
        <Field>
          <Input placeholder="请输入用户名" />
        </Field>
      </FormItem>

      <FormItem>
        <FieldLabel>邮箱</FieldLabel>
        <Field>
          <Input placeholder="请输入邮箱" />
        </Field>
        <FieldDescription>请输入有效的邮箱地址</FieldDescription>
      </FormItem>

      <FormItem>
        <FieldLabel>密码</FieldLabel>
        <Field>
          <Input placeholder="请输入密码" />
        </Field>
        <FieldDescription>密码长度不能少于 6 位</FieldDescription>
      </FormItem>
    </div>
  )
}
