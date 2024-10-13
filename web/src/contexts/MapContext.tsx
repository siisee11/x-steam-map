import React, { createContext, useState, useContext, ReactNode, RefObject } from 'react';
import { MyEvent } from '../../lib/types/event';
import html2canvas from 'html2canvas';

interface MapContextType {
  mapRef: RefObject<HTMLDivElement> | null;
  setMapRef: React.Dispatch<React.SetStateAction<RefObject<HTMLDivElement> | null>>;
  events: MyEvent[];
  setEvents: React.Dispatch<React.SetStateAction<MyEvent[]>>;
  captureScreenshot: () => Promise<string | null>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mapRef, setMapRef] = useState<RefObject<HTMLDivElement> | null>(null);
  const [events, setEvents] = useState<MyEvent[]>([]);
//   const map = useMap();

  const captureScreenshot = async (): Promise<string | null> => {
    if (mapRef && mapRef.current) {
      try {
        const canvas = await html2canvas(mapRef.current);
        // const link = document.createElement('a');
        // link.download = 'map-screenshot.png';
        // link.href = canvas.toDataURL();
        // link.click();
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error capturing screenshot:', error);
        return null;
      }
    }
    return null;
  };

//   const captureScreenshot2 = () => {
//     leafletImage(map, (err, canvas) => {
//       if (err) {
//         console.error('Error taking screenshot:', err);
//         return;
//       }

//       // Convert the canvas to a data URL (image format)
//       const imageData = canvas.toDataURL('image/png');
      
//       // Create a link element to download the image
//       const link = document.createElement('a');
//       link.href = imageData;
//       link.download = 'map-screenshot.png';
//       link.click();
//     });
//   };


  const value: MapContextType = {
    mapRef,
    setMapRef,
    events,
    setEvents,
    captureScreenshot,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
