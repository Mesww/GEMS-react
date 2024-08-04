import React from "react";
import { AigenSchedule } from "../../../interfaces/schedule.interface";
import "./style.sass";
const Summary:React.FC<{aigendata:AigenSchedule[]}> = ({aigendata}) => {
    return (
        <div className="bus-schedule">
          {aigendata.map((bus) => (
            <div key={bus.busId} className="bus">
              <h2>{bus.busId} - {bus.route}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Station</th>
                    <th>Departure Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bus.schedule.map((stop, index) => (
                    <tr key={index}>
                      <td>{stop.station}</td>
                      <td>{stop.departureTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      );
}
export default Summary;