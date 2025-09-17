import { Link } from "@tanstack/react-router";
import { FaHome } from "react-icons/fa";

export function AdminHeader() {
    return (
        <div className="flex bg-gray-950">
        <h2 className="p-5 w-full bg-gray-950 text-white text-xl">Administration</h2>
        <Link to="/" className="m-5 cursor-pointer">
        <FaHome className="text-white text-3xl"/>
        </Link>
        </div>
    )
}