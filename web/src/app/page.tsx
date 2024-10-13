/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { MyEvent } from "../../lib/types/event";
import SplashScreen from "../components/splansh-screen";
import ChatBot from "../components/chatbot";
import { MapProvider } from "../contexts/MapContext";

const EventMap = dynamic(() => import("../components/event-map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const backgrounds = [
    "/cnn_background0.jpg",
    "/cnn_background1.jpg",
    "/cnn_background2.jpg",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
        setFadeOut(false);
      }, 500); // Half of the transition duration
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSplashAnimationComplete = (completed: boolean) => {
    setShowSplashScreen(false);
  };

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        toggleChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleChat]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url('${backgrounds[backgroundIndex]}')` }}
      ></div>
      
      <div className="relative z-10 flex-grow flex flex-col">
        <Head>
          <title>Interactive US Event Map</title>
          <meta name="description" content="Interactive US Event Map" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MapProvider>
            <main className="flex-grow flex flex-col items-center p-4 md:p-8 bg-white bg-opacity-80">
              <div className="flex flex-col items-center bg-black text-white p-4 rounded-lg mb-4">
                <h1 className="text-3xl font-bold mb-2">XMap</h1>
                <h3 className="text-lg text-center">
                  Real-Time Disaster Monitoring Platform that utilizes X stream data to
                  dynamically monitor, predict, and display disasters and accidents on
                  an interactive map.
                </h3>
              </div>
              <div className="flex-grow flex justify-center items-center w-full max-w-[1080px]">
                {showSplashScreen && <SplashScreen onAnimationComplete={handleSplashAnimationComplete} />}
                {!showSplashScreen && <EventMap onSelectEvent={setSelectedEvent} />}
              </div>
              {selectedEvent && (
                <div className="mt-4 bg-white bg-opacity-90 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                  <p><strong>Title:</strong> {selectedEvent.title}</p>
                  <p><strong>Latitude:</strong> {selectedEvent.geo.latitude ?? "N/A"}</p>
                  <p><strong>Longitude:</strong> {selectedEvent.geo.longitude ?? "N/A"}</p>
                  <p><strong>Emergency Level:</strong> {selectedEvent.emergency_level}</p>
                  <p><strong>Created At:</strong> {selectedEvent.created_at}</p>
                </div>
              )}
            </main>

            {/* Chat toggle button */}
            <button
              onClick={toggleChat}
              className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-20"
            >
              {isChatOpen ? "Close Chat" : "Open Chat"}
            </button>

            {/* Chat side panel */}
            <div
              className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
                isChatOpen ? "translate-x-0" : "translate-x-full"
              } z-30`}
            >
              <ChatBot />
            </div>
    </MapProvider>
      </div>
    </div>
  );
}
