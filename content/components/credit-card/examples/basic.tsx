import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "@/components/blocks/credit-card"

export default function CreditCardBasicExample() {
  return (
    <CreditCard className="w-full max-w-sm">
      <CreditCardFlipper>
        <CreditCardFront>
          <CreditCardChip />
          <CreditCardName>Jonathan Smith</CreditCardName>
          <CreditCardNumber>4532 7156 3290 1847</CreditCardNumber>
          <CreditCardExpiry>12/28</CreditCardExpiry>
          <CreditCardServiceProvider />
        </CreditCardFront>
        <CreditCardBack>
          <CreditCardMagStripe />
          <CreditCardCvv>123</CreditCardCvv>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  )
}
