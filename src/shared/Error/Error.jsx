import { classNames } from "../../utils/classNames";

export default function Error({ title, subTitle, buttonText, onClick }) {
  return (
    <div className={classNames("flex flex-col items-center justify-center")}>
      <img src="/error.svg" alt="404" width={200} height={200} />
      <h1 className="text-[40px] text-secondary-200 mb-2">{title}</h1>
      <p className="text-sm  m-0 mb-8 text-secondary-300">{subTitle}</p>
      <div>
        <button
          className="p-4 bg-red-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={onClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
