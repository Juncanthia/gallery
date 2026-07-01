import { OrderSummary } from "@/components/templates/manifest/payment/order-summary"

const sampleData = {
  items: [
    {
      id: "1",
      name: "Wireless Headphones",
      quantity: 1,
      price: 149.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop",
    },
    {
      id: "2",
      name: "USB-C Cable",
      quantity: 2,
      price: 19.99,
    },
    {
      id: "3",
      name: "Phone Case",
      quantity: 1,
      price: 29.99,
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=120&h=120&fit=crop",
    },
  ],
  subtotal: 219.96,
  shipping: 5.99,
  tax: 17.60,
  discount: 20,
  discountCode: "SAVE20",
  total: 223.55,
}

export default function Demo() {
  return (
    <OrderSummary
      data={sampleData}
      appearance={{ currency: "USD" }}
    />
  )
}
