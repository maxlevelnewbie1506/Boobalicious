export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="skeleton h-3 w-48 rounded-sm" />
      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="skeleton aspect-[3/4] w-full rounded-sm" />
        <div>
          <div className="skeleton h-3 w-24 rounded-sm" />
          <div className="skeleton mt-3 h-10 w-56 rounded-sm" />
          <div className="skeleton mt-4 h-16 w-full max-w-xl rounded-sm" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-8 w-full rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
