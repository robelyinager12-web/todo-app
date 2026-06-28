import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';
import { PRIORITY_COLORS, STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/formatDate';

export default function TaskCard({ task, onToggleComplete, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl bg-white p-4 shadow-sm"
    >
      <div className="mb-2 flex items-start justify-between">
        <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
        <Badge className={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
      </div>

      <h3 className={`mb-1 font-semibold ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
        {task.title}
      </h3>
      {task.description && <p className="mb-3 text-sm text-gray-500 line-clamp-2">{task.description}</p>}

      <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
        <span>{task.category?.name || 'Uncategorized'}</span>
        <span className={isOverdue(task.dueDate, task.status) ? 'font-medium text-red-600' : ''}>
          Due {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="flex items-center justify-between border-t pt-3 text-sm">
        <label className="flex items-center gap-2 text-gray-600">
          <input
            type="checkbox"
            checked={task.status === 'COMPLETED'}
            onChange={() => onToggleComplete(task)}
          />
          Done
        </label>
        <div className="flex gap-3">
          <Link to={`/tasks/${task.id}/edit`} className="text-indigo-600 hover:underline">
            Edit
          </Link>
          <button onClick={() => onDelete(task)} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}