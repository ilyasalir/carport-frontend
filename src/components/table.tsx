import { ReactNode } from "react";

function Table({
  data,
  header,
  addedItems,
  isLoading,
}: {
  data: any[];
  header: any[];
  addedItems?: ReactNode;
  isLoading: boolean;
}) {
  const Load = () => {
    const dummy = [1, 2, 3, 4, 5];
    return dummy.map((idx: number) => (
      <tr key={idx}>
        {header.map((idx: number) => {
          return (
            <td
              key={idx}
              className="h-auto w-auto border-collapse px-2 py-1 text-[14px] md:text-[16px] text-center lg:px-4"
            >
              <div className="h-4 w-full animate-pulse bg-gray-subtext bg-opacity-10"></div>
            </td>
          );
        })}
      </tr>
    ));
  };
  const renderCell = (cell: any) => {
    if (Array.isArray(cell)) {
      return (
        <ul className="list-disc pl-5 text-start w-full">
          {cell.map((item: any, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    } else {
      return cell;
    }
  };
  return (
    <>
      <div className="flex overflow-auto">
        <table className="w-full overflow-visible">
          <thead>
            <tr>
              {header.map((head: any, idx: number) => {
                return (
                  <th
                    key={idx}
                    className="h-auto w-auto border-collapse text-white bg-dark-maintext px-1 lg:px-2 py-1 text-[14px] md:text-[16px] text-center font-normal truncate"
                  >
                    {head}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Load />
            ) : data.length > 0 ? (
              Object.values(data).map((obj: any, idx: number) => {
                return (
                  <tr
                    key={idx}
                    className={`overflow-visible text-dark-maintext ${idx % 2 == 0 ? "bg-white" : "bg-gray-subtext bg-opacity-10"}`}
                  >
                    {Object.values(obj).map((cell: any, idx: number) => {
                      return (
                        <td
                          key={idx}
                          className="h-auto w-auto border-collapse px-1 lg:px-2 py-2 text-[14px] md:text-[16px] text-center min-w-max align-top"
                        >
                          {renderCell(cell)}
                        </td>
                      );
                    })}
                    {addedItems && (
                      <td className="h-auto w-auto border-collapse px-1 lg:px-2 py-2 text-[14px] md:text-[16px] text-center min-w-max align-top">
                        {addedItems}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <td colSpan={header.length}>
                <p className="text-[14px] md:text-[16px] text-center py-5">
                  Data tidak ditemukan
                </p>
              </td>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
