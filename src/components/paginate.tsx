import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Paginate({
  totalPages,
  current,
}: {
  totalPages: number;
  current: (x: number) => void | undefined;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const total = Math.ceil(totalPages)

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    current(page);
  };

  const pushPage = (pageNumbers: JSX.Element[], i: number) => {
    pageNumbers.push(
      <li
        key={i}
        className={`cursor-pointer w-8 h-8 flex justify-center items-center font-poppins font-semibold text-[14px] md:text-[16px] rounded-[4px] border-2 ${
          currentPage === i
            ? "border-blue-secondary text-blue-secondary"
            : "hover:bg-blue-secondary text-dark-maintext hover:text-white border-[#DFE3E8] hover:border-blue-secondary"
        }`}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </li>
    );
  };

  const renderPage = () => {
    const pageNumbers: JSX.Element[] = [];
    for (let i = 1; i <= total; i++) {
      if (total < 5) {
        pushPage(pageNumbers, i);
      } else {
        if (currentPage == 1 || currentPage == total) {
          if (i == 1 || i == 2 || i == total || i == total - 1) {
            pushPage(pageNumbers, i);
          } else if (i == 3) {
            pageNumbers.push(
              <li className="w-8 h-8 flex justify-center items-center font-poppins font-semibold text-[14px] md:text-[16px] rounded-[4px] border-2 text-dark-maintext border-[#DFE3E8]">
                ...
              </li>
            );
          }
        } else if (currentPage < total / 2 + 1) {
          if (i <= currentPage + 1 && i >= currentPage - 1) {
            pushPage(pageNumbers, i);
          } else if (i == currentPage + 3) {
            pageNumbers.push(
              <li className="w-8 h-8 flex justify-center items-center font-poppins font-semibold text-[14px] md:text-[16px] rounded-[4px] border-2 text-dark-maintext border-[#DFE3E8]">
                ...
              </li>
            );
          } else if (i == total) {
            pushPage(pageNumbers, i);
          }
        } else {
          if (i >= currentPage - 1 && i <= currentPage + 1) {
            pushPage(pageNumbers, i);
          } else if (i == total / 2 - 1) {
            pageNumbers.push(
              <li className="w-8 h-8 flex justify-center items-center font-poppins font-semibold text-[14px] md:text-[16px] rounded-[4px] border-2 text-dark-maintext border-[#DFE3E8]">
                ...
              </li>
            );
          } else if (i == 1) {
            pushPage(pageNumbers, i);
          }
        }
      }
    }
    return pageNumbers;
  };
  return (
    <>
      <div className="w-full">
        <ul className="flex w-auto items-center justify-center gap-2">
          <li key={"btn-left"}>
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-[4px] border-2 ${
                currentPage > 1
                  ? "bg-white text-[#C4CDD5] hover:text-blue-secondary cursor-pointer border-[#DFE3E8] hover:border-blue-secondary"
                  : "cursor-not-allowed border-[#919EAB] bg-[#919EAB] text-[#C4CDD5]"
              }
              `}
              onClick={() => {
                if (currentPage > 0) {
                  handlePageChange(currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
            >
              <IoIosArrowBack />
            </button>
          </li>
          {renderPage()}
          <li key={"btn-right"}>
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-[4px] border-2 ${
                currentPage < total
                  ? "bg-white text-[#C4CDD5] hover:text-blue-secondary cursor-pointer border-[#DFE3E8] hover:border-blue-secondary"
                  : "cursor-not-allowed border-[#919EAB] bg-[#919EAB] text-[#C4CDD5]"
              }
              `}
              onClick={() => {
                if (currentPage < total) {
                  handlePageChange(currentPage + 1);
                }
              }}
              disabled={currentPage == total}
            >
              <IoIosArrowForward />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Paginate;
