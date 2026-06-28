import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from './TaskForm';

const mockCategories = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Personal' },
];

describe('TaskForm', () => {
  it('renders all expected fields', () => {
    render(<TaskForm categories={mockCategories} onSubmit={vi.fn()} submitLabel="Create Task" />);

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/category/i)).toBeInTheDocument();
    expect(screen.getByText(/priority/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('shows a validation error when title is empty', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm categories={mockCategories} onSubmit={onSubmit} submitLabel="Create Task" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /create task/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits with the entered title and default priority/status', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm categories={mockCategories} onSubmit={onSubmit} submitLabel="Create Task" />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/task title/i), 'Write unit tests');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const submittedData = onSubmit.mock.calls[0][0];
    expect(submittedData).toMatchObject({
      title: 'Write unit tests',
      priority: 'MEDIUM',
      status: 'PENDING',
    });
  });

  it('pre-fills fields when defaultValues are provided (edit mode)', () => {
    const existingTask = {
      title: 'Existing task',
      description: 'Already has a description',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      category: { id: 1, name: 'Work' },
    };

    render(
      <TaskForm
        defaultValues={existingTask}
        categories={mockCategories}
        onSubmit={vi.fn()}
        submitLabel="Save Changes"
      />
    );

    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Already has a description')).toBeInTheDocument();
  });
});