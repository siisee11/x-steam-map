import React, { useEffect, useRef } from 'react';

interface OctagonChartProps {
  scores: number[];
  factors: string[];
}

const OctagonChart: React.FC<OctagonChartProps> = ({ scores, factors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Draw octagon
    ctx.beginPath();
    ctx.strokeStyle = 'pink';
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4 - Math.PI / 8;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Draw score lines, labels, and scores
    scores.forEach((score, index) => {
      const angle = index * Math.PI / 4 - Math.PI / 8;
      const scoreRadius = (score / 5) * radius;
      const x = centerX + scoreRadius * Math.cos(angle);
      const y = centerY + scoreRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'pink';
      ctx.stroke();

      const labelX = centerX + (radius + 30) * Math.cos(angle);
      const labelY = centerY + (radius + 30) * Math.sin(angle);
      
      // Draw factor label
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(factors[index], labelX, labelY);

      // Draw score as bold, black, big text
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'black';
      const scoreX = centerX + (radius * 0.8) * Math.cos(angle);
      const scoreY = centerY + (radius * 0.8) * Math.sin(angle);
      ctx.fillText(score.toString(), scoreX, scoreY);
    });

    // Connect score points
    ctx.beginPath();
    scores.forEach((score, index) => {
      const angle = index * Math.PI / 4 - Math.PI / 8;
      const scoreRadius = (score / 5) * radius;
      const x = centerX + scoreRadius * Math.cos(angle);
      const y = centerY + scoreRadius * Math.sin(angle);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 192, 203, 0.2)'; // Light pink with transparency
    ctx.fill();
    ctx.strokeStyle = 'pink';
    ctx.stroke();

  }, [scores, factors]);

  return <canvas ref={canvasRef} width={400} height={400} />;
};

export default OctagonChart;
