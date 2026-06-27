// A single metric tile, e.g. "Total Tasks: 24". `accent` picks a left-border color
// so different metrics (overdue vs completed, etc.) are visually distinguishable.
const ACCENTS = {
  indigo: 'border-indigo-500',
  green: 'border-green-500',
  yellow: 'border-yellow-500',
  red: 'border-red-500',
  purple: 'border-purple-500',
};

export default function StatCard({ label, value, accent = 'indigo' }) {
  return (
    <div className={`rounded-xl border-l-4 bg-white p-4 shadow-sm ${ACCENTS[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}