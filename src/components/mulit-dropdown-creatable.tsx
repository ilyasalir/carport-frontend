"use client";

import { KeyboardEventHandler, useEffect, useState } from "react";
import { VscLaw } from "react-icons/vsc";
import Select, { ActionMeta, MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useMediaQuery } from "usehooks-ts";

interface Option {
  label: string;
  value: any;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

interface DropdownProps {
  placeholder?: string;
  onChange?:
    | ((
        newValue: MultiValue<{
          value: any;
          label: string;
        }>
      ) => void)
    | undefined;
  value?: Option[];
  options: Option[];
  required?: boolean;
  label?: string;
  useLabel?: boolean;
  labelStyle?: string;
  guideText?: string;
  guideStyle?: string;
  id?: string;
  placement?: "top" | "bottom" | "auto";
  throwValue: (option: MultiValue<Option>) => void;
}

const MultiCreatableDropdown = ({
  placeholder,
  onChange,
  options,
  value,
  required,
  label,
  useLabel,
  labelStyle,
  guideText,
  guideStyle,
  id,
  placement = "bottom",
  throwValue,
}: DropdownProps) => {
  const screenWidth = useMediaQuery("(min-width: 1024px)");
  const [defaultOptions, setDefaultOptions] = useState<Option[]>(options);
  const [newValue, setNewValue] = useState<MultiValue<Option>>(
    value ? value : []
  );
  const [inputValue, setInputValue] = useState("");

  const handleCreate = (input: string) => {
    if (!input) return;
    else {
      const newOption = createOption(input);
      setNewValue((prev) => [...prev, newOption]);
      throwValue([...newValue, newOption]);
      setInputValue("");
    }
  };

  //   const handleCreate = (inputValue: string) => {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       const newOption = createOption(inputValue);
  //       setIsLoading(false);
  //       setDefaultOptions((prev) => [...prev, newOption]);
  //       setNewValue(newOption);
  //       throwValue(newOption);
  //     }, 1000);
  //   };
  useEffect(() => {
    setDefaultOptions(options);
  }, [options]);

  return (
    <div className="w-full flex flex-col gap-1 md:gap-2">
      {useLabel && (
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
          <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
            {label}
          </label>
          <p className={guideStyle}>{guideText}</p>
        </div>
      )}
      <CreatableSelect
        id={id}
        isMulti
        onCreateOption={handleCreate}
        required={required}
        options={defaultOptions}
        placeholder={placeholder}
        onChange={(selectedOption) => {
          setNewValue(selectedOption);
          if (onChange) onChange(selectedOption);
        }}
        onInputChange={(val) => {
          setInputValue(val);
        }}
        isSearchable={true}
        isClearable
        menuPlacement={placement}
        value={newValue}
        theme={(theme) => ({
          ...theme,
          borderRadius: 12,
          border: "2px",

          colors: {
            ...theme.colors,
            primary: "#000000",
          },
        })}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            border: state.isFocused ? "" : "2px solid #8C8C8C",
            "&:hover": {
              borderColor: state.isFocused ? "#000000" : "#000000",
            },
          }),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "12px",
            paddingBottom: "12px",
          }),
          indicatorSeparator: (baseStyles) => ({
            ...baseStyles,
            visibility: "hidden",
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            margin: "0px",
            fontFamily: "var(--font-poppins)",
            fontSize: screenWidth ? "18px" : "14px",
            fontWeight: 400,
          }),
          input: (baseStyles) => ({
            ...baseStyles,
            margin: "0px",
            padding: "0px",
            fontFamily: "var(--font-poppins)",
            fontSize: screenWidth ? "18px" : "14px",
            fontWeight: 500,
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            fontFamily: "var(--font-poppins)",
            fontSize: screenWidth ? "18px" : "14px",
            fontWeight: 500,
          }),
          menuList: (baseStyles) => ({
            ...baseStyles,
            maxHeight: 128,
            overflowY: "auto",
          }),
        }}
      />
    </div>
  );
};

export default MultiCreatableDropdown;
