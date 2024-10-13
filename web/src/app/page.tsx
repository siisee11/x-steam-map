"use client";

import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { MyEvent } from "../../lib/types/event";
import SplashScreen from "../components/splansh-screen";

const EventMap = dynamic(() => import("../components/event-map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  
  const handleSplashAnimationComplete = (completed: boolean) => {
    setShowSplashScreen(false);
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col" style={{ backgroundImage: "url('/cnn_background.jpg')" }}>
      <Head>
        <title>Interactive US Event Map</title>
        <meta name="description" content="Interactive US Event Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow flex flex-col p-4 md:p-8 bg-white bg-opacity-80">
        <div className="flex flex-col items-center bg-black text-white p-4 rounded-lg mb-4">
          <h1 className="text-3xl font-bold mb-2">XMap</h1>
          <h3 className="text-lg text-center">
            Real-Time Disaster Monitoring Platform that utilizes X stream data to
            dynamically monitor, predict, and display disasters and accidents on
            an interactive map.
          </h3>
        </div>
        <div className="flex-grow">
          {showSplashScreen && <SplashScreen onAnimationComplete={handleSplashAnimationComplete} />}
          {!showSplashScreen && <EventMap onSelectEvent={setSelectedEvent} />}
        </div>
        {selectedEvent && (
          <div className="mt-4 bg-white bg-opacity-90 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Event Details</h2>
            <p><strong>Title:</strong> {selectedEvent.title}</p>
            <p><strong>Latitude:</strong> {selectedEvent.latitude}</p>
            <p><strong>Longitude:</strong> {selectedEvent.longitude}</p>
            <p><strong>Emergency Level:</strong> {selectedEvent.emergency_level}</p>
            <p><strong>Created At:</strong> {selectedEvent.created_at}</p>
          </div>
        )}
      </main>
    </div>
  );
}
