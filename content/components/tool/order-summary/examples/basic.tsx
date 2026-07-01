import { OrderSummary } from "@/components/ui/order-summary-tool"

export default function Demo() {
  return (
    <OrderSummary.Display
      id="order-summary-demo"
      title="Order Summary"
      items={[
        {
          id: "item-1",
          name: "Premium Wireless Headphones",
          description: "Noise-cancelling, 30hr battery",
          quantity: 1,
          unitPrice: 249.99,
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=96&h=96&fit=crop",
        },
        {
          id: "item-2",
          name: "USB-C Charging Cable",
          quantity: 2,
          unitPrice: 19.99,
        },
        {
          id: "item-3",
          name: "Laptop Stand",
          description: "Aluminum, adjustable height",
          quantity: 1,
          unitPrice: 59.99,
        },
      ]}
      pricing={{
        subtotal: 349.96,
        discount: 35.0,
        discountLabel: "Summer Sale",
        shipping: 0,
        tax: 28.0,
        total: 342.96,
        currency: "USD",
      }}
    />
  )
}
