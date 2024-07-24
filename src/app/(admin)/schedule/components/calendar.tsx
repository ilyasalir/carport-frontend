"use client";

import { addDays, format, startOfWeek, subWeeks } from "date-fns";
import { addWeeks } from "date-fns/addWeeks";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Calendar({
  onCurrentDay,
}: {
  onCurrentDay: (curr: Date) => void;
}) {
  var today = new Date();
  var startOfThisWeek = startOfWeek(today);

  const getWeekDates = (index: number) => {
    const startOfCurrentWeek = addWeeks(startOfThisWeek, index);
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  };

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const [weekDates, setWeekDates] = useState<Date[]>(
    getWeekDates(currentWeekIndex)
  );

  const handlePrev = () => {
    setCurrentWeekIndex((prevIndex) => prevIndex - 1);
    setWeekDates(getWeekDates(currentWeekIndex - 1));
  };

  const handleNext = () => {
    setCurrentWeekIndex((prevIndex) => prevIndex + 1);
    setWeekDates(getWeekDates(currentWeekIndex + 1));
  };

  const [currentDay, setCurrentDay] = useState<Date>(today);

  return (
    <div className="w-full flex gap-0 sm:gap-2 md:gap-5 lg:gap-2 xl:gap-9 items-center cursor-pointer">
      <div
        onClick={handlePrev}
        className="text-[18px] sm:text-[24px] text-dark-maintext hover:text-black hover:bg-yellow-secondary p-1 rounded-lg active:bg-yellow-accent"
      >
        <IoIosArrowBack />
      </div>
      <div className="grow flex justify-between items-center">
        {weekDates.map((date: Date, index: number) => (
          <div
            onClick={() => {
              setCurrentDay(date);
              onCurrentDay(date);
            }}
            key={index}
            className={`${format(date, "EEEE, MMM d yyyy") == format(today, "EEEE, MMM d yyyy") ? "border-2 border-yellow-secondary text-gray-subtext" : ""} ${format(date, "EEEE, MMM d yyyy") == format(currentDay, "EEEE, MMM d yyyy") ? "bg-yellow-secondary text-dark-maintext" : "bg-white text-gray-subtext"} w-fit rounded-[12px] sm:rounded-[20px] p-1 sm:p-2 xl:p-3 flex flex-col gap-2 items-center font-poppins text-dark-maintext`}
          >
            <p className="text-[14px] md:text-[16px] lg:text-[20px]">
              {format(date, "E")}
            </p>
            <p className="text-[20px] md:text-[28px] lg:text-[32px] font-bold">
              {format(date, "d")}
            </p>
            <p className="text-[10px] md:text-[12px] lg:text-[14px] text-center md:truncate">
              {format(date, "MMM yyyy")}
            </p>
          </div>
        ))}
      </div>
      <div
        onClick={handleNext}
        className="text-[18px] sm:text-[24px] text-dark-maintext hover:text-black hover:bg-yellow-secondary p-1 rounded-lg active:bg-yellow-accent"
      >
        <IoIosArrowForward />
      </div>
    </div>
  );
}
