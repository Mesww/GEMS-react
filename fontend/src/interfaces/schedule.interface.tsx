export interface AigenSchedule{
    busId: string;
    route: string;
    schedule: Schedule[];
}

export interface Schedule{
   station: string;
   departureTime: string;
}