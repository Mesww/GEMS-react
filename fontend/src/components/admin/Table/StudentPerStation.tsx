import { useState } from "react";
import {
  headerTime,
  StudentPerStations,
} from "../../../interfaces/schedule.interface";

const StudentPerStationsTable: React.FC<{
  aigendata: StudentPerStations[];
  
}> = ({ aigendata }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  // Calculate total pages
  const totalPages = Math.ceil(aigendata.length / ITEMS_PER_PAGE);

  // Compute data for the current page
  const currentData = aigendata.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="w-full ">
      <div className="rounded-lg overflow-x-scroll overflow-y-scroll max-h-[50vh]">
        <table className=" divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route/Time
              </th>
              {headerTime.map((time, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((route, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.station}
                </td>
                {route.amountofStudent.map((slot, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {slot}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white flex justify-end items-center rounded-b-xl">
        <button
          className=" px-4 py-2  text-gray-800 rounded-full material-icons "
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {currentPage === 1 ? "close" : "arrow_back"}
        </button>
        <span>
           {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2  text-gray-800 rounded-full material-icons"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {currentPage === totalPages ? "close" :  "arrow_forward"}
        </button>
      </div>
    </div>
  );
};
export default StudentPerStationsTable;
