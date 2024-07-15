import React from 'react';
import { Marker, InfoWindow } from '@vis.gl/react-google-maps';

interface TrackerData {
  position: string;
}

interface FetchData {
  status: string;
  data: {
    [key: string]: TrackerData;
  };
}

interface SelectedMarker {
  key: string;
  value: TrackerData;
}

const StationMarker: React.FC<{
  position: FetchData;
  selectedMarker: SelectedMarker | null;
  setSelectedMarker: (marker: SelectedMarker | null) => void;
}> = ({ position, selectedMarker, setSelectedMarker }) => {
  if (!position.data) return null;

  return (
    <>
      {Object.entries(position.data).map(([key, value]) => {
        if (value && value.position) {
          const [lat, lng] = value.position.split(',').map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            return (
              <React.Fragment key={key}>
                <Marker
                  position={{ lat, lng }}
                  title={`ป้ายหมายเลข: ${key}`}
                  onClick={() => setSelectedMarker({ key, value })}
                />
                {selectedMarker && selectedMarker.key === key && (
                  <InfoWindow
                    position={{ lat, lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                    headerContent={`ป้ายหมายเลข ${key}`}
                  >
                    {/* InfoWindow content */}
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          }
        }
        return null;
      })}
    </>
  );
};

export default StationMarker;
