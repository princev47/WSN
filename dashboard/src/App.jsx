import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import Card from './components/Card';
import ChartContainer from './components/ChartContainer';
import TableView from './components/TableView';

const pages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'layer1', label: 'Layer 1' },
  { id: 'layer2', label: 'Layer 2' },
  { id: 'layer3', label: 'Layer 3' },
  { id: 'reports', label: 'Reports' }
];

const chartColors = {
  blocked: '#ef4444',
  allowed: '#22c55e',
  suspicious: '#facc15',
  normal: '#10b981'
};

const dummyDashboard = {
  total_records: 5293,
  layer1_flagged: 1739,
  layer2_flagged: 2256,
  layer3_blocked: 2222,
  allowed: 3071,
  metrics: {
    precision: 0.2574,
    recall: 0.5489,
    f1_score: 0.3505,
    accuracy: 0.7651,
    roc_auc: 0.6919
  }
};

const dummyLayer2 = {
  metrics: {
    accuracy: 0.7651,
    roc_auc: 0.6919,
    cv_f1_mean: 0.3866,
    cv_f1_std: 0.0325,
    feature_importances: {
      packet_rate: 0.1633,
      pkt_zscore: 0.1439,
      energy_pkt_ratio: 0.1005,
      pkt_rate_rolling_mean: 0.0921,
      energy_drop_rate_mean: 0.0797,
      energy_drop_rate: 0.0748
    }
  },
  confusion_matrix: {
    tp: 95,
    tn: 918,
    fp: 141,
    fn: 170
  }
};

const dummyLayer3 = {
  summary: {
    total_records: 5293,
    blocked: 2222,
    allowed: 3071,
    revoked_nodes: 100,
    verified_blocks: 101
  },
  stats: {
    detection_rate: 0.8053,
    nodes_revoked: 100,
    blockchain_blocks: 101
  }
};

const dummyRecords = Array.from({ length: 12 }, (_, index) => ({
  node_id: index + 1,
  packet_rate: Math.round(20 + Math.random() * 50),
  energy_remaining: Number((Math.random() * 0.8 + 0.2).toFixed(2)),
  ml_prediction: index % 3 === 0 ? 1 : 0,
  final_status: index % 3 === 0 ? 'BLOCKED' : 'ALLOWED',
  severity: index % 3 === 0 ? 'Threat' : 'Normal'
}));

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboard, setDashboard] = useState(dummyDashboard);
  const [layer2, setLayer2] = useState(dummyLayer2);
  const [layer3, setLayer3] = useState(dummyLayer3);
  const [records, setRecords] = useState(dummyRecords);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, layer2Res, layer3Res, recordsRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/layer2'),
          fetch('/api/layer3'),
          fetch('/api/records')
        ]);

        if (!dashboardRes.ok || !layer2Res.ok || !layer3Res.ok || !recordsRes.ok) {
          throw new Error('Unable to load dashboard data');
        }

        const dashboardData = await dashboardRes.json();
        const layer2Data = await layer2Res.json();
        const layer3Data = await layer3Res.json();
        const recordsData = await recordsRes.json();

        setDashboard((prev) => ({ ...prev, ...dashboardData }));
        setLayer2((prev) => ({ ...prev, ...layer2Data }));
        setLayer3((prev) => ({ ...prev, ...layer3Data }));
        setRecords(recordsData.records || []);
      } catch (err) {
        console.warn(err);
        setError('Unable to connect to the backend. Showing fallback data.');
      }
    }
    fetchData();
  }, []);

  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records;
    if (filter === 'only-threat') return records.filter((item) => item.severity === 'Threat');
    return records.filter((item) => item.severity === 'Normal');
  }, [filter, records]);

  const overviewCards = [
    { title: 'Total Records', value: dashboard.total_records, accent: 'bg-slate-100' },
    { title: 'Layer 1 Flagged', value: dashboard.layer1_flagged, accent: 'bg-amber-100' },
    { title: 'Layer 2 Flagged', value: dashboard.layer2_flagged, accent: 'bg-yellow-100' },
    { title: 'Blocked Nodes', value: dashboard.layer3_blocked, accent: 'bg-red-100' },
    { title: 'Allowed Nodes', value: dashboard.allowed, accent: 'bg-emerald-100' }
  ];

  const barChartData = [
    { name: 'Layer 1', value: dashboard.layer1_flagged },
    { name: 'Layer 2', value: dashboard.layer2_flagged },
    { name: 'Blocked', value: dashboard.layer3_blocked }
  ];

  const pieChartData = [
    { name: 'Allowed', value: dashboard.allowed, fill: chartColors.allowed },
    { name: 'Blocked', value: dashboard.layer3_blocked, fill: chartColors.blocked }
  ];

  const featureData = Object.entries(layer2.metrics.feature_importances || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="w-full bg-slate-950 px-4 py-8 text-slate-100 lg:w-72">
          <div className="mb-8 border-b border-slate-800 pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">WSN Hybrid IDS</p>
            <h1 className="mt-3 text-2xl font-semibold">Dashboard</h1>
          </div>

          <nav className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  activePage === page.id ? 'bg-slate-800 text-white shadow-card' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-300 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live API Status</p>
            <p className="mt-3 text-base">{error ? 'Offline / Fallback mode' : 'Connected'}</p>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Overview</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">{pages.find((page) => page.id === activePage)?.label}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setFilter('all')} className={`rounded-2xl px-4 py-2 text-sm font-medium ${filter === 'all' ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                All
              </button>
              <button onClick={() => setFilter('only-threat')} className={`rounded-2xl px-4 py-2 text-sm font-medium ${filter === 'only-threat' ? 'bg-red-500 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                Only Threat
              </button>
              <button onClick={() => setFilter('only-normal')} className={`rounded-2xl px-4 py-2 text-sm font-medium ${filter === 'only-normal' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                Only Normal
              </button>
            </div>
          </div>

          {activePage === 'dashboard' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {overviewCards.map((card) => (
                  <Card key={card.title} title={card.title} value={card.value} accent={card.accent} />
                ))}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <ChartContainer title="Layer Comparison">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={barChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis dataKey="name" tick={{ fill: '#334155' }} />
                      <YAxis tick={{ fill: '#334155' }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer title="Allowed vs Blocked">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                        {pieChartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </>
          )}

          {activePage === 'layer1' && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card title="Layer 1 Flagged" value={dashboard.layer1_flagged} accent="bg-amber-100" />
              <Card title="Layer 1 Precision" value={dashboard.metrics.precision} subtitle="Precision" accent="bg-slate-100" />
              <Card title="Layer 1 Recall" value={dashboard.metrics.recall} subtitle="Recall" accent="bg-slate-100" />
              <Card title="Layer 1 F1 Score" value={dashboard.metrics.f1_score} subtitle="F1 score" accent="bg-slate-100" />
            </div>
          )}

          {activePage === 'layer2' && (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <Card title="Accuracy" value={layer2.metrics.accuracy} accent="bg-emerald-100" />
                <Card title="ROC-AUC" value={layer2.metrics.roc_auc} accent="bg-sky-100" />
                <Card title="Precision" value={dashboard.metrics.precision} accent="bg-amber-100" />
                <Card title="Recall" value={dashboard.metrics.recall} accent="bg-amber-100" />
                <Card title="F1 Score" value={dashboard.metrics.f1_score} accent="bg-amber-100" />
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <ChartContainer title="Feature Importance">
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart layout="vertical" data={featureData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis type="number" tick={{ fill: '#334155' }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#334155' }} width={140} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 8, 8]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <Card title="Confusion Matrix" accent="bg-slate-100">
                  <div className="grid gap-3 text-sm text-slate-700">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">True Positive</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{layer2.confusion_matrix.tp}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">False Positive</p>
                      <p className="mt-2 text-2xl font-semibold text-red-600">{layer2.confusion_matrix.fp}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">False Negative</p>
                      <p className="mt-2 text-2xl font-semibold text-amber-600">{layer2.confusion_matrix.fn}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">True Negative</p>
                      <p className="mt-2 text-2xl font-semibold text-emerald-600">{layer2.confusion_matrix.tn}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          {activePage === 'layer3' && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Card title="Verified Blocks" value={layer3.summary.verified_blocks} accent="bg-slate-100" />
              <Card title="Nodes Revoked" value={layer3.summary.revoked_nodes} accent="bg-red-100" />
              <Card title="Final Decisions" value={`${layer3.summary.blocked} Blocked / ${layer3.summary.allowed} Allowed`} accent="bg-slate-100" />
            </div>
          )}

          {activePage === 'reports' && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card title="Dashboard Metrics" accent="bg-slate-100">
                <div className="space-y-3 text-sm text-slate-700">
                  <p><strong>Precision:</strong> {dashboard.metrics.precision}</p>
                  <p><strong>Recall:</strong> {dashboard.metrics.recall}</p>
                  <p><strong>F1 Score:</strong> {dashboard.metrics.f1_score}</p>
                  <p><strong>Accuracy:</strong> {dashboard.metrics.accuracy}</p>
                  <p><strong>ROC-AUC:</strong> {dashboard.metrics.roc_auc}</p>
                </div>
              </Card>
              <Card title="Record Filter" accent="bg-slate-100">
                <p className="text-sm text-slate-700">Use the filters above to inspect node records by severity and status.</p>
              </Card>
            </div>
          )}

          <div className="mt-8">
            <TableView rows={filteredRecords} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
