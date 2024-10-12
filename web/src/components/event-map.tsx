import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Event } from "../app/page";

interface MapProps {
  onSelectEvent: (event: Event) => void;
}

const EventMap: React.FC<MapProps> = ({ onSelectEvent }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const getMarkerColor = (emergencyLevel: number) => {
    switch (emergencyLevel) {
      case 1:
        return "#00FF00";
      case 2:
        return "#FFFF00";
      case 3:
        return "#FF0000";
      default:
        return "#0000FF";
    }
  };

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={5}
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {events.map((event, index) => (
        <CircleMarker
          key={index}
          center={[event.latitude, event.longitude]}
          radius={10}
          fillColor={getMarkerColor(event.emergency_level)}
          color="black"
          weight={1}
          opacity={1}
          fillOpacity={0.8}
          eventHandlers={{
            click: () => onSelectEvent(event),
          }}
        >
          <Popup>{event.title}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default EventMap;
