export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
  <footer className="w-full border-t border-zinc-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-sm text-zinc-600">
          &copy; {currentYear} TUT-RE. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
