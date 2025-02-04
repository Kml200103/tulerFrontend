function TestimonialCard({ image, quote, name, imagePosition = "center" }) {
  return (
    <div className="flex flex-col w-full max-w-[350px] min-h-[400px] mx-auto">
      <div className="flex overflow-hidden flex-col items-center pb-5 w-full rounded bg-stone-900">
        <div className="flex items-start self-stretch pt-5 pb-12 px-7 text-sm font-bold text-black bg-orange-50 min-h-[150px]">
          <div className="flex-1">
            <span className="text-4xl font-medium uppercase leading-[50px]">
              "
            </span>
            <br />
            <span className="leading-5 font-[325]">{quote}</span>
          </div>
        </div>
        <img
          loading="lazy"
          src={image}
          alt={`Profile picture of ${name}`}
          className="object-contain z-10 mt-3 rounded-full aspect-square w-[75px]"
        />
        <div className="mt-3 text-base font-medium tracking-widest text-center uppercase text-zinc-300">
          {name}
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
