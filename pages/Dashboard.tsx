
import React from 'react';
import { ICONS, MOCK_REPAIRS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { UserRole, ORStatus } from '../types';

const DATA_REVENUE = [
  { name: 'Lun', value: 4500 },
  { name: 'Mar', value: 3200 },
  { name: 'Mer', value: 6800 },
  { name: 'Jeu', value: 5100 },
  { name: 'Ven', value: 7200 },
  { name: 'Sam', value: 2400 },
  { name: 'Dim', value: 0 },
];

const DATA_ACTIVITY = [
  { name: 'Moteur', count: 12 },
  { name: 'Freinage', count: 18 },
  { name: 'Vidange', count: 25 },
  { name: 'Électronique', count: 8 },
  { name: 'Carrosserie', count: 5 },
];

export const Dashboard: React.FC = () => {
  const currentRole = localStorage.getItem('demo-role') as UserRole || UserRole.ADMIN;
  const currentUserId = localStorage.getItem('demo-user-id') || '1';

  if (currentRole === UserRole.MECHANIC) {
    return <MechanicDashboard userId={currentUserId} />;
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="CA Mensuel" value="45,850 €" change="+12%" icon={<ICONS.TrendingUp className="text-blue-600" />} color="blue" />
        <StatCard title="Véhicules Traités" value="142" change="+5%" icon={<ICONS.Car className="text-purple-600" />} color="purple" />
        <StatCard title="Interventions en cours" value="12" change="-2" icon={<ICONS.Clock className="text-amber-600" />} color="amber" />
        <StatCard title="Alertes Stock" value="3" change="Basse" icon={<ICONS.AlertTriangle className="text-red-600" />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Évolution du Chiffre d'Affaires</h3>
            <select className="bg-slate-50 border-slate-200 text-sm rounded-lg p-2 outline-none">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_REVENUE}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Types d'Interventions</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_ACTIVITY} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Dernières Interventions</h3>
          <p className="text-xs text-slate-400">Suivi en temps réel de l'atelier</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Véhicule</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <RecentRepairRow vehicle="Peugeot 208 (AA-123-BB)" client="Jean Dupont" type="Révision" status="Terminé" amount="185 €" />
              <RecentRepairRow vehicle="Renault Master (XY-555-ZZ)" client="Transport Express" type="Freinage" status="En cours" amount="420 €" />
              <RecentRepairRow vehicle="BMW Série 1 (BC-456-DE)" client="Sophie Martin" type="Électronique" status="En attente" amount="120 €" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MechanicDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const myTasks = MOCK_REPAIRS.filter(r => r.mechanicId === userId);
  const inProgress = myTasks.filter(r => r.status === ORStatus.IN_PROGRESS).length;
  const finishedToday = myTasks.filter(r => r.status === ORStatus.FINISHED).length;
  
  const pieData = [
    { name: 'Terminés', value: finishedToday },
    { name: 'En cours', value: inProgress },
    { name: 'En attente', value: myTasks.length - finishedToday - inProgress },
  ];
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Mes Tâches Actives" value={inProgress.toString()} change="Aujourd'hui" icon={<ICONS.Play className="text-blue-600" />} color="blue" />
        <StatCard title="Terminées" value={finishedToday.toString()} change="Ce jour" icon={<ICONS.CheckCircle2 className="text-green-600" />} color="green" />
        <StatCard title="Temps Moyen / Tâche" value="1.5h" change="-10%" icon={<ICONS.Clock className="text-purple-600" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-slate-800 mb-6 self-start">Répartition de ma Charge de Travail</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
             {pieData.map((d, i) => (
               <div key={d.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                 <span className="text-xs font-bold text-slate-600">{d.name} ({d.value})</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Tâches Prioritaires</h3>
          <div className="space-y-4">
            {myTasks.slice(0, 3).map(task => (
              <div key={task.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${task.status === ORStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                    <ICONS.Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{task.id}</p>
                    <p className="text-xs text-slate-500">{task.reportedProblem}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${task.status === ORStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  {task.status}
                </span>
              </div>
            ))}
            {myTasks.length === 0 && <p className="text-center py-10 text-slate-400">Aucune tâche assignée pour le moment.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; color: string }> = ({ title, value, change, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50`}>
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
        {change}
      </span>
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

const RecentRepairRow: React.FC<{ vehicle: string; client: string; type: string; status: string; amount: string }> = ({ vehicle, client, type, status, amount }) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="px-6 py-4">
      <div className="font-semibold text-slate-700">{vehicle}</div>
    </td>
    <td className="px-6 py-4 text-slate-600 text-sm">{client}</td>
    <td className="px-6 py-4">
      <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">{type}</span>
    </td>
    <td className="px-6 py-4">
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
        status === 'Terminé' ? 'bg-green-100 text-green-700' :
        status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 font-bold text-slate-800 text-right">{amount}</td>
  </tr>
);
