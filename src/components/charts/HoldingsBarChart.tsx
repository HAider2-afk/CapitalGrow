import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { UserHolding } from '../../types';
import { useApp } from '../../context/AppContext';

interface HoldingsBarChartProps {
  holdings: UserHolding[];
  isDark?: boolean;
}

export const HoldingsBarChart: React.FC<HoldingsBarChartProps> = ({ holdings, isDark = false }) => {
  const { currency } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || holdings.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = holdings.map((h) => h.planName);
    const invested = holdings.map((h) => h.investedAmount);
    const current = holdings.map((h) => h.currentValue);

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Invested Capital',
            data: invested,
            backgroundColor: isDark ? 'rgba(102, 112, 133, 0.45)' : '#D0D5DD',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          },
          {
            label: 'Current Valuation',
            data: current,
            backgroundColor: '#10B981',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: isDark ? '#E2E8F0' : '#131926',
              font: { family: 'Work Sans', size: 12, weight: 'bold' },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#0B0F17' : '#131926',
            titleFont: { family: 'JetBrains Mono', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            padding: 12,
            boxPadding: 6,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${currency} ${(context.parsed.y ?? 0).toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: isDark ? '#94A3B8' : '#475569',
              font: { family: 'Work Sans', size: 12, weight: 'bold' }
            }
          },
          y: {
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: isDark ? '#94A3B8' : '#475569',
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (val) => `${currency} ${Number(val) / 1000}k`
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [holdings, isDark, currency]);

  return (
    <div className="h-64 w-full relative">
      <canvas ref={canvasRef} />
    </div>
  );
};
