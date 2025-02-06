import * as React from "react";

function CardItem({
  imgSrc,
  imgAlt,
  description,
  oldPrice,
  discountedPrice,
  discount,
}) {
  return (
    <div className="flex gap-5 mt-8">
      <img
        src={imgSrc}
        alt={imgAlt}
        className="object-contain shrink-0 self-start mt-1 aspect-square rounded-[50px] w-[74px]"
        loading="lazy"
      />
      <div className="flex flex-col">
        <div className="text-neutral-900">{description}</div>
        <div className="self-start mt-7 text-black">
          <span className="text-red-400">{discount}</span>
          <span className="text-stone-500"> {oldPrice}</span> {discountedPrice}
        </div>
      </div>
    </div>
  );
}

export default CardItem;
