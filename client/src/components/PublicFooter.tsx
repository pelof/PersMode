import {
  FaGlobeAfrica,
  FaRegSmile,
  FaShieldAlt,
  FaShippingFast,
} from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Link } from "@tanstack/react-router";

export function PublicFooter() {
  return (
    <>
      <ul className="footer-icons grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-start m-4 md:justify-items-center">
        <li className="flex items-center flex-row my-2">
          <FaGlobeAfrica className="text-4xl" />
          <div className="w-full ml-2">Gratis frakt och returer</div>
        </li>
        <li className="flex items-center flex-row my-2">
          <FaShippingFast className="text-4xl" />

          <div className="w-full ml-2">Expressfrakt</div>
        </li>
        <li className="flex items-center flex-row my-2">
          <FaShieldAlt className="text-4xl" />

          <div className="w-full ml-2">Säkra betalningar</div>
        </li>
        <li className="flex items-center flex-row my-2">
          <FaRegSmile className="text-4xl" />

          <div className="w-full ml-2">Nyheter varje dag</div>
        </li>
      </ul>
      <div className="md:hidden flex flex-col">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Shopping</AccordionTrigger>
            <AccordionContent>
              <Link
                to="/categories/$category"
                params={{ category: "clothing" }}
              >
                Vinterjackor
              </Link>
              <Link
                to="/categories/$category"
                params={{ category: "clothing" }}
              >
                Pufferjackor
              </Link>
              <Link
                to="/categories/$category"
                params={{ category: "clothing" }}
              >
                Kappa
              </Link>
              <Link
                to="/categories/$category"
                params={{ category: "clothing" }}
              >
                Trenchcoats
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Mina Sidor</AccordionTrigger>
            <AccordionContent>
              <Link to="">Mina Ordrar</Link>
              <Link to="">Mitt Konto</Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Kundtjänst</AccordionTrigger>
            <AccordionContent>
              <Link to="">Returpolicy</Link>
              <Link to="">Integritetspolicy</Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <small className="text-center p-3 text-lg">&copy; Pers Mode</small>
      </div>
      
  <div className="hidden md:flex flex-col bg-gray-200 border-1 border-gray-500">
      <div className="flex flex-row gap-30 px-6">
        <ul className="py-5 flex flex-col gap-2">
          <li>
            <Link to="/shopping">
              <b>Shopping</b>
            </Link>
          </li>
          <li>
            <Link
                to="/categories/$category"
                params={{ category: "clothing" }}>Vinterjackor</Link>
          </li>
          <li>
            <Link
                to="/categories/$category"
                params={{ category: "clothing" }}>Pufferjackor</Link>
          </li>
          <li>
            <Link
                to="/categories/$category"
                params={{ category: "clothing" }}>Kappa</Link>
          </li>
          <li>
            <Link
                to="/categories/$category"
                params={{ category: "clothing" }}>Trenchcoats</Link>
          </li>
        </ul>
                <ul className="py-5 flex flex-col gap-2">
          <li>
            <Link to="/minasidor">
              <b>Mina sidor</b>
            </Link>
          </li>
          <li>
            <Link to="/minaordrar">Mina Ordrar</Link>
          </li>
          <li>
            <Link to="/mittkonto">Mitt Konto</Link>
          </li>
        </ul>
        <ul className="py-5 flex flex-col gap-2">
          <li>
            <Link to="/kundtjanst">
              <b>Kundtjänst</b>
            </Link>
          </li>
          <li>
            <Link to="/returnpolicy">Returnpolicy</Link>
          </li>
          <li>
            <Link to="/integritetspolicy">Integritetspolicy</Link>
          </li>
        </ul>
        </div>
        <small className="text-center pb-5 text-md">&copy; Pers Mode</small>
      </div>
    </>
  );
}
//TODO: kan man ge en produkt flera kategorier? behövs foreign key då?
