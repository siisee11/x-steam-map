"use client";

import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { MyEvent } from "../../lib/types/event";

const EventMap = dynamic(() => import("../components/event-map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/cnn_background.jpg')" }}>
      <Head>
        <title>Interactive US Event Map</title>
        <meta name="description" content="Interactive US Event Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-8 bg-white bg-opacity-80">
        <div className="flex flex-col items-center bg-black">
          <h1 className="text-2xl font-bold mb-4">XMap</h1>
          <h3 className="text-md mb-4">
            Real-Time Disaster Monitoring Platform that utilizes X stream data to
            dynamically monitor, predict, and display disasters and accidents on
            an interactive map.
          </h3>
        </div>
        <EventMap onSelectEvent={setSelectedEvent} />
        {selectedEvent && (
          <div className="mt-4">
            <h2>Event Details</h2>
            <p>Title: {selectedEvent.title}</p>
            <p>Latitude: {selectedEvent.latitude}</p>
            <p>Longitude: {selectedEvent.longitude}</p>
            <p>Emergency Level: {selectedEvent.emergency_level}</p>
            <p>Created At: {selectedEvent.created_at}</p>
          </div>
        )}
      </main>
    </div>
  );
}
