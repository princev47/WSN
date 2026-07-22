export default function ChartContainer({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="h-full">{children}</div>
    </div>
  );
}
