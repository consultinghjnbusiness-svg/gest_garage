
import React, { useState } from 'react';
import { ICONS, MOCK_CLIENTS } from '../constants';

export const Clients: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Clients</h2>
          <p className="text-slate-500 text-sm">Consultez et gérez votre base de données clients.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-200"
        >
          <ICONS.Plus className="w-5 h-5" />
          Nouveau Client
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <ICONS.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, téléphone, email..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Filtres</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-500 text-xs font-bold uppercase">
                <th className="px-6 py-4">Nom / Client</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Adresse</th>
                <th className="px-6 py-4">Véhicules</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CLIENTS.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div className="font-bold text-slate-800">{client.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-medium">{client.phone}</div>
                    <div className="text-xs text-slate-400">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {client.address}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 px-2 py-1 rounded-lg text-xs font-bold text-slate-600">
                      2 Véhicules
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ICONS.FileText className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><ICONS.LogOut className="w-4 h-4 rotate-180" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouveau Client + Véhicule */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Enregistrement Complet (Client & Véhicule)</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <ICONS.LogOut className="w-6 h-6 rotate-180" />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Informations Client</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Nom / Raison Sociale</label>
                    <input type="text" placeholder="Ex: Jean Dupont" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Téléphone</label>
                      <input type="tel" placeholder="06 00 00 00 00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Email</label>
                      <input type="email" placeholder="email@exemple.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest border-b border-purple-100 pb-2">Détails Véhicule</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Marque & Modèle</label>
                    <input type="text" placeholder="Ex: Peugeot 208" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Immatriculation</label>
                    <input type="text" placeholder="Ex: AB-123-CD" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono uppercase" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest border-b border-amber-100 pb-2">Diagnostique Initial</h4>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Problème constaté / Diagnostic</label>
                  <textarea rows={3} placeholder="Symptômes décrits par le client ou premier diagnostic rapide..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
               <button onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-600 font-bold">Annuler</button>
               <button onClick={() => setShowModal(false)} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transform active:scale-95 transition-all">
                Enregistrer Client & Véhicule
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
