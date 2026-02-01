
import React, { useRef, useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { GarageInfo } from '../types';

export const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Garage Info State
  const [garageInfo, setGarageInfo] = useState<GarageInfo>({
    name: 'GarageMaster Pro',
    phone: '',
    email: '',
    address: '',
    bankAccount: '',
    registrationNumber: ''
  });

  const [isSaved, setIsSaved] = useState(false);

  // Load existing info
  useEffect(() => {
    const savedInfo = localStorage.getItem('garage-info');
    if (savedInfo) {
      setGarageInfo(JSON.parse(savedInfo));
    }
  }, []);

  const handleSaveGarageInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('garage-info', JSON.stringify(garageInfo));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = () => {
    const allData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          allData[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
          allData[key] = localStorage.getItem(key);
        }
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `sauvegarde_garage_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (window.confirm("Attention : Cela écrasera toutes vos données actuelles. Voulez-vous continuer ?")) {
          localStorage.clear();
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'object') {
              localStorage.setItem(key, JSON.stringify(value));
            } else {
              localStorage.setItem(key, value as string);
            }
          });
          alert("Données restaurées avec succès. L'application va redémarrer.");
          window.location.reload();
        }
      } catch (err) {
        alert("Erreur lors de l'importation. Le fichier est peut-être corrompu.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Voulez-vous vraiment supprimer toutes les données ? Cette action est irréversible.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configuration Système</h2>
        <p className="text-slate-500 text-sm">Identité du garage, coordonnées bancaires et sauvegardes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Garage Identity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <ICONS.Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Identité du Garage</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Apparaîtra sur vos devis et factures</p>
              </div>
            </div>

            <form onSubmit={handleSaveGarageInfo} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom commercial</label>
                  <input 
                    type="text" 
                    value={garageInfo.name}
                    onChange={(e) => setGarageInfo({...garageInfo, name: e.target.value})}
                    placeholder="Ex: Garage du Centre"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">N° Enregistrement (SIRET)</label>
                  <input 
                    type="text" 
                    value={garageInfo.registrationNumber}
                    onChange={(e) => setGarageInfo({...garageInfo, registrationNumber: e.target.value})}
                    placeholder="Ex: 123 456 789 00012"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                  <input 
                    type="tel" 
                    value={garageInfo.phone}
                    onChange={(e) => setGarageInfo({...garageInfo, phone: e.target.value})}
                    placeholder="01 23 45 67 89"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    value={garageInfo.email}
                    onChange={(e) => setGarageInfo({...garageInfo, email: e.target.value})}
                    placeholder="contact@votre-garage.com"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse postale</label>
                <textarea 
                  value={garageInfo.address}
                  onChange={(e) => setGarageInfo({...garageInfo, address: e.target.value})}
                  placeholder="123 Rue de la Mécanique, 75000 Paris"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numéro de compte (RIB / IBAN)</label>
                <input 
                  type="text" 
                  value={garageInfo.bankAccount}
                  onChange={(e) => setGarageInfo({...garageInfo, bankAccount: e.target.value})}
                  placeholder="FR76 3000 0000 0000 0000 0000 000"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono font-bold outline-none focus:border-blue-500 transition-all uppercase"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                {isSaved ? (
                  <span className="text-green-600 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <ICONS.CheckCircle className="w-5 h-5" />
                    Informations enregistrées !
                  </span>
                ) : <div />}
                <button 
                  type="submit"
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Backup & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ICONS.Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Sauvegarde</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">Exportez une copie JSON de toute votre activité.</p>
            <button 
              onClick={handleExport}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
            >
              <ICONS.Database className="w-4 h-4" />
              Export Complet
            </button>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ICONS.Upload className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Restauration</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">Réimportez un fichier de sauvegarde précédent.</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".json" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-100 transition-all flex items-center justify-center gap-2"
            >
              <ICONS.Upload className="w-4 h-4" />
              Importer JSON
            </button>
          </div>

          <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
               <ICONS.AlertTriangle className="w-5 h-5" />
               <h3 className="text-sm font-black uppercase tracking-tight">Zone Critique</h3>
            </div>
            <p className="text-[10px] text-red-700 font-bold leading-relaxed">Cette action effacera toutes les données stockées localement.</p>
            <button 
              onClick={handleReset}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
            >
              Réinitialiser à zéro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
