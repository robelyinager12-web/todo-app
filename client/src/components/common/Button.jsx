export default function Button({ children, loading, type = 'button', variant = 'primary', ...rest }) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      disabled={loading}
      {...rest}
      className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]}`}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}