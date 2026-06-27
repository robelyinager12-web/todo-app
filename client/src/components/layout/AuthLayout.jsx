// Shared visual shell for Login, Register, Forgot/Reset Password —
// keeps every auth page consistently centered with the same card style.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mb-6 text-sm text-gray-500">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}