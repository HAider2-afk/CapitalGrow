import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface MiniChartProps {
  data?: number[];
  labels?: string[];
  color?: string;
  fillColor?: string;
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data = [150000, 158000, 162000, 171000, 176000, 184320],
  labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  color = '#34D399',
  fillColor = 'rgba(143, 227, 176, 0.18)',
  height = 90
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data,
            borderColor: color,
            backgroundColor: fillColor,
            fill: true,
            tension: 0.38,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(11, 16, 38, 0.9)',
            titleFont: { family: 'JetBrains Mono', size: 11 },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` Value: Rs. ${(context.parsed.y ?? 0).toLocaleString()}`
            }
          }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, labels, color, fillColor]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }} className="relative">
      <canvas ref={canvasRef} />
    </div>
  );
};
