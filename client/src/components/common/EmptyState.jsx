export default function EmptyState({ message = 'Nothing here yet', action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 text-center shadow-sm">
      <p className="mb-4 text-sm text-gray-500">{message}</p>
      {action}
    </div>
  );
}