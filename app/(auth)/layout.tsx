export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-yey-dark-bg via-yey-blue/20 to-yey-turquoise/10">
        <div className="relative z-10 px-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            YEY <span className="text-yey-yellow">CLUB</span>
          </h1>
          <p className="mt-4 text-lg text-yey-ice-blue/70">
            Durma Sende YEY&apos;le
          </p>
          <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-yey-yellow/60" />
        </div>

        <div className="pointer-events-none absolute -left-10 top-20 h-72 w-72 rounded-full bg-yey-yellow/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-yey-turquoise/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-1/2 h-48 w-48 rounded-full bg-yey-red/5 blur-2xl" />
      </div>

      <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
