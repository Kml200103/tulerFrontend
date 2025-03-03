import React from "react";
import FeedbackForm from "../../components/FeedbackForm/FeedbackForm";

const socialIcons = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/100c9a9662cfb7f59e59b24b876a5dada1ae0cdc6647d2993d9ac0a673c6a4bf?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Social Media Icon 1",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/fe75986126104598bb16b6bd62dcd079327cebcfccb8a96b8b328aee8d374e9f?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Social Media Icon 2",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/61b16ab1e3d391973e3fa87a2f9cffd0935343b28d8cfd74f80ba43226065df9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Social Media Icon 3",
  },
];

const ContactPage = () => {
  return (
    <div className="m-10 container flex flex-col md:flex-row w-full justify-center items-start md:items-center px-4 md:px-0 pt-[72px] md:pt-[96px] overflow-x-hidden">
      <div className="md:w-1/3 w-full rounded-none">
        {/* Responsive width for contact info */}
        <div className="flex flex-col items-start p-6 bg-sky-50 border border-sky-50 border-solid rounded-[30px] w-full mb-6 md:mb-0">
          {/* Responsive padding and margin */}
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3cfa34d20795278a334d84d850e3fc32f7ad0a4af83f42e875decc451145b2d9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
            alt="Contact"
            className="object-contain w-1/2 mx-auto mb-4 md:mb-0" // Responsive image width and margin
          />
          <div className="mt-4 text-xl font-semibold leading-3 text-neutral-700 w-full">
            Address
          </div>
          <div className="mt-2 text-lg font-medium leading-4 text-stone-500 w-full">
            NY State Thruway, New York, USA
          </div>
          <div className="mt-6 text-xl font-semibold leading-3 text-neutral-700 w-full">
            Phone
          </div>
          <div className="mt-2 text-lg font-medium leading-4 text-stone-500 w-full">
            +129290122122
          </div>
          <div className="mt-6 text-xl font-semibold leading-3 text-neutral-700 w-full">
            Email Address
          </div>
          <div className="mt-2 text-lg font-medium leading-4 text-stone-500 w-full">
            demo@demo.com
          </div>
          <div className="mt-6 text-xl font-semibold leading-3 text-neutral-700 w-full">
            Website
          </div>
          <div className="mt-2 text-lg font-medium leading-4 text-stone-500 w-full">
            https://redq.io
          </div>
          <div className="mt-6 text-xl font-semibold leading-3 text-neutral-700 w-full">
            Follow Us
          </div>
          <div className="flex gap-3.5 mt-2 w-full">
            {/* Added w-full */}
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc3aaf0e2da052fe1190fc676bac126d3313350a79e984babc91d661d6901fba?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              alt="Social Media 1"
              className="object-contain shrink-0 w-6" // Adjusted width
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f2e8ffd91a09464f45b56aaf701353a9616e7946c70b2fb45f74f852f06fd9c?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              alt="Social Media 2"
              className="object-contain shrink-0 w-6" // Adjusted width
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bdfe4337061578f5470529822231bcbef630e64e81ccd1d3d76b6b98fe45dfa9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              alt="Social Media 3"
              className="object-contain shrink-0 w-6" // Adjusted width
            />
          </div>
        </div>
      </div>

      <div className="md:w-1/2 w-full md:pl-8 mt-6 md:mt-0">
        {/* Responsive width and padding for the form */}
        <FeedbackForm />
      </div>
    </div>
  );
};

export default ContactPage;
