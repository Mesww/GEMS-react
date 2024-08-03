import { APIProvider, Marker, Map } from "@vis.gl/react-google-maps";
import { AxiosResponse } from "axios";
import { useMemo, useState, useEffect } from "react";
import { Stations } from "../../../interfaces/station.interface";
import { fetchStations } from "../../../containers/station/getStation";

const MapAdminComponent = () => {
    const [stations, setStations] = useState<AxiosResponse<Stations[]> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStations(setStations, setLoading);
    }, []);

    const getMarkerColor = (waitingLength: number) => {
        if (waitingLength >= 10) return "red";
        if (waitingLength >= 5) return "orange";
        if (waitingLength >= 1) return "yellow";
        return "green"; // default color (usually red)
    };

    const stationMarkers = useMemo(() => {
        if (stations && !loading) {
            return stations.data.map((station) => {
                if (station && station.position) {
                    const [lat, lng] = station.position.split(",").map(Number);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        const color = getMarkerColor(station.waitingLength);
                        return (
                            <Marker
                                key={station.id}
                                position={{ lat, lng }}
                                title={`Station: ${station.id}, Waiting: ${station.waitingLength}`}
                                icon={color ? `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png` : undefined}
                                // label={{
                                //     text: `ป้าย${station.id}`,
                                //     className: "",
                                //     color: "white",
                                //   }}
                            />
                        );
                    }
                }
                return null;
            }).filter(Boolean);
        }
        return null;
    }, [stations, loading]);

    return (
        <APIProvider apiKey={""}>
            <Map
                style={{ width: "100%", height: "100vh" }}
                defaultZoom={15}
                defaultCenter={{ lat: 20.045116568504863, lng: 99.89429994369891 }}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
            >
                {stationMarkers}
            </Map>
        </APIProvider>
    );
};

export default MapAdminComponent;