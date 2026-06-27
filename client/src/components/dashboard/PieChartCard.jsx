import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  Completed: '#22c55e',
  Pending: '#f59e0b',
  'In Progress': '#6366f1',
};

export default function PieChartCard({ stats }) {
  const data = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inProgress },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Status Breakdown</h3>
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">No tasks yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}