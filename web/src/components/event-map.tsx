/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StreamTweet } from "../../lib/types/xapi";
import { MyEvent } from "../../lib/types/event";
import { motion } from "framer-motion";
import { stateLocations } from "../../lib/constants/map";

interface MapProps {
  onSelectEvent: (event: MyEvent) => void;
}

const EventMap: React.FC<MapProps> = ({ onSelectEvent }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [tweets, setTweets] = useState<StreamTweet[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldStream = urlParams.get('stream') != 'false';
    
    if (shouldStream) {
      console.log("Starting stream");
      startStream();
    }
  }, []);

  const startStream = async () => {
    setIsStreaming(true);
    setTweets([]); // Clear existing tweets when starting a new stream

    try {
      const response = await fetch("/api/x2/tweets/search/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "start" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonString = line.slice(6); // Remove 'data: ' prefix
              const streamTweet: StreamTweet = JSON.parse(jsonString);
              const tweet = streamTweet.data;
              setTweets((prevTweets) =>
                [...prevTweets, streamTweet].slice(0, 1000)
              ); // at most 1000 tweets
              // get random state location
              const location = Array.from(stateLocations.values())[
                Math.floor(Math.random() * stateLocations.size)
              ];
              setEvents((prevEvents) =>
                [
                  ...prevEvents,
                  {
                    title: tweet.text,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    tweets: [tweet],
                    emergency_level: 1,
                    created_at: tweet.created_at,
                  } as MyEvent,
                ].slice(0, 1000)
              ); // at most 1000 tweets
              // updateTweetStats(tweet);
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to start stream:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CircleMarker
            center={[event.latitude, event.longitude]}
            radius={10}
            fillColor={"red"}
            color="red"
            weight={1}
            opacity={1}
            fillOpacity={0.8}
            eventHandlers={{
              click: () => onSelectEvent(event),
            }}
          >
            <Popup>{event.title}</Popup>
          </CircleMarker>
        </motion.div>
      ))}
    </MapContainer>
  );
};

export default EventMap;
