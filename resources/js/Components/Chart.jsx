import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b' },
        },
        x: {
            grid: { display: false },
            ticks: { color: '#64748b' },
        },
    },
};

export default function Chart({ type = 'line', data, options = {}, height = 280 }) {
    const merged = { ...defaultOptions, ...options };

    const ChartComponent = {
        line: Line,
        bar: Bar,
        doughnut: Doughnut,
    }[type] ?? Line;

    return (
        <div style={{ height: `${height}px` }}>
            <ChartComponent data={data} options={merged} />
        </div>
    );
}
