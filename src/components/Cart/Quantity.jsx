import { useState } from "react";

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col items-center w-14 py-2 bg-neutral-200 text-black rounded-3xl">
      {/* Increase Button */}
      <button
        onClick={increase}
        className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-t-3xl"
      >
        +
      </button>

      {/* Quantity Display */}
      <span className="py-2 text-lg font-semibold">{quantity}</span>

      {/* Decrease Button */}
      <button
        onClick={decrease}
        className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-b-3xl"
      >
        -
      </button>
    </div>
  );
}
