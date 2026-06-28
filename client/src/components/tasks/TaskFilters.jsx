import { PRIORITIES, STATUSES } from '../../utils/constants';

export default function TaskFilters({ filters, onChange, categories, view, onViewChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.q}
        onChange={(e) => update('q', e.target.value)}
        className="min-w-[180px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
      />

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => update('priority', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={`${filters.sortBy}:${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split(':');
            onChange({ ...filters, sortBy, order });
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="dueDate:asc">Due Date</option>
          <option value="priority:desc">Priority</option>
          <option value="title:asc">Title A-Z</option>
        </select>
      </div>

      <div className="flex rounded-lg border border-gray-300 p-0.5 sm:ml-auto">
        <button
          onClick={() => onViewChange('table')}
          className={`rounded-md px-3 py-1 text-sm ${
            view === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-600'
          }`}
        >
          Table
        </button>
        <button
          onClick={() => onViewChange('card')}
          className={`rounded-md px-3 py-1 text-sm ${
            view === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-600'
          }`}
        >
          Cards
        </button>
      </div>
    </div>
  );
}