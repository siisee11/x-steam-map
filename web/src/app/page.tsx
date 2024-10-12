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
    <div>
      <Head>
        <title>Interactive US Event Map</title>
        <meta name="description" content="Interactive US Event Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Interactive US Event Map</h1>
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
