import React from "react";
import { OrderDetailsCard } from "../../components/OrderDetailsCard";

const MyOrders = () => {
  return (
    <div className="container flex flex-col text-3xl font-semibold leading-[64px] max-w-[954px] rounded-[30px] text-neutral-700">
      <div className="px-11 pt-7 w-full mb- bg-white pb-[654px] rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:px-5 max-md:pb-28 max-md:max-w-full">
        All orders
        <div>
          <OrderDetailsCard />
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
