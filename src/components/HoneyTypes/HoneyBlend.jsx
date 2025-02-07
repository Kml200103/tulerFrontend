function HoneyBlendCard({ title, description, image }) {
  return (
    <div
      className="flex items-center rounded-3xl shadow-sm"
      style={{
        background: "linear-gradient(to top right, #F3EBFF, #E4D6CD)",
      }}
    >
      <img
        loading="lazy"
        src={image}
        alt={`${title} product image`}
        className="object-cover w-1/2 rounded-l-3xl"
      />
      <div className="flex flex-col p-5 w-1/2">
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        <p className="mt-3.5 text-sm font-medium text-neutral-700">
          {description}
        </p>
      </div>
    </div>
  );
}

export default HoneyBlendCard;
