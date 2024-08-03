import { useMemo, useState, useEffect } from 'react';
import { APIProvider, Marker, Map, useMap } from "@vis.gl/react-google-maps";
import { Stations } from "../../../interfaces/station.interface";
import { useStationWebSocket } from "../../../containers/getGemsDataWebsocket/getStationWebsocket";
const MapID = import.meta.env.VITE_MAPID;

const HeatmapOverlay = ({ stations }: { stations: Stations[] }) => {
    const map = useMap();
    
    useEffect(() => {
        if (!map || !stations.length) return;

        const heatmapData = stations
            .filter(station => station.waitingLength >= 1)  // Filter stations with waiting length > 1
            .map(station => {
                const [lat, lng] = station.position.split(",").map(Number);
                return {
                    location: new google.maps.LatLng(lat, lng),
                    weight: station.waitingLength
                };
            });

        if (heatmapData.length === 0) return; // Don't create heatmap if no data

        const heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map: map,
            radius: 30
        });

        return () => {
            heatmap.setMap(null);
        };
    }, [map, stations]);

    return null;
};

const MapAdminComponent = () => {
    const [stations, setStations] = useState<Stations[] | null>(null);
    const { messages } = useStationWebSocket();

    useEffect(() => {
        if (messages) {
            setStations(Array.isArray(messages) ? messages : [messages]);
        }
    }, [messages]);

    const getMarkerColor = (waitingLength: number) => {
        if (waitingLength >= 10) return "red";
        if (waitingLength >= 5) return "orange";
        if (waitingLength >= 1) return "yellow";
        return "green";
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
                mapId={MapID}
            >
                {stationMarkers}
                {stations && <HeatmapOverlay stations={stations} />}
            </Map>
        </APIProvider>
    );
};

export default MapAdminComponent;