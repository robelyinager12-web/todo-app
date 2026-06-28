import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { PRIORITIES, STATUSES } from '../../utils/constants';
import { toDateInputValue } from '../../utils/formatDate';

export default function TaskForm({ defaultValues, categories, onSubmit, submitLabel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      categoryId: defaultValues?.categoryId || defaultValues?.category?.id || '',
      priority: defaultValues?.priority || 'MEDIUM',
      status: defaultValues?.status || 'PENDING',
      dueDate: toDateInputValue(defaultValues?.dueDate) || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <Input
        label="Task Title"
        placeholder="e.g. Finish quarterly report"
        error={errors.title?.message}
        registration={register('title', { required: 'Title is required' })}
      />

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          placeholder="Add more detail (optional)"
          {...register('description')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('categoryId')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
          <select
            {...register('priority')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <Input label="Due Date" type="date" registration={register('dueDate')} />
      </div>

      <Button type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}