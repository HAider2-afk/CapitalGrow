import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useApp } from '../../context/AppContext';

interface PerformanceChartProps {
  isDark?: boolean;
}

const TIMEFRAMES = ['1M', '3M', '6M', '1Y', 'ALL'] as const;

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ isDark = false }) => {
  const { currency } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [activeTf, setActiveTf] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');

  const dataSetsByTf = {
    '1M': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [176000, 178500, 181200, 184320]
    },
    '3M': {
      labels: ['Jun', 'Jul', 'Aug'],
      data: [168000, 176000, 184320]
    },
    '6M': {
      labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      data: [150000, 158000, 162000, 171000, 176000, 184320]
    },
    '1Y': {
      labels: ['Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jul', 'Aug'],
      data: [120000, 132000, 140000, 150000, 162000, 176000, 184320]
    },
    'ALL': {
      labels: ['2024', 'Q1 2025', 'Q3 2025', 'Q1 2026', 'Current'],
      data: [95000, 115000, 138000, 160000, 184320]
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentData = dataSetsByTf[activeTf];
    const lineColor = '#10B981';
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(99, 91, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(99, 91, 255, 0.00)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: currentData.labels,
        datasets: [
          {
            label: 'Portfolio Value',
            data: currentData.data,
            borderColor: lineColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#0B0F17' : '#131926',
            titleColor: '#34D399',
            bodyColor: '#FFFFFF',
            titleFont: { family: 'JetBrains Mono', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 13, weight: 'bold' },
            padding: 12,
            boxPadding: 6,
            cornerRadius: 8,
            borderColor: 'rgba(99, 91, 255, 0.3)',
            borderWidth: 1,
            callbacks: {
              label: (context) => ` Total: ${currency} ${(context.parsed.y ?? 0).toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: isDark ? '#94A3B8' : '#475569',
              font: { family: 'Work Sans', size: 12 }
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
  }, [activeTf, isDark, currency]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider text-[#475569]">Performance Curve</span>
        </div>
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTf(tf)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                activeTf === tf
                  ? 'bg-[#10B981] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#131926] dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full relative">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
