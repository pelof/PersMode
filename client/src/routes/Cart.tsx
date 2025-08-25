import { Link } from "@tanstack/react-router";
import { FaRegTrashAlt } from "react-icons/fa";

export function Cart() {
  return (
    <>
      <h1 className="text-2xl text-center my-5">Varukorgen</h1>
      <ul className="md:hidden">
        <li className="border border-border border-b-0 p-2 flex justify-between items-center first:rounded-t last:rounded-b last:border-b">
          <div>
            <Link to="/details" className="hover:underline m-1">
              Gurkskalare
            </Link>
            <p className="m-1">199 SEK</p>
          </div>
          <div>
            <h2 className="m-1">199 SEK</h2>
            <div className="m-1 flex justify-center">
                <input type="number" className="border-2 rounded max-w-15 px-1" /> 
                {/* TODO: inte under 0 */}
                <button className="p-1 text-2xl cursor-pointer">
                    <FaRegTrashAlt />
                </button>
            </div>
          </div>
        </li>
        <li className="border border-border border-b-0 p-2 flex justify-between items-center first:rounded-t last:rounded-b last:border-b">
          <div>
            <Link to="/details" className="hover:underline m-1">
              Gurkskalare
            </Link>
            <p className="m-1">199 SEK</p>
          </div>
          <div>
            <h2 className="m-1">199 SEK</h2>
            <div className="m-1 flex justify-center">
                <input type="number" className="border-2 rounded max-w-15 px-1" />
                <button className="p-1 text-2xl cursor-pointer">
                    <FaRegTrashAlt />
                </button>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}

// TODO dynamisk och itererande
