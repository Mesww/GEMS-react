import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation files (for example: en.json, th.json)
const resources = {
  en: {
    translation: {
      stationinfodialog: {
        origin: "Origin",
        to: "To",
        destination: "Destination",
      },
      navbar: {
        logoutDialog: {
          title: "Sign out",
          text: "Are you sure?",
          confirm: "Yes",
          cancel: "No",
        },
        route: {
          route1: "Route 1",
          route2: "Route 2",
        },
        infodialog: {
          busArrival: "Bus will arrive at your stop in {{minutes}} mins",
          busArrivalError: "Bus will arrive at your stop in ? mins",
          closestStation: "Closest station: {{stationName}} {{distance}} m.",
          findingLocation: "Finding your location...",
          distanceInfo: "About: {{distance}} meters away",
          etaInfo: "ETA: {{eta}} mins",
          markerInfo: "Station {{markerKey}}",
          selectMarker: "Please select a Station",
          searchPlaceholder: "Search for a Station",
          closeSearch: "Close",
        },
        stationMarker: {
          markerTitle: "Station: {{stationId}}",
          infoWindowHeader: "Station: {{stationId}} - {{stationName}}",
          waitingPassengers: "People waiting now: {{waitingLength}} people",
          nearbyBus: "Gems bus {{busId}} nearby, {{distance}} meters away",
          noBus: "No buses in the vicinity",
        },
        busMarker: {
          busNumber: "Bus number: {{key}}",
          direction: "Direction: {{direction}} degrees",
          speed: "Speed: {{speed}} km/h",
          currentStation: "Current station: {{station}}",
          incomingStation: "Next station: {{station}}",
          incomingEta: "Arriving at next station in {{minutes}} minutes",
          trackerTime: "Tracker time: {{time}}",
          serverTime: "Server time: {{time}}",
        },
      },
    },
  },

  th: {
    translation: {
      stationinfodialog: {
        origin: "ต้นทาง",
        to: "ถึง",
        destination: "ปลายทาง",
      },
      navbar: {
        logoutDialog: {
          title: "ออกจากระบบ",
          text: "คุณแน่ใจหรือ?",
          confirm: "ใช่",
          cancel: "ไม่ใช่",
        },
        route: {
          route1: "สาย 1",
          route2: "สาย 2",
        },
        infodialog: {
          busArrival: "รถจะถึงป้ายคุณในอีก {{minutes}} นาที",
          busArrivalError: "รถจะถึงป้ายคุณในอีก ? นาที",
          closestStation: "ป้ายที่ใกล้คุณ {{stationName}} {{distance}} เมตร",
          findingLocation: "กำลังหาตำแหน่งของคุณ...",
          distanceInfo: "ห่างประมาณ {{distance}} เมตร",
          etaInfo: "ใช้เวลาประมาณ {{eta}} นาที",
          markerInfo: "ป้ายหมายเลข {{markerKey}}",
          selectMarker: "โปรดเลือกป้ายที่จะไป",
          searchPlaceholder: "ค้นหาป้าย",
          closeSearch: "ปิด",
        },
        stationMarker: {
          markerTitle: "ป้ายหมายเลข: {{stationId}}",
          infoWindowHeader: "ป้ายหมายเลข {{stationId}} - {{stationName}}",
          waitingPassengers: "คนที่รอในขณะนี้: {{waitingLength}} คน",
          nearbyBus:
            "มีรถ Gems หมายเลข {{busId}} อยู่ใกล้เคียงในระยะ {{distance}} เมตร",
          noBus: "ไม่มีรถในระยะ",
        },
        busMarker: {
            "busNumber": "รถเจมหมายเลข: {{key}}",
            "direction": "ทิศทาง: {{direction}} องศา",
            "speed": "ความเร็ว: {{speed}} km/h",
            "currentStation": "สถานีปัจจุบัน: {{station}}",
            "incomingStation": "สถานีต่อไป: {{station}}",
            "incomingEta": "จะถึงสถานีต่อไปอีก {{minutes}} นาที",
            "trackerTime": "เวลา Tracker: {{time}}",
            "serverTime": "เวลา Server: {{time}}",
        }
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default i18n;
