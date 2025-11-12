import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-purple-500/50">
            <span className="text-4xl font-bold text-white">TR</span>
          </div>
          
          <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl">
            Bienvenido a TUT-RE
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Simplificamos tus procesos con soluciones tecnológicas modernas.
            Comienza ahora y descubre cómo podemos ayudarte.
          </p>

          {/* CTA Button */}
          <Link
            href="/forms"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-black"
          >
            <span className="relative flex items-center gap-3">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Ir al Formulario
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
