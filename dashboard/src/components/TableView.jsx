export default function TableView({ rows }) {
  const headers = ['Node ID', 'Packet Rate', 'Energy Remaining', 'ML Prediction', 'Final Status'];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 bg-slate-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-950">Node Records</h3>
        <p className="mt-1 text-sm text-slate-500">Showing {rows.length} records.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-left font-medium uppercase tracking-[0.15em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {rows.map((item, index) => (
              <tr key={`${item.node_id}-${index}`}>
                <td className="px-4 py-4 font-medium text-slate-900">{item.node_id}</td>
                <td className="px-4 py-4">{item.packet_rate}</td>
                <td className="px-4 py-4">{item.energy_remaining}</td>
                <td className="px-4 py-4">{item.ml_prediction === 1 ? 'Threat' : 'Normal'}</td>
                <td className={`px-4 py-4 font-semibold ${item.final_status === 'BLOCKED' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {item.final_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
