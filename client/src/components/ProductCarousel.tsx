import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function ProductCarousel() {
  
  //TODO data från databas
    const images = [
    "https://placehold.co/300x400",
    "https://placehold.co/300x400",
    "https://placehold.co/300x400",
    "https://placehold.co/300x400",
    "https://placehold.co/300x400",
    "https://placehold.co/300x400",
    "https://placehold.co/300x400",
    "https://placehold.co/300x400",
  ];
  const [index, setIndex] = useState(0);

  const next = () => {
  setIndex((i) => (i >= images.length - 3 ? 0 : i + 1));
  };

  const prev = () => {
     setIndex((i) => (i <= 0 ? images.length - 3 : i - 1));
  };

  return (
    <div className="hidden md:block relative w-full max-w-4xl mx-auto mt-10">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * (100 / 3)}%)`}}>
          {images.map((image, i) => (
            <div key={i} className="w-1/3 flex-shrink-0 p-2">
            <img
              src={image}
              className="w-full object-cover rounded-xl shadow"
              alt={`Produktbild ${i + 1}`}
            />
            </div>
          ))}
        </div>
      </div>
      <button 
              onClick={prev}
        className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100"
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>
       <button
        onClick={next}
        className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100"
      >
        <FaChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}