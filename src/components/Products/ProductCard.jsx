import * as React from "react";

function ProductCard({ imageSrc, title, priceRange, discount }) {
  return (
    <div className="flex flex-col grow pb-5 w-full text-center text-black bg-white rounded-xl shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:mt-9 relative">
      {discount && (
        <div className="absolute -top-3 -right-3 z-10 px-3.5 py-2.5 text-sm font-extrabold whitespace-nowrap bg-yellow-400 rounded-3xl">
          {discount}
        </div>
      )}
      <div className="flex flex-col items-center px-4 mt-2 w-full font-semibold">
        <img
          loading="lazy"
          src={imageSrc}
          alt="Product"
          className="object-contain self-stretch w-full rounded-xl aspect-[1.84]"
        />
        <div className="z-10 mt-6 text-xl">
          <span className="text-base">{title}</span>
          <br />
          <br />
        </div>
        <div className="text-base">{priceRange}</div>
        <div
          className="flex gap-1.5 items-start px-3.5 py-2.5 mt-5 max-w-full text-sm text-amber-300 bg-black rounded-3xl w-[147px]"
          tabIndex="0"
          role="button"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/894806623d78863f592eba6f3bf1318652cbab1c22af94232c6182283f083e08?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
            alt="Shopping Cart Icon"
            className="object-contain shrink-0 self-start aspect-[1.08] w-[27px]"
          />
          <div className="my-auto">Add to cart</div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
