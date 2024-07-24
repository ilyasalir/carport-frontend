"use client";

import { useEffect, useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiOutlineSearch } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";

function Field({
  id,
  type,
  placeholder,
  value,
  required,
  useLabel,
  labelText,
  guideText,
  labelStyle,
  guideStyle,
  onChange,
  onChangeArea,
  isDisabled = false,
  invalidMessage,
  readOnly,
}: {
  id?: string;
  type:
    | "field"
    | "password"
    | "search"
    | "email"
    | "area"
    | "edit"
    | "edit-password";
  placeholder: any;
  value?: string | number | readonly string[] | undefined;
  required?: boolean;
  useLabel?: boolean;
  labelText?: string;
  guideText?: string;
  labelStyle?: string;
  guideStyle?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onChangeArea?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  isDisabled?: boolean;
  invalidMessage?: string;
  readOnly?: boolean;
}) {
  //password attribute
  const [showPassword, setShowPassword] = useState("password");
  const [disableField, setDisableField] = useState<boolean>(true);
  const [icon, setIcon] = useState(<AiFillEyeInvisible></AiFillEyeInvisible>);
  const handleToggle = () => {
    if (showPassword === "password") {
      setIcon(<AiFillEye></AiFillEye>);
      setShowPassword("text");
    } else {
      setIcon(<AiFillEyeInvisible></AiFillEyeInvisible>);
      setShowPassword("password");
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleEdit = () => {
    if (disableField) {
      setDisableField(false);
      inputRef.current?.focus();
    } else {
      setDisableField(true);
    }
  };

  useEffect(() => {
    if (!disableField) {
      inputRef.current?.focus();
    }
  }, [disableField]);

  return (
    <>
      {type == "field" && (
        <div className="w-full font-poppins">
          {useLabel && (
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
                {labelText}
              </label>
              <p className={guideStyle}>{guideText}</p>
            </div>
          )}
          <div
            className={`w-full flex items-center px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 ${invalidMessage ? "border-red-secondary" : "border-gray-subtext hover:border-black focus-within:border-black"} rounded-[12px] mt-1 md:mt-2`}
          >
            <input
              id={id}
              type="text"
              required={required}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="grow focus:outline-none w-full"
              disabled={isDisabled}
              readOnly={readOnly}
            />
          </div>
          {invalidMessage && (
            <p className="text-[12px] text-red-seondary mt- text-red-secondary">
              {invalidMessage}
            </p>
          )}
        </div>
      )}
      {type == "password" && (
        <div className="w-full font-poppins">
          {useLabel && (
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
                {labelText}
              </label>
              <p className={guideStyle}>{guideText}</p>
            </div>
          )}
          <div
            className={`w-full flex gap-[12px] items-center px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 ${invalidMessage ? "border-red-secondary" : "border-gray-subtext hover:border-black focus-within:border-black"} rounded-[12px] mt-1 md:mt-2 group`}
          >
            <input
              id={id}
              type={showPassword}
              required={required}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              className="grow focus:outline-none w-full"
              disabled={isDisabled}
              readOnly={readOnly}
            />
            <div
              className="text-[22px] w-fit text-gray-subtext group-focus-within:text-dark-maintext group-hover:text-dark-maintext"
              onClick={handleToggle}
            >
              {icon}
            </div>
          </div>
          {invalidMessage && (
            <p className="text-[12px] text-red-seondary mt- text-red-secondary">
              {invalidMessage}
            </p>
          )}
        </div>
      )}
      {type == "search" && (
        <div className="w-full font-poppins">
          {useLabel && (
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
                {labelText}
              </label>
              <p className={guideStyle}>{guideText}</p>
            </div>
          )}
          <div
            className={`w-full flex gap-[12px] items-center px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 ${invalidMessage ? "border-red-secondary" : "border-gray-subtext hover:border-black focus-within:border-black"} rounded-[12px] mt-1 md:mt-2 group`}
          >
            <div className="text-[22px] w-fit text-gray-subtext group-focus-within:text-dark-maintext group-hover:text-dark-maintext">
              <AiOutlineSearch />
            </div>
            <input
              id={id}
              type="text"
              required={required}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              className="grow focus:outline-none w-full"
              disabled={isDisabled}
              readOnly={readOnly}
            />
          </div>
          {invalidMessage && (
            <p className="text-[12px] text-red-seondary mt- text-red-secondary">
              {invalidMessage}
            </p>
          )}
        </div>
      )}
      {type == "email" && (
        <div className={"w-full font-poppins"}>
          {useLabel && (
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
                {labelText}
              </label>
              <p className={guideStyle}>{guideText}</p>
            </div>
          )}
          <input
            id={id}
            required={required}
            type="email"
            placeholder={placeholder}
            className={`w-full flex items-center px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 ${invalidMessage ? "border-red-secondary" : "border-gray-subtext hover:border-black focus-within:border-black"} focus:outline-black rounded-[12px] mt-1 md:mt-2`}
            onChange={onChange}
            value={value}
            disabled={isDisabled}
            readOnly={readOnly}
          />
          {invalidMessage && (
            <p className="text-[12px] text-red-seondary mt- text-red-secondary">
              {invalidMessage}
            </p>
          )}
        </div>
      )}
      {type == "area" && (
        <div className="w-full font-poppins">
          {useLabel && (
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
                {labelText}
              </label>
              <p className={guideStyle}>{guideText}</p>
            </div>
          )}
          <div
            className={`w-full flex items-center px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 ${invalidMessage ? "border-red-secondary" : "border-gray-subtext hover:border-black focus-within:border-black"} focus:outline-black rounded-[12px] mt-1 md:mt-2`}
          >
            <textarea
              id={id}
              required={required}
              placeholder={placeholder}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
              }}
              style={{ height: "auto", minHeight: "100px" }}
              value={value}
              onChange={onChangeArea}
              className="grow resize-none focus:outline-none"
              disabled={isDisabled}
              readOnly={readOnly}
            />
          </div>
          {invalidMessage && (
            <p className="text-[12px] text-red-seondary mt- text-red-secondary">
              {invalidMessage}
            </p>
          )}
        </div>
      )}
      {type == "edit" && (
        <div className="w-full font-poppins">
          {useLabel && (
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
                {labelText}
              </label>
              <p className={guideStyle}>{guideText}</p>
            </div>
          )}
          <div
            className={`w-full flex gap-[12px] items-center px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 border-gray-subtext ${invalidMessage ? "border-red-secondary" : !disableField && "hover:border-black focus-within:border-black"} rounded-[12px] mt-1 md:mt-2 group`}
          >
            <input
              id={id}
              type={"text"}
              required={required}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              disabled={disableField}
              className="grow focus:outline-none w-full"
              ref={inputRef}
              readOnly={readOnly}
            />
            <div
              className="text-[22px] w-fit text-dark-maintext group-focus-within:text-dark-maintext group-hover:text-dark-maintext"
              onClick={handleEdit}
            >
              <FiEdit3 />
            </div>
          </div>
          {invalidMessage && (
            <p className="text-[12px] text-red-seondary mt- text-red-secondary">
              {invalidMessage}
            </p>
          )}
        </div>
      )}
      {type == "edit-password" && (
        <div className="w-full font-poppins">
          {useLabel && (
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
              <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
                {labelText}
              </label>
              <p className={guideStyle}>{guideText}</p>
            </div>
          )}
          <div
            className={`w-full flex gap-[12px] items-center px-[20px] py-[12px] text-[14px] lg:text-[18px] text-dark-maintext bg-white border-2 border-gray-subtext ${invalidMessage ? "border-red-secondary" : !disableField && "hover:border-black focus-within:border-black"} rounded-[12px] mt-1 md:mt-2 group`}
          >
            <input
              id={id}
              type={showPassword}
              required={required}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              disabled={disableField}
              className="grow focus:outline-none w-full"
              ref={inputRef}
              readOnly={readOnly}
            />
            <div
              className={`text-[22px] w-fit text-gray-subtext ${!disableField && "group-focus-within:text-dark-maintext group-hover:text-dark-maintext"}`}
              onClick={disableField ? undefined : handleToggle}
            >
              {icon}
            </div>
            <div
              className="text-[22px] w-fit text-dark-maintext group-focus-within:text-dark-maintext group-hover:text-dark-maintext"
              onClick={() => {
                handleEdit();
                setShowPassword("password");
                setIcon(<AiFillEyeInvisible />);
              }}
            >
              <FiEdit3 />
            </div>
          </div>
          {invalidMessage && (
            <p className="text-[12px] text-red-seondary mt- text-red-secondary">
              {invalidMessage}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default Field;
