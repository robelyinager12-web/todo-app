// A simple, reusable form input with label + validation error display.
// Used by every auth/task form so styling stays consistent across the app.
export default function Input({ label, type = 'text', error, registration, id, ...rest }) {
  const inputId = id || registration?.name;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...registration}
        {...rest}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-100'
        }`}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}