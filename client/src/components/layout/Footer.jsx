export default function Footer() {
  return (
    <footer className="border-t bg-white px-6 py-6 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} TaskFlow. All rights reserved.
    </footer>
  );
}