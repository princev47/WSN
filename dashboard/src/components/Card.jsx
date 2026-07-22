export default function Card({ title, value, subtitle, accent = 'bg-white', children }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card ${accent}`}>
      <div className="p-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
