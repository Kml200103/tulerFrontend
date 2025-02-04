import * as React from "react";

export function HoneyCard({ title, description, image }) {
  return (
    <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
      <div className="flex relative flex-col grow items-start py-12 pr-20 pl-5 rounded-3xl shadow-sm min-h-[216px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <img
          loading="lazy"
          src={image}
          alt={`${title} product image`}
          className="object-cover absolute inset-0 size-full"
        />
        <div className="relative text-xl font-bold text-neutral-900">
          {title}
        </div>
        <div className="relative mt-3.5 text-sm font-medium text-neutral-700">
          {description}
        </div>
      </div>
    </div>
  );
}
