import { Flex } from "@/components/ui/flex"

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-xs text-primary">
      {children}
    </div>
  )
}

export default function FlexBasicExample() {
  return (
    <div className="w-full space-y-4">
      <Flex gap={2}>
        <Box>1</Box>
        <Box>2</Box>
        <Box>3</Box>
      </Flex>

      <Flex vertical gap={2}>
        <Box>1</Box>
        <Box>2</Box>
        <Box>3</Box>
      </Flex>

      <Flex gap={4} justify="center" align="center" className="h-20 rounded border bg-muted/30">
        <Box>居中</Box>
      </Flex>
    </div>
  )
}
