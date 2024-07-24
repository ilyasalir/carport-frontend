import Select, { ActionMeta, SingleValue } from "react-select";
import { useMediaQuery } from "usehooks-ts";

interface DropdownProps {
  placeholder: any;
  onChange?:
    | ((
        newValue: SingleValue<{
          value: any;
          label: string;
          attribute?: boolean;
        }>
      ) => void)
    | undefined;
  value?: { value: any; label: string; attribute?: boolean };
  options: any;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  useLabel?: boolean;
  labelStyle?: string;
  guideText?: string;
  guideStyle?: string;
  id?: string;
  placement?: "top" | "bottom" | "auto";
  isOptionDisabled?: (option: any) => boolean;
}

const Dropdown = ({
  placeholder,
  onChange,
  options,
  value,
  required,
  disabled = false,
  label,
  useLabel,
  labelStyle,
  guideText,
  guideStyle,
  id,
  placement = "bottom",
  isOptionDisabled,
}: DropdownProps) => {
  const screenWidth = useMediaQuery("(min-width: 1024px)");
  return (
    <div className="w-full flex flex-col gap-1 md:gap-2">
      {useLabel && (
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 lg:items-center">
          <label htmlFor={id} className={`${labelStyle} ${required ? " after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
            {label}
          </label>
          <p className={guideStyle}>{guideText}</p>
        </div>
      )}
      <Select
        id={id}
        required={required}
        isDisabled={disabled}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
        isSearchable={true}
        isOptionDisabled={isOptionDisabled}
        isClearable
        menuPlacement={placement}
        value={value}
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
          option: (baseStyles, { isDisabled }) => ({
            ...baseStyles,
            color: isDisabled ? "black" : baseStyles.color, // Change disabled option text color to black
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }),
        }}
      />
    </div>
  );
};

export default Dropdown;
