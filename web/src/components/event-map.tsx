/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StreamTweet } from "../../lib/types/xapi";
import { MyEvent } from "../../lib/types/event";
import { stateLocations } from "../../lib/constants/map";
import { xaiMarker } from "./xai-marker";
import { useMapContext } from "../contexts/MapContext";
import html2canvas from 'html2canvas';

interface MapProps {
  onSelectEvent: (event: MyEvent) => void;
}

const EventMap: React.FC<MapProps> = ({ onSelectEvent }) => {
  return (
    <EventMapContent onSelectEvent={onSelectEvent} />
  );
};

const EventMapContent: React.FC<MapProps> = ({ onSelectEvent }) => {
  const { setMapRef, events, setEvents } = useMapContext();
  // const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [tweets, setTweets] = useState<StreamTweet[]>([]);
  const [locationToEventCount, setLocationToEventCount] = useState<
    Map<string, number>
  >(new Map());
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      setMapRef(mapRef);
    }
  }, [setMapRef]);

  useEffect(() => {
    console.log("EventMap useEffect");
    const urlParams = new URLSearchParams(window.location.search);
    const shouldStream = urlParams.get("stream") != "false";

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
              const state = Array.from(stateLocations.keys())[
                Math.floor(Math.random() * stateLocations.size)
              ];
              const location = stateLocations.get(state);
              if (!location) {
                throw new Error(`State ${state} not found`);
              }
              setLocationToEventCount((prevMap) =>
                prevMap.set(state, (prevMap.get(state) || 0) + 1)
              );
              setEvents((prevEvents: MyEvent[]) =>
                [
                  ...prevEvents,
                  {
                    title: tweet.text,
                    geo: {
                      state: state,
                      latitude: location.latitude,
                      longitude: location.longitude,
                    },
                    tweets: [tweet],
                    emergency_level: 1,
                    created_at: tweet.created_at,
                    filterRuleIds: streamTweet.matching_rules?.map((r) => r.id),
                  } as MyEvent,
                ].slice(0, 100)
              ); // at most 100 events
              console.log(tweet);
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

  const takeScreenshot = () => {
    if (mapRef.current) {
      html2canvas(mapRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'map-screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <div ref={mapRef} style={{ height: "800px", width: "100%", backgroundImage: "url('/us_map.jpg')" }} >
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
          <CircleMarker
            // key={event.created_at}
            key={index}
            center={[event.geo.latitude, event.geo.longitude]}
            radius={
              Math.log(locationToEventCount.get(event.geo.state) || 1) * 10 + 2
            }
            fillColor={index % 2 === 0 ? "yellow" : "red"}
            color="red"
            weight={1}
            opacity={0.5}
            fillOpacity={0.5}
            eventHandlers={{
              click: () => onSelectEvent(event),
            }}
          >
            <Popup>
              <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <p className="text-gray-800 mb-2">{event.title}</p>
                {event.tweets[0].evaluation && (
                  <p className="text-gray-600 mb-2">
                    sentiment: {event.tweets[0].evaluation?.sentiment}
                    aggression: {event.tweets[0].evaluation?.aggression}
                    urgency: {event.tweets[0].evaluation?.urgency}
                    virality: {event.tweets[0].evaluation?.virality}
                    engagement: {event.tweets[0].evaluation?.engagement}
                    human_impact: {event.tweets[0].evaluation?.human_impact}
                    economic_impact:{" "}
                    {event.tweets[0].evaluation?.economic_impact}
                    environmental_impact:{" "}
                    {event.tweets[0].evaluation?.environmental_impact}
                  </p>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    <a
                      href={`https://twitter.com/i/web/status/${event.tweets[0].id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on Twitter
                    </a>
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
        // )
      )}
    </MapContainer>
  </div>
  );
};

export default EventMap;
