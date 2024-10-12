import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Event {
  title: string;
  latitude: number;
  longitude: number;
  tweet_url: string;
}

interface MapProps {
  onSelectEvent: (event: Event) => void;
}

const EventMap: React.FC<MapProps> = ({ onSelectEvent }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  // Fix for default marker icon
  useEffect(() => {
    // delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={3}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {events.map((event, index) => (
        <Marker
          key={index}
          position={[event.latitude, event.longitude]}
          eventHandlers={{
            click: () => onSelectEvent(event),
          }}
        >
          <Popup>{event.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventMap;
