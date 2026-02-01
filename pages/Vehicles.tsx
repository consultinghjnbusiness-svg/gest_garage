
import React, { useState } from 'react';
import { ICONS, MOCK_VEHICLES, MOCK_CLIENTS } from '../constants';

export const Vehicles: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800">Parc Automobile</h2>
          <p className="text-slate-500 text-sm">Gérez les véhicules enregistrés et leur historique.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg"
        >
          <ICONS.Plus className="w-5 h-5" />
          Ajouter un Véhicule
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <ICONS.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher par immatriculation, marque, propriétaire..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-500 text-xs font-bold uppercase">
                <th className="px-6 py-4">Véhicule</th>
                <th className="px-6 py-4">Immatriculation</th>
                <th className="px-6 py-4">Propriétaire</th>
                <th className="px-6 py-4 text-right">Kilométrage</th>
                <th className="px-6 py-4 text-right">Année</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_VEHICLES.map(vehicle => {
                const owner = MOCK_CLIENTS.find(c => c.id === vehicle.clientId);
                return (
                  <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <ICONS.Car className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{vehicle.make} {vehicle.model}</div>
                          <div className="text-[10px] font-mono text-slate-400">{vehicle.vin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-blue-600">{vehicle.licensePlate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{owner?.name || 'Inconnu'}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-700">{vehicle.mileage.toLocaleString()} km</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-500">{vehicle.year}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600" title="Historique"><ICONS.Clock className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-800" title="Éditer"><ICONS.Wrench className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouveau Véhicule */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Nouveau Véhicule</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <ICONS.LogOut className="w-6 h-6 rotate-180" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Propriétaire</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Choisir un client...</option>
                  {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Marque</label>
                  <input type="text" placeholder="Ex: Peugeot" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Modèle</label>
                  <input type="text" placeholder="Ex: 3008" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Immatriculation</label>
                  <input type="text" placeholder="AB-123-CD" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Kilométrage</label>
                  <input type="number" placeholder="0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
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
