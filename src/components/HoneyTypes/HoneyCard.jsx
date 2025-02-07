import * as React from "react";

const honeyProducts = [
  {
    title: "RAW HONEY",
    description:
      "Raw honey is honey that is unprocessed, unpasteurized, and often unfiltered, meaning it is taken directly from the hive",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/3de3b8233f7ed0030ee0d5c2578fe11f1f647100bbb954aaf215d6cc5c2fc869?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
  },
  {
    title: "SAGE HONEY",
    description:
      "Sage honey is a type of honey made by bees that primarily collect nectar from sage plants, especially species in the Salvia genus.",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0e9b6e00a8de9ea90a3e99cb6c679e7cf784e10f40d8aa715a712fae8cd185cf?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
  },
  {
    title: "HONEY BLEND",
    description:
      "A honey blend refers to a product that combines natural honey with other ingredients, such as additional sweeteners",
    imageSrc:
      " https://cdn.builder.io/api/v1/image/assets/TEMP/669e15bde4a287bf027d8b1bfdc30b400579aa5ccaa19f36f80ac1d362490c6b?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
  },
];
export function HoneyCard({ title, description, image }) {
  return (
    <div className="flex flex-col w-[50%] max-md:ml-0 max-md:w-full">
      {" "}
      {/* Increased width to 50% */}
      <div
        className="flex relative flex-col grow items-center py-12 pr-20 pl-5 rounded-3xl shadow-sm min-h-[216px] max-md:px-5 max-md:mt-10 max-md:max-w-full overflow-hidden"
        style={{
          background: "linear-gradient(to top right, #F3EBFF, #E4D6CD)",
        }}
      >
        <img
          loading="lazy"
          src={image}
          alt={`${title} product image`}
          className="object-cover absolute inset-0 w-full h-full rounded-3xl"
        />
        <div className="relative text-xl font-bold text-neutral-900 z-10">
          {title}
        </div>
        <div className="relative mt-3.5 text-sm font-medium text-neutral-700 z-10">
          {description}
        </div>
      </div>
    </div>
  );
}
