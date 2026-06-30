import { DecryptedText } from "@/components/ui/rb-decrypted-text"

export default function DecryptedTextBasicExample() {
  return (
    <DecryptedText
      text="Hello World"
      className="text-2xl font-mono"
      animateOn="hover"
    />
  )
}
