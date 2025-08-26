import { FaRegHeart } from "react-icons/fa";
import { ProductCarousel } from "../components/ProductCarousel";

export function ProductDetails() {
  return (
    <section className="">
      <div className="flex flex-col md:flex-row">
        <div className="relative">
          <img
            src="https://placehold.co/300x400"
            alt="produkt"
            className="w-full min-w-md"
          />
          <FaRegHeart className="absolute right-3 bottom-3 text-4xl" />
          <div className="absolute left-4 top-4 bg-black text-white px-2 py-1 rounded">
            Nyhet
          </div>
        </div>
        <div className="md:mx-3 lg:mx-5 max-w-2xl">
          <h1 className="text-2xl font-bold">Guldgröna galoscher</h1>
          <p className="mt-2 text-sm text-gray-600">Märke</p>
          <p className="mt-2">
            Finfina vattentäta galosher som ger omgivningen nackspärr. Ett
            helsäkert sätt att varje gång komma in på Ellstorps kvarterskrog.
            Tyvärr inte nog för att komma in på biljarden dock.
          </p>
          <p className="text-xl font-semibold mt-2 md:mt-5">300 kr</p>
          <div>
            <button type="button" className="border-1 rounded py-1 mt-2 w-full md:w-40">
              Lägg i varukorg
            </button>
          </div>
        </div>
      </div>
      {/* TODO - liknande produkter */}
      <ProductCarousel/>
    </section>
  );
}
//TODO dynamisk
