
import React, { useState, useEffect, useRef } from 'react';
import { ICONS, MOCK_MECHANICS, MOCK_REPAIRS, MOCK_CLIENTS, MOCK_VEHICLES } from '../constants';
import { ORStatus, UserRole, GarageInfo, RepairOrder } from '../types';
import { getAiDiagnostic } from '../services/geminiService';
import { DocumentTemplate } from '../components/DocumentTemplate';

export const Repairs: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [problem, setProblem] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [garageInfo, setGarageInfo] = useState<GarageInfo | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  
  // Persistence state
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);
  
  // Image states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load Garage Info
    const savedInfo = localStorage.getItem('garage-info');
    if (savedInfo) setGarageInfo(JSON.parse(savedInfo));

    // Load Repairs
    const savedRepairs = localStorage.getItem('garage-repairs');
    if (savedRepairs) {
      setRepairs(JSON.parse(savedRepairs));
    } else {
      setRepairs(MOCK_REPAIRS);
      localStorage.setItem('garage-repairs', JSON.stringify(MOCK_REPAIRS));
    }
  }, []);

  const saveRepairs = (updated: RepairOrder[]) => {
    setRepairs(updated);
    localStorage.setItem('garage-repairs', JSON.stringify(updated));
  };
  
  const currentRole = localStorage.getItem('demo-role') as UserRole || UserRole.ADMIN;
  const currentUserId = localStorage.getItem('demo-user-id') || '1';

  const [activeFilter, setActiveFilter] = useState<ORStatus | 'TOUT' | 'MY_TASKS'>(
    currentRole === UserRole.MECHANIC ? 'MY_TASKS' : 'TOUT'
  );

  const filteredRepairs = repairs.filter(r => {
    if (activeFilter === 'TOUT') return true;
    if (activeFilter === 'MY_TASKS') return r.mechanicId === currentUserId;
    return r.status === activeFilter;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImagePreview(reader.result as string);
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAskAi = async () => {
    if (!problem && !imageBase64) return;
    setLoadingAi(true);
    
    const vehicle = MOCK_VEHICLES.find(v => v.id === selectedVehicleId);
    const result = await getAiDiagnostic(problem, vehicle, imageBase64 || undefined);
    
    setAiResponse(result || "Aucune réponse de l'IA.");
    setLoadingAi(false);
  };

  const handleCreateOR = () => {
    if (!selectedVehicleId || !selectedClientId || !problem) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newOR: RepairOrder = {
      id: `OR-${new Date().getFullYear()}-${String(repairs.length + 1).padStart(3, '0')}`,
      vehicleId: selectedVehicleId,
      clientId: selectedClientId,
      entryDate: new Date().toISOString().split('T')[0],
      reportedProblem: problem,
      status: ORStatus.PENDING,
      items: [],
      totalCost: 150 // Coût estimé par défaut pour la démo
    };

    saveRepairs([newOR, ...repairs]);
    setShowModal(false);
    setProblem('');
    setSelectedVehicleId('');
    setSelectedClientId('');
    setAiResponse(null);
    setImagePreview(null);
    setImageBase64(null);
  };

  const updateORStatus = (id: string, newStatus: ORStatus) => {
    const updated = repairs.map(r => r.id === id ? { ...r, status: newStatus } : r);
    saveRepairs(updated);
  };

  const generateQuote = (repair: any) => {
    const client = MOCK_CLIENTS.find(c => c.id === repair.clientId) || MOCK_CLIENTS[0];
    const vehicle = MOCK_VEHICLES.find(v => v.id === repair.vehicleId) || MOCK_VEHICLES[0];
    
    setSelectedQuote({
      number: repair.id.replace('OR', 'DEV'),
      date: new Date().toISOString().split('T')[0],
      client,
      vehicle,
      items: repair.items.length > 0 ? repair.items : [
        { description: `Réparation : ${repair.reportedProblem}`, quantity: 1, unitPrice: repair.totalCost, total: repair.totalCost }
      ],
      total: repair.totalCost
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Interventions & Atelier</h2>
          <p className="text-slate-500 text-sm">
            {currentRole === UserRole.MECHANIC 
              ? "Gérez vos travaux assignés et mettez à jour votre avancement." 
              : "Suivez l'avancement technique de votre atelier."}
          </p>
        </div>
        {currentRole !== UserRole.MECHANIC && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-200"
          >
            <ICONS.Plus className="w-5 h-5" />
            Nouvel OR
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        <div className="flex gap-1 p-1 bg-slate-200 rounded-xl w-fit shrink-0">
          <button 
            onClick={() => setActiveFilter('TOUT')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeFilter === 'TOUT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Tous
          </button>
          {Object.values(ORStatus).map(status => (
            <button 
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                activeFilter === status ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredRepairs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepairs.map((repair) => {
            const client = MOCK_CLIENTS.find(c => c.id === repair.clientId);
            const vehicle = MOCK_VEHICLES.find(v => v.id === repair.vehicleId);
            const mechanic = MOCK_MECHANICS.find(m => m.id === repair.mechanicId);
            
            return (
              <RepairCard 
                key={repair.id}
                repair={repair}
                clientName={client?.name || 'Inconnu'}
                vehicleName={`${vehicle?.make} ${vehicle?.model}`}
                mechanicName={mechanic?.name || 'A assigner'}
                isMyTask={repair.mechanicId === currentUserId}
                currentRole={currentRole}
                onPrintQuote={() => generateQuote(repair)}
                onUpdateStatus={(status) => updateORStatus(repair.id, status)}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-12 border border-slate-200 text-center space-y-4">
          <ICONS.Wrench className="w-12 h-12 mx-auto text-slate-200" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aucune intervention trouvée</p>
        </div>
      )}

      {selectedQuote && garageInfo && (
        <DocumentTemplate 
          type="DEVIS"
          number={selectedQuote.number}
          date={selectedQuote.date}
          garage={garageInfo}
          client={selectedQuote.client}
          vehicle={selectedQuote.vehicle}
          items={selectedQuote.items}
          total={selectedQuote.total}
          onClose={() => setSelectedQuote(null)}
        />
      )}

      {/* New OR Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <ICONS.Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Nouvel Ordre de Réparation</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Atelier Technique</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <ICONS.LogOut className="w-6 h-6 rotate-180" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client</label>
                  <select 
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500"
                  >
                    <option value="">Sélectionner un client...</option>
                    {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Véhicule</label>
                  <select 
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500"
                  >
                    <option value="">Sélectionner un véhicule...</option>
                    {MOCK_VEHICLES.filter(v => !selectedClientId || v.clientId === selectedClientId).map(v => (
                      <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnostic & Problème</label>
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageChange}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all ${imagePreview ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}
                    >
                      <ICONS.Camera className="w-4 h-4" />
                      {imagePreview ? 'Photo ajoutée' : 'Ajouter photo'}
                    </button>
                    <button 
                      onClick={handleAskAi}
                      disabled={loadingAi || (!problem && !imageBase64)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                      {loadingAi ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyse...
                        </span>
                      ) : (
                        <>
                          <ICONS.ShieldCheck className="w-4 h-4" />
                          Diagnostic IA
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  {imagePreview && (
                    <div className="w-32 h-32 relative shrink-0 group">
                      <img src={imagePreview} className="w-full h-full object-cover rounded-2xl border-2 border-slate-200" alt="Preview" />
                      <button 
                        onClick={() => { setImagePreview(null); setImageBase64(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ICONS.LogOut className="w-4 h-4 rotate-180 text-white" />
                      </button>
                    </div>
                  )}
                  <textarea 
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    rows={4}
                    placeholder="Décrivez les symptômes ou saisissez un code erreur OBD..."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold resize-none"
                  />
                </div>
              </div>

              {aiResponse && (
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-3xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 mb-4 text-blue-600">
                    <ICONS.ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Expertise IA GarageMaster</span>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-700 font-medium whitespace-pre-line text-sm leading-relaxed">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
               <button onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-400 font-black uppercase text-xs tracking-widest">Annuler</button>
               <button 
                onClick={handleCreateOR}
                className="px-12 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
               >
                 Créer l'intervention
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RepairCardProps {
  repair: any;
  clientName: string;
  vehicleName: string;
  mechanicName: string;
  isMyTask: boolean;
  currentRole: UserRole;
  onPrintQuote: () => void;
  onUpdateStatus: (status: ORStatus) => void;
}

const RepairCard: React.FC<RepairCardProps> = ({ repair, clientName, vehicleName, mechanicName, isMyTask, currentRole, onPrintQuote, onUpdateStatus }) => {
  const [showDetail, setShowDetail] = useState(false);
  const isMechanic = currentRole === UserRole.MECHANIC;

  return (
    <div className={`bg-white rounded-[32px] border-2 shadow-sm p-6 space-y-4 hover:border-blue-200 transition-all flex flex-col h-full ${
      isMyTask ? 'border-amber-200 bg-amber-50/20' : 'border-slate-100'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{repair.id}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
              repair.status === ORStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
              repair.status === ORStatus.PENDING ? 'bg-slate-100 text-slate-600' : 
              repair.status === ORStatus.FINISHED ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {repair.status}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={onPrintQuote}
            className="p-2 text-slate-300 hover:text-purple-600 bg-slate-50 rounded-xl transition-all"
            title="Générer Devis"
          >
            <ICONS.FileText className="w-5 h-5" />
          </button>
          <button onClick={() => setShowDetail(true)} className="p-2 text-slate-300 hover:text-blue-600 bg-slate-50 rounded-xl transition-all">
            <ICONS.ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-black text-slate-800 text-lg">{vehicleName}</h4>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{clientName}</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 font-bold italic border-l-4 border-slate-300 flex-1">
        "{repair.reportedProblem}"
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-black mt-auto">
        <div className="flex items-center gap-2 text-slate-500 uppercase tracking-widest">
          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black">
            {mechanicName.charAt(0)}
          </div>
          {mechanicName}
        </div>
        <div className="text-slate-400 font-mono uppercase">{repair.entryDate}</div>
      </div>

      {(isMechanic || currentRole === UserRole.ADMIN) && repair.status !== ORStatus.FINISHED && repair.status !== ORStatus.DELIVERED && (
        <div className="pt-2">
          <button 
            onClick={() => {
              if (repair.status === ORStatus.PENDING) onUpdateStatus(ORStatus.IN_PROGRESS);
              else if (repair.status === ORStatus.IN_PROGRESS) onUpdateStatus(ORStatus.FINISHED);
            }}
            className="w-full py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            {repair.status === ORStatus.PENDING ? 'Démarrer les travaux' : 'Finaliser les travaux'}
          </button>
        </div>
      )}

      {showDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] w-full max-w-xl p-8 space-y-6 animate-in zoom-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Dossier Technique</h3>
                <button onClick={() => setShowDetail(false)} className="text-slate-400 hover:text-slate-600">
                  <ICONS.LogOut className="w-6 h-6 rotate-180" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Véhicule</p>
                    <p className="font-bold">{vehicleName}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Client</p>
                    <p className="font-bold">{clientName}</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Problème Signalé</p>
                  <p className="text-sm font-medium text-slate-700">{repair.reportedProblem}</p>
                </div>
                {repair.items.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Détails Prestation</p>
                    <div className="divide-y divide-slate-100">
                      {repair.items.map((item: any, i: number) => (
                        <div key={i} className="py-2 flex justify-between text-xs font-medium">
                          <span>{item.description} (x{item.quantity})</span>
                          <span>{item.total.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setShowDetail(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200">
                Fermer le dossier
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
