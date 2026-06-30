"use client"

import { PreferencesPanel } from "@/components/ui/tool-preferences-panel"

export default function Demo() {
  return (
    <PreferencesPanel
      id="demo-preferences"
      title="通知偏好设置"
      sections={[
        {
          heading: "通知渠道",
          items: [
            {
              id: "email-notifications",
              label: "邮件通知",
              description: "通过电子邮件接收重要更新和提醒",
              type: "switch",
              defaultChecked: true,
            },
            {
              id: "push-notifications",
              label: "推送通知",
              description: "通过浏览器推送接收实时通知",
              type: "switch",
              defaultChecked: false,
            },
          ],
        },
        {
          heading: "外观",
          items: [
            {
              id: "theme",
              label: "主题",
              description: "选择界面配色方案",
              type: "toggle",
              options: [
                { value: "light", label: "浅色" },
                { value: "dark", label: "深色" },
                { value: "system", label: "跟随系统" },
              ],
              defaultValue: "system",
            },
            {
              id: "language",
              label: "语言",
              description: "界面显示语言",
              type: "select",
              selectOptions: [
                { value: "zh-CN", label: "简体中文" },
                { value: "en-US", label: "English" },
                { value: "ja-JP", label: "日本語" },
                { value: "ko-KR", label: "한국어" },
                { value: "fr-FR", label: "Français" },
              ],
              defaultSelected: "zh-CN",
            },
          ],
        },
        {
          heading: "隐私",
          items: [
            {
              id: "analytics",
              label: "使用数据收集",
              description: "匿名收集使用数据以改进产品体验",
              type: "switch",
              defaultChecked: true,
            },
          ],
        },
      ]}
    />
  )
}
