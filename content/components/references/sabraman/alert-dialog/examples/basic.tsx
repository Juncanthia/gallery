import {
  LegacyAlertDialog,
  LegacyAlertDialogButton,
  LegacyAlertDialogClose,
  LegacyAlertDialogContent,
  LegacyAlertDialogDescription,
  LegacyAlertDialogFooter,
  LegacyAlertDialogHeader,
  LegacyAlertDialogTitle,
  LegacyAlertDialogTrigger,
} from "@/components/legacy-ui"

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-8">
      <LegacyAlertDialog>
        <LegacyAlertDialogTrigger asChild>
          <LegacyAlertDialogButton>删除文件</LegacyAlertDialogButton>
        </LegacyAlertDialogTrigger>
        <LegacyAlertDialogContent showCloseButton>
          <LegacyAlertDialogHeader>
            <LegacyAlertDialogTitle>确认删除</LegacyAlertDialogTitle>
            <LegacyAlertDialogDescription>
              此操作无法撤销。确定要永久删除此文件吗？
            </LegacyAlertDialogDescription>
          </LegacyAlertDialogHeader>
          <LegacyAlertDialogFooter>
            <LegacyAlertDialogClose asChild>
              <LegacyAlertDialogButton>取消</LegacyAlertDialogButton>
            </LegacyAlertDialogClose>
            <LegacyAlertDialogButton variant="primary">
              删除
            </LegacyAlertDialogButton>
          </LegacyAlertDialogFooter>
        </LegacyAlertDialogContent>
      </LegacyAlertDialog>
    </div>
  )
}
