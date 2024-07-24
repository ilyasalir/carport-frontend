import { FormEventHandler, MouseEventHandler, ReactNode } from "react";

function Button({
  text,
  type,
  onClick,
  onSubmit,
  isLoading = false,
  color = "primary",
  icon = undefined,
  iconPosition = "right",
  shape = "normal",
  fitContent = false,
  disable = false,
}: {
  text?: string | ReactNode;
  type: "button" | "submit" | "reset" | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  onSubmit?: FormEventHandler<HTMLButtonElement> | undefined;
  isLoading?: boolean;
  color?: "primary" | "secondary" | "red" | "green" | "yellow" | "hollow";
  icon?: React.ReactNode | undefined;
  iconPosition?: "right" | "left";
  shape?: "normal" | "rounded-medium" | "rounded-small";
  disable?: boolean;
  fitContent?: boolean;
}) {
  return (
    <button
      disabled={disable || isLoading}
      type={type}
      onClick={onClick}
      onSubmit={onSubmit}
      className={`${
        shape == "normal"
          ? `${color == "hollow" || "secondary" ? "px-[10px] md:px-[22px] lg:px-[30px] py-[10px]" : "px-3 md:px-6 lg:px-8 py-3"} rounded-[12px] font-medium text-[12px] md:text-[16px] lg:text-[20px]`
          : shape == "rounded-medium"
            ? "px-3 md:px-6 lg:px-8 py-3 rounded-full font-normal text-[14px] md:text-[18px] lg:text-[22px]"
            : "px-3 md:px-4 lg:px-6 py-[6px] rounded-full font-normal text-[12px] md:text-[14px] lg:text-[16px]"
      } ${
        disable
          ? `cursor-not-allowed border-gray-subtext`
          : color == "primary"
            ? "bg-black active:bg-black hover:bg-dark-maintext border-black active:border-black hover:border-dark-maintext"
            : color == "secondary"
              ? "bg-black active:bg-black hover:bg-dark-maintext border-white"
              : color == "green"
                ? "bg-green-secondary active:bg-green-secondary hover:bg-green-accent border-green-secondary active:border-green-secondary hover:border-green-accent"
                : color == "yellow"
                  ? "bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-accent border-yellow-secondary active:border-yellow-secondary hover:border-yellow-accent"
                  : color == "red"
                    ? "bg-red-secondary active:bg-red-secondary hover:bg-red-accent border-red-secondary active:border-red-secondary hover:border-red-accent"
                    : "bg-white border-black hover:bg-dark-maintext active:bg-dark-maintext hover:border-dark-maintext active:border-dark-maintext hover:text-white text-black"
      } ${fitContent ? "w-fit shrink-0" : "w-full"} border-2 h-fit group`}
    >
      {isLoading ? (
        <div
          className={`${
            disable
              ? "text-gray-subtext"
              : color == "hollow"
                ? "hover:text-white"
                : color == "yellow"
                  ? "text-black"
                  : "text-white"
          }  flex items-center justify-center`}
        >
          <svg
            className="mr-3 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        <div
          className={`${
            disable
              ? "text-gray-subtext"
              : color == "hollow"
                ? "hover:text-white"
                : color == "yellow"
                  ? "text-black"
                  : "text-white"
          } ${
            iconPosition == "right" ? "" : "flex-row-reverse"
          } ${icon == undefined ? "" : "flex items-center justify-center gap-3"}`}
        >
          {text}
          <div
            className={`${
              shape == "normal"
                ? "text-[22px] md:text-[26px] lg:text-[30px]"
                : shape == "rounded-medium"
                  ? "text-[24px] md:text-[28px] lg:text-[32px]"
                  : "text-[20px] md:text-[22px] lg:text-[24px]"
            }`}
          >
            {icon}
          </div>
        </div>
      )}
    </button>
  );
}

export default Button;
