import {
  FaGlobeAfrica,
  FaRegSmile,
  FaShieldAlt,
  FaShippingFast,
} from "react-icons/fa";

export function PublicFooter() {
  return (
    <>
      
      <ul className="footer-icons grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-start m-4 md:justify-items-center">
        <li className="flex items-center flex-row my-2">
          <FaGlobeAfrica className="text-4xl"/>
          <div className="w-full ml-2">Gratis frakt och returer</div>
        </li>
        <li className="flex items-center flex-row my-2">
                      <FaShippingFast  className="text-4xl"/>

          <div className="w-full ml-2">Expressfrakt</div>
        </li>
        <li className="flex items-center flex-row my-2">
                      <FaShieldAlt  className="text-4xl"/>

          <div className="w-full ml-2">Säkra betalningar</div>
        </li>
        <li className="flex items-center flex-row my-2">
                      <FaRegSmile  className="text-4xl"/>

          <div className="w-full ml-2">Nyheter varje dag</div>
        </li>
      </ul>
    </>
  );
}
