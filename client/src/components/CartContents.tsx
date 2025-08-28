
import { Link } from "@tanstack/react-router";
import { FaRegTrashAlt } from "react-icons/fa";

export function CartContents() {
    return (
        <>
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
                      <input
                        type="number"
                        min="1"
                        className="border-2 rounded max-w-15 px-1"
                      />
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
                      <input
                        type="number"
                        min="1"
                        className="border-2 rounded max-w-15 px-1"
                      />
                      <button className="p-1 text-2xl cursor-pointer">
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              {/* TODO: automatiskt varannan mörkgrå */}
              <div className="mx-10 overflow-x-auto ">
                <table className="hidden md:table table-fixed border w-full border-collapse">
                  <thead className="border-1 text-left bg-gray-400">
                    <tr>
                      <th className="w-1/2 lg:w-2/3 px-2 py-1">Produkt</th>
                      <th className="px-2 py-1">Pris</th>
                      <th className="px-2 py-1">Totalt</th>
                      <th className="px-2 py-1">Antal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="divide-x bg-gray-200 divide-gray-300">
                      <td className="px-2 py-1">
                        <Link to="/details">Gurkskalare</Link>
                      </td>
                      <td className="px-2 py-1">199 kr</td>
                      <td className="px-2 py-1">199 kr</td>
                      <td className="px-2 py-1">
                        <div className="flex">
                          <input
                            type="number"
                            min="1"
                            className="border-2 rounded max-w-15 px-1 border-gray-300 bg-gray-100"
                          />
        
                          <button className="p-1 text-2xl cursor-pointer">
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="divide-x bg-gray-50 divide-gray-300">
                      <td className="px-2 py-1">
                        <Link to="/details">Gurkskalare</Link>
                      </td>
                      <td className="px-2 py-1">199 kr</td>
                      <td className="px-2 py-1">199 kr</td>
                      <td className="px-2 py-1">
                        <div className="flex">
                          <input
                            type="number"
                            min="1"
                            className="border-2 rounded max-w-15 px-1 border-gray-300"
                          />
        
                          <button className="p-1 text-2xl cursor-pointer">
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
        </>
    )
}