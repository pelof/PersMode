import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="border-1 flex items-center justify-center flex-col lg:flex-row-reverse lg:items-start">
      <Link to="/" className="">
        <img
          src="https://placehold.co/600x400"
          alt="Heroproduct"
          className="p-2"
        />
      </Link>
      <div className="p-2 text-center">
        <h2 className="text-2xl font-bold mt-4">Guldgröna galosher</h2>
        <p className="max-w-lg mt-4">
          Finfina vattentäta galosher som ger omgivningen nackspärr. Ett
          helsäkert sätt att varje gång komma in på Ellstorps kvarterskrog.
          Tyvärr inte nog för att komma in på biljarden dock.
        </p>
      </div>
    </section>
  );
}
