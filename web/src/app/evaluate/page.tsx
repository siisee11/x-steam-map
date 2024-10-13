"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import OctagonChart from './OctagonChart';

export default function EvalPage() {
  const [visionScores, setVisionScores] = useState<number[]>([]);
  const [miniScores, setMiniScores] = useState<number[]>([]);
  const text = "Today is Hugh Jackman's 56th birthday!";
  const imagePath = './public/example.png';
  const imagePathShow = '/example.png';

  const factors = [
    "Sentiment",
    "Aggression",
    "Urgency",
    "Virality",
    "Engage",
    "Human",
    "Economic",
    "Environment"
  ];

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await axios.post('/api/eval-grok-image', { imagePath, text });
        const { content } = response.data;
        setVisionScores(content?.split(' ').map(Number) ?? []);

        const response2 = await axios.post('/api/eval-grok-image', { text });
        const { content: content2 } = response2.data;
        setMiniScores(content2?.split(' ').map(Number) ?? []);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    }

    fetchScores();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen text-black bg-white overflow-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Grok Evaluation Results</h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Input</h2>
        <Image src={imagePathShow} alt="Example image" width={500} height={300} className="mb-4" />
        <p className="text-lg">{text}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Grok Vision Preview Results</h2>
          <div className="w-full aspect-square">
            <OctagonChart scores={visionScores} factors={factors} />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Grok Mini Results</h2>
          <div className="w-full aspect-square">
            <OctagonChart scores={miniScores} factors={factors} />
          </div>
        </div>
      </div>
    </div>
  );
}
