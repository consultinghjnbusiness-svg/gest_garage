
import React, { useState } from 'react';
import { ICONS, MOCK_PARTS } from '../constants';

export const Inventory: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleExport = () => {
    alert("Exportation CSV en cours... Le fichier sera téléchargé sous peu.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800">Gestion du Stock</h2>
          <p className="text-slate-500 text-sm">Contrôlez vos pièces détachées et évitez les ruptures.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all border border-slate-200"
          >
            Export CSV
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg"
          >
            <ICONS.Plus className="w-5 h-5" />
            Nouvelle Pièce
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StockStat title="Valeur du stock" value="12,450 €" icon={<ICONS.TrendingUp />} color="blue" />
        <StockStat title="Ruptures imminentes" value="4 articles" icon={<ICONS.AlertTriangle />} color="red" />
        <StockStat title="Mouvements (30j)" value="+124" icon={<ICONS.Clock />} color="green" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-500 text-xs font-bold uppercase">
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Désignation</th>
                <th className="px-6 py-4 text-center">En Stock</th>
                <th className="px-6 py-4 text-right">P.A (HT)</th>
                <th className="px-6 py-4 text-right">P.V (TTC)</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PARTS.map(part => (
                <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-slate-500">{part.reference}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{part.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${part.stock <= part.minStock ? 'text-red-600' : 'text-slate-700'}`}>
                      {part.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-500">{part.purchasePrice.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">{part.sellingPrice.toFixed(2)} €</td>
                  <td className="px-6 py-4">
                    {part.stock <= part.minStock ? (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Stock bas</span>
                    ) : (
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">Optimal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600" title="Ajouter stock"><ICONS.Plus className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-800" title="Fiche technique"><ICONS.FileText className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Ajouter une pièce au catalogue</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <ICONS.LogOut className="w-6 h-6 rotate-180" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Référence</label>
                  <input type="text" placeholder="REF-123" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Désignation</label>
                  <input type="text" placeholder="Nom de la pièce" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Prix d'Achat (HT)</label>
                  <input type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Prix de Vente (TTC)</label>
                  <input type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Stock Initial</label>
                  <input type="number" placeholder="0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Seuil d'alerte</label>
                  <input type="number" placeholder="5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
               <button onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-600 font-bold">Annuler</button>
               <button onClick={() => setShowModal(false)} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StockStat: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);
