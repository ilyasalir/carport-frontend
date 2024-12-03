"use client";

import { useState } from "react";

function TextAreaField({
  id,
  placeholder,
  value,
  required,
  useLabel,
  labelText,
  guideText,
  labelStyle,
  guideStyle,
  onChange,
  isDisabled = false,
  invalidMessage,
  readOnly,
}: {
  id?: string;
  placeholder: string;
  value?: string | undefined;
  required?: boolean;
  useLabel?: boolean;
  labelText?: string;
  guideText?: string;
  labelStyle?: string;
  guideStyle?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  isDisabled?: boolean;
  invalidMessage?: string;
  readOnly?: boolean;
}) {
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setCurrentValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="w-full font-poppins">
      {useLabel && (
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
          <label
            htmlFor={id}
            className={`${labelStyle} ${
              required
                ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary"
                : ""
            }`}
          >
            {labelText}
          </label>
          <p className={guideStyle}>{guideText}</p>
        </div>
      )}
      <div
        className={`w-full px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 ${
          invalidMessage
            ? "border-red-secondary"
            : "border-gray-subtext hover:border-black focus-within:border-black"
        } rounded-[12px] mt-1 md:mt-2`}
      >
        <textarea
          id={id}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleInput}
          className="w-full focus:outline-none resize-none overflow-hidden"
          style={{ height: "auto", minHeight: "100px" }}
          disabled={isDisabled}
          readOnly={readOnly}
          required={required}
        />
      </div>
      {invalidMessage && (
        <p className="text-[12px] text-red-secondary mt-2">{invalidMessage}</p>
      )}
    </div>
  );
}

export default TextAreaField;
