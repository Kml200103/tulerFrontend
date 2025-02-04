import * as React from "react";

const socialIcons = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/aa2e8eb6df9306011f739e1312541a3dabbc1507426c5a278cea2cd9c17faf0e?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805",
    size: "w-[30px]",
    alt: "Social media icon 1",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/283293b8ac51bd9733ed23a62ace0cd7696281466597f5b56d7b20cc191465e9?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805",
    size: "w-[25px]",
    alt: "Social media icon 2",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a8d69cd46160b47eb3fdea162aaedfd579586976de6fd46e47a24c2265316ce?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805",
    size: "w-8",
    alt: "Social media icon 3",
  },
];

export default function SocialIcons() {
  return (
    <div className="flex gap-2.5 items-start">
      {socialIcons.map((icon, index) => (
        <a
          key={index}
          href="#"
          tabIndex="0"
          role="link"
          aria-label={`Visit our ${icon.alt}`}
        >
          <img
            loading="lazy"
            src={icon.src}
            className={`object-contain shrink-0 aspect-square ${icon.size}`}
            alt={icon.alt}
          />
        </a>
      ))}
    </div>
  );
}
