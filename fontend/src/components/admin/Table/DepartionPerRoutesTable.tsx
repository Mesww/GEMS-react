import { DepartionPerRoutes, headerTime } from "../../../interfaces/schedule.interface"

const DepartionPerRoutesTable:React.FC<{aigendata:DepartionPerRoutes[]}> = ({aigendata}) => {
    return( <div className="min-w-full  border-8 border-yellow-500 rounded-xl overflow-scroll">
        <table className="divide-y  divide-gray-200">
              <thead className="bg-gray-100">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route/Time</th>
                      {headerTime.map((time, index) => (
                          <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{time}</th>
                      ))}
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {aigendata.map((route, rowIndex) => (
                      <tr key={rowIndex}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.route}</td>
                          {route.amountofDeparture.map((slot, colIndex) => (
                              <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot}</td>
                          ))}
                      </tr>
                  ))}
              </tbody>
          </table>

      </div>)
}
export default DepartionPerRoutesTable;