export interface AigenSchedule{
    route: string;
    schedule: Schedule[];
}

export interface Schedule{
   busID: string;
   departureTime: string;
}


export interface DepartionPerRoutes{
    route: string;
    amountofDeparture: number[] | string[];
}

export interface StudentPerStations{
    station: string;
    amountofStudent: number[] | string[];
}


// Manually collect the times in headerTime
export const headerTime = [
    "08:00:00 AM",
    "09:00:00 AM",
    "10:00:00 AM",
    "11:00:00 AM",
    "12:00:00 PM",
    "01:00:00 PM",
    "02:00:00 PM",
    "03:00:00 PM",
    "04:00:00 PM",
    "05:00:00 PM",
    "06:00:00 PM",
    "07:00:00 PM",
    "08:00:00 PM",
    "09:00:00 PM"
];