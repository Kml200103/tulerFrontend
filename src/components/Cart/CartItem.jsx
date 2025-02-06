import QuantitySelector from "./Quantity";

export default function CartItem({
  image,
  title,
  discount,
  originalPrice,
  discountedPrice,
}) {
  return (
    <div className="flex gap-7 items-center self-start mt-8 ml-6 font-semibold">
      <QuantitySelector />
      <img
        loading="lazy"
        src={image}
        alt={title}
        className="object-contain shrink-0 self-stretch my-auto aspect-square rounded-[50px] w-[74px]"
      />
      <div className="flex  flex-col self-stretch my-auto text-sm">
        <div className="text-neutral-900">{title}</div>
        <div className="self-start mt-7 text-black">
          <span className="text-red-400">{discount}</span>
          <span className="text-stone-500"> {originalPrice}</span>{" "}
          {discountedPrice}
        </div>
      </div>
    </div>
  );
}
