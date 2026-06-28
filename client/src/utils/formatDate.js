export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isOverdue(dateString, status) {
  if (!dateString || status === 'COMPLETED') return false;
  return new Date(dateString) < new Date();
}

// Converts an ISO date string into the yyyy-MM-dd format <input type="date"> expects
export function toDateInputValue(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
}