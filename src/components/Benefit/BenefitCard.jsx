import * as React from "react";

export function BenefitCard({ image, icon, text, variant }) {

  return (
    <div
      className={`flex relative flex-col ${
        variant === "light" ? "px-12 py-12" : "p-12"
      } w-full aspect-[1.125] max-md:px-5 ${
        variant === "spaced" ? "mt-14" : ""
      } text-base font-semibold text-center text-black`}
    >
      <img
        loading="lazy"
        src={`${image}`}
        className="object-cover relative inset-0 size-full"
        alt=""
      />
      <img
        loading="lazy"
        src={icon}
        className={`object-contain ${
          variant === "centered" ? "self-center" : ""
        } ${
          variant === "narrow"
            ? "w-[52px] aspect-[0.62]"
            : "w-[71px] aspect-[1.01]"
        }`}
        alt={text}
      />
      <div className={`relative ${variant === "spaced" ? "mt-3.5" : "mt-3"}`}>
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
