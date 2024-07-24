import { LegacyRef, forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Datepicker({
  id,
  text,
  onChange,
  required,
  defaultValue = null,
  label,
  useLabel,
  labelStyle,
}: {
  id?: string;
  text: string;
  onChange?: (date: Date) => void;
  required?: boolean;
  defaultValue?: Date | null;
  label?: string;
  useLabel?: boolean;
  labelStyle?: string;
}) {
  const [startDate, setStartDate] = useState<Date | null>(defaultValue);

  //   const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  //     <button className="example-custom-input" onClick={onClick} ref={ref}>
  //       {value}
  //     </button>
  //   ));

  const CustomInput = forwardRef(
    (
      {
        value,
        onClick,
      }: {
        value?: any;
        onClick?: any;
      },
      ref: LegacyRef<HTMLInputElement> | undefined
    ) => (
      <>
        {useLabel && (
          <label htmlFor={id} className={`${labelStyle} ${required ? "after:content-['*'] after:ml-1 after:font-medium after:text-[14px] after:text-red-secondary" : ""}`}>
            {label}
          </label>
        )}
        <input
          id={id}
          required={required}
          value={value}
          placeholder={text}
          readOnly
          className={`mt-1 md:mt-2 w-full rounded-[12px] border-2 border-gray-subtext cursor-pointer px-[20px] py-[12px] text-[14px] lg:text-[18px] hover:border-black focus:border-black focus:outline-black`}
          onClick={onClick}
          ref={ref}
        />
      </>
    )
  );

  return (
    <>
      <DatePicker
        wrapperClassName="w-full rounded-[12px] border-2 border-gray-subtext"
        dateFormat={"dd/MM/yyyy"}
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        popperPlacement="bottom"
        enableTabLoop={false}
        showPopperArrow={false}
        minDate={new Date()}
        selected={
          startDate == null && defaultValue != null
            ? defaultValue
            : startDate != null && defaultValue != null
              ? startDate
              : startDate != null && defaultValue == null
                ? startDate
                : startDate
        }
        onChange={(date: Date) => {
          setStartDate(date);
          if (onChange) {
            onChange(date);
          }
        }}
        customInput={<CustomInput />}
        placeholderText={text}
      />
    </>
  );
}

Datepicker.displayName = "Datepicker"; // Provide a display name

export default Datepicker;
