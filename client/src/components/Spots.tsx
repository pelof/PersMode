import { Link } from "@tanstack/react-router";

export default function Spots() {
    return (
        <section className="hidden lg:flex lg:gap-5 lg:my-4 justify-center">
            <Link to="/" className="relative">
            <img src="https://placehold.co/600x400" alt="Spot" />
            <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full font-bold text-2xl"> Fulsnygga papiljotter</h3>
            </Link>
            <Link to="/" className="relative">
            <img src="https://placehold.co/600x400" alt="Spot" />
            <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full font-bold text-2xl"> Lökringar på burk</h3>
            </Link>
            <Link to="/" className="relative">
            <img src="https://placehold.co/600x400" alt="Spot" />
            <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full font-bold text-2xl"> Osthyvelsklänning</h3>
            </Link>
        </section>
    )
}