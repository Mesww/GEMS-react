import { APIProvider, Marker, Map } from "@vis.gl/react-google-maps";
import { useMemo, useState, useEffect } from "react";
import { Stations } from "../../../interfaces/station.interface";
import { useStationWebSocket } from "../../../containers/getGemsDataWebsocket/getStationWebsocket";

const MapAdminComponent = () => {
    const [stations, setStations] = useState<Stations[] | null>(null);
    const { messages } = useStationWebSocket(); // Use the WebSocket hook

    useEffect(() => {
        if (messages) {
            setStations(Array.isArray(messages) ? messages : [messages]);
        }
    }, [messages]);

    const getMarkerColor = (waitingLength: number) => {
        if (waitingLength >= 10) return "red";
        if (waitingLength >= 5) return "orange";
        if (waitingLength >= 1) return "yellow";
        return "green"; // default color (usually red)
    };

    const stationMarkers = useMemo(() => {
        if (stations) {
            return stations.map((station) => {
                if (station && station.position) {
                    const [lat, lng] = station.position.split(",").map(Number);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        const color = getMarkerColor(station.waitingLength);
                        return (
                            <Marker
                                key={station._id}
                                position={{ lat, lng }}
                                title={`Station: ${station.id}, Waiting: ${station.waitingLength}`}
                                icon={color ? `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png` : undefined}
                            />
                        );
                    }
                }
                return null;
            }).filter(Boolean);
        }
        return null;
    }, [stations]);

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
