export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="skeleton h-3 w-32 rounded-sm" />
      <div className="skeleton mt-4 h-10 w-64 rounded-sm" />
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] rounded-sm" />
        ))}
      </div>
    </div>
  );
}
