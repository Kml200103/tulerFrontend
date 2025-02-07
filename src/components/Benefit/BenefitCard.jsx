import * as React from "react";

export function BenefitCard({ image, icon, text, variant }) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        variant === "light" ? "px-12 py-12" : "p-12"
      } w-full aspect-[1.125] max-md:px-5 ${
        variant === "spaced" ? "mt-14" : ""
      } text-base font-semibold text-center text-black`}
    >
      {/* Benefit Image */}
      <img
        loading="lazy"
        src={image}
        className="object-cover w-full h-auto mb-4" // Adjusted for better sizing
        alt=""
      />
      {/* Benefit Icon */}
      <img
        loading="lazy"
        src={icon}
        className={`object-contain mb-2 ${
          variant === "centered" ? "self-center" : ""
        } ${
          variant === "narrow"
            ? "w-[52px] aspect-[0.62]"
            : "w-[71px] aspect-[1.01]"
        }`}
        alt={text}
      />
      {/* Benefit Text */}
      <div className={` absolute ${variant === "spaced" ? "mt-3.5" : "mt-3"}`}>
        {text.split("<br/>").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < text.split("<br/>").length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
