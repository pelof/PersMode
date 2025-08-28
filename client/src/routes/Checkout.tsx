import { CartContents } from "@/components/CartContents";
import { CheckoutForm } from "@/components/CheckoutForm";

export function Checkout() {
  return <>
        <h1 className="text-2xl text-center my-5">Kassan</h1>
        <CartContents/>
        <CheckoutForm/>
   </>;
}
