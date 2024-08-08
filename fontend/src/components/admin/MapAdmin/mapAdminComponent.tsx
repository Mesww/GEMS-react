import { useMemo, useState, useEffect } from "react";
import { APIProvider, Marker, Map, useMap } from "@vis.gl/react-google-maps";
import { Stations } from "../../../interfaces/station.interface";
import { useStationWebSocket } from "../../../containers/getGemsDataWebsocket/getStationWebsocket";
import { IconButton, Drawer } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
const MapID = import.meta.env.VITE_MAPID;
const MAPAPIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// heatmap overlay ========
const HeatmapOverlay = ({ stations }: { stations: Stations[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !stations.length) return;

    const heatmapData = stations
      .filter((station) => station.waitingLength >= 1) // Filter stations with waiting length > 1
      .map((station) => {
        const [lat, lng] = station.position.split(",").map(Number);
        return {
          location: new google.maps.LatLng(lat, lng),
          weight: station.waitingLength,
        };
      });

    if (heatmapData.length === 0) return; // Don't create heatmap if no data

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 30,
    });

    return () => {
      heatmap.setMap(null);
    };
  }, [map, stations]);

  return null;
};

// map admin component ========
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
      return stations
        .map((station) => {
          if (station && station.position) {
            const [lat, lng] = station.position.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              const color = getMarkerColor(station.waitingLength);
              return (
                <Marker
                  key={station._id}
                  position={{ lat, lng }}
                  title={`Station: ${station.id}, Waiting: ${station.waitingLength}`}
                  icon={
                    color
                      ? `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
                      : undefined
                  }
                />
              );
            }
          }
          return null;
        })
        .filter(Boolean);
    }
    return null;
  }, [stations]);

  // sort stations by waiting length
  const sortedStations = useMemo(() => {
    if (!stations) return [];
    return [...stations].sort((a, b) => b.waitingLength - a.waitingLength);
  }, [stations]);


  // drawer state
  const [drawerOpen, setDrawerOpen] = useState(true);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <APIProvider apiKey={MAPAPIKEY}>
      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultZoom={15}
          defaultCenter={{ lat: 20.04954958835222, lng: 99.91135912936342 }}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={MapID}
        >
          {stationMarkers}
          {stations && <HeatmapOverlay stations={stations} />}
        </Map>
        <Drawer
          variant="persistent"
          anchor="right"
          open={drawerOpen}
          PaperProps={{
            style: {
              position: "absolute",
              width: "30%",
              height: "60%",
              maxHeight: "calc(100% - 100px)",
              bottom: "7rem",
              top: "auto",
              backgroundColor: "white",
              borderRadius: "4px 0 0 4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              padding: "8px",
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <TableContainer component={Paper}>
            <Table stickyHeader size="small" aria-label="station table">
              <TableHead>
                <TableRow>
                  <TableCell>ป้าย</TableCell>
                  <TableCell align="right">จำนวนคนที่รอ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedStations
                  .filter((station) => station.waitingLength !== 0)
                  .map((station) => (
                    <TableRow key={station._id}>
                      <TableCell component="th" scope="row">
                        {station.name}
                      </TableCell>
                      <TableCell align="right">
                        {station.waitingLength}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Drawer>
        {!drawerOpen && (
          <IconButton
            style={{
              position: "absolute",
              right: 0,
              top: "11.3rem",
              backgroundColor: "white",
              borderRadius: "4px 0 0 4px",
            }}
            onClick={toggleDrawer}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </div>
    </APIProvider>
  );
};

export default MapAdminComponent;
