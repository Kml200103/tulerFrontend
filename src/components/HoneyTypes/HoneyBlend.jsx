import * as React from "react";

function HoneyBlend() {
  return (
    <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
      <div className="grow rounded-3xl shadow-sm max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex z-10 flex-col self-stretch my-auto max-md:mt-10">
              <div className="self-start text-xl font-bold text-neutral-900">
                HONEY BLEND
              </div>
              <div className="mt-3.5 text-sm font-medium text-neutral-700">
                A honey blend refers to a product that combines natural honey
                with other ingredients, such as additional sweeteners
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/669e15bde4a287bf027d8b1bfdc30b400579aa5ccaa19f36f80ac1d362490c6b?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              alt="Honey blend product"
              className="object-contain z-10 grow mt-0 w-full aspect-[1.05] max-md:mr-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoneyBlend;
