import React from "react";

export const OrderDetailsCard = () => {
  // Sample data for multiple orders
  const orders = [
    {
      id: 1,
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1e820973b076995384d562e9a8e7a063f15e6781cc0f074f223a98a879bd4d7d?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
      name: "Acacia Honey",
      description: "Acacia Honey 100% Pure & Natural (320g)",
      size: "320gm",
      status: "Delivered",
      date: "On Wed, 23 Jan",
    },
    {
      id: 2,
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1e820973b076995384d562e9a8e7a063f15e6781cc0f074f223a98a879bd4d7d?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
      name: "Wildflower Honey",
      description: "Wildflower Honey 100% Pure & Natural (500g)",
      size: "500gm",
      status: "Pending",
      date: "Expected on Fri, 25 Jan",
    },
    // Add more orders as needed
  ];

  return (
    <div>
      <div className="flex flex-col rounded-none max-w-[868px]">
        {orders.map((order) => (
          <div key={order.id} className="mb-10">
            <DeliveryStatus status={order.status} date={order.date} />
            <div className="flex flex-col pt-9 mt-5 font-semibold bg-stone-50 max-md:max-w-full">
              <div className="flex flex-col px-5 w-full max-md:max-w-full">
                <OrderItem
                  imageSrc={order.imageSrc}
                  name={order.name}
                  description={order.description}
                  size={order.size}
                />
                <div className="self-start mt-14 ml-20 text-lg text-black max-md:mt-10 max-md:ml-2.5">
                  Exchange/Return
                </div>
              </div>
              <div className="flex shrink-0 mt-6 h-px bg-white max-md:max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeliveryStatus = ({ status, date }) => {
  return (
    <div className="flex gap-6 self-start">
      <div className="flex flex-col justify-center items-center px-2 w-16 h-16 rounded-full bg-neutral-900">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6500e83bdfb007dcd195b7f2923d015c9e9cf3241607f413c280539c95dd9b2a?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
          alt=""
          className="object-contain aspect-square w-[50px]"
        />
      </div>
      <div className="my-auto text-lg font-semibold leading-6 text-black">
        <span className="text-yellow-400">{status}</span>
        <br />
        <span className="font-medium text-neutral-900">{date}</span>
      </div>
    </div>
  );
};

const OrderItem = ({ imageSrc, name, description, size }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-between w-full text-base text-neutral-700 max-md:max-w-full">
      <div className="flex gap-5">
        <img
          loading="lazy"
          src={imageSrc}
          alt={`Product image of ${name}`}
          className="object-contain shrink-0 self-start aspect-square rounded-[50px] w-[74px]"
        />
        <div className="flex flex-col items-start">
          <div className="text-lg font-bold text-neutral-900">{name}</div>
          <div className="self-stretch mt-2">{description}</div>
          <div className="mt-2">Size: {size}</div>
        </div>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/4c51840bb07b5c59dff8e963a9fd2f9a6eeeeea8f3037b635c784 99efdd1c90b?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
        alt=""
        className="object-contain shrink-0 my-auto aspect-square w-[15px]"
      />
    </div>
  );
};
