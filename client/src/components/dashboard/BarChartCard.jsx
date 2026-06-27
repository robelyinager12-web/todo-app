import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BarChartCard({ categories }) {
  const data = categories.map((c) => ({ name: c.name, tasks: c.taskCount }));

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Tasks per Category</h3>
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">No categories yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}