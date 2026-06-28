import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { PRIORITY_COLORS, STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/formatDate';

export default function TaskTable({ tasks, onToggleComplete, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.status === 'COMPLETED'}
                    onChange={() => onToggleComplete(task)}
                    className="h-4 w-4"
                  />
                  <span className={task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}>
                    {task.title}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{task.category?.name || 'Uncategorized'}</td>
              <td className="px-4 py-3">
                <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
              </td>
              <td className={`px-4 py-3 ${isOverdue(task.dueDate, task.status) ? 'font-medium text-red-600' : 'text-gray-600'}`}>
                {formatDate(task.dueDate)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link to={`/tasks/${task.id}/edit`} className="mr-3 text-indigo-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => onDelete(task)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}