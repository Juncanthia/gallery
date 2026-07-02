import { PaymentConfirmed } from "@/components/templates/payment/payment-confirmed"

const sampleData = {
  orderId: "ORD-2024-5678",
  productName: "Air Force 1 '07",
  productDescription: "Nike · Size 10 · Black",
  productImage: "https://ui.manifest.build/demo/shoe-1.png",
  price: 299,
  deliveryDate: "Jan 20, 2024",
}

export default function Demo() {
  return (
    <div className="w-full max-w-md">
      <PaymentConfirmed
        data={sampleData}
        actions={{
          onTrackOrder: () => console.log("Track order clicked"),
        }}
        appearance={{ variant: "default", currency: "EUR" }}
      />
    </div>
  )
}
