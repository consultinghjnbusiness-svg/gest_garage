
import React, { useState, useEffect } from 'react';
import { ICONS, MOCK_STAFF, StaffMember, MOCK_REPAIRS } from '../constants';
import { UserRole, ORStatus } from '../types';

export const Staff: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<StaffMember | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  // Form states for new user
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.MECHANIC);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Load staff from localStorage or use Mock
  useEffect(() => {
    const savedStaff = localStorage.getItem('garage-staff');
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    } else {
      setStaff(MOCK_STAFF);
    }
  }, []);

  const saveStaff = (updatedStaff: StaffMember[]) => {
    setStaff(updatedStaff);
    localStorage.setItem('garage-staff', JSON.stringify(updatedStaff));
  };

  const handleCreateAccount = () => {
    if (!newName || !newEmail) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }

    const newUser: StaffMember = {
      id: `u-${Date.now()}`,
      name: newName,
      role: newRole,
      email: newEmail,
      specialty: newSpecialty,
      status: 'Available',
      activeTasks: 0
    };

    saveStaff([...staff, newUser]);
    setShowModal(false);
    setNewName('');
    setNewEmail('');
    setNewSpecialty('');
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm("Supprimer ce collaborateur ?")) {
      saveStaff(staff.filter(s => s.id !== id));
    }
  };

  const pendingORs = MOCK_REPAIRS.filter(r => r.status === ORStatus.PENDING);

  const handleSimulateLogin = (member: StaffMember) => {
    localStorage.setItem('demo-role', member.role);
    localStorage.setItem('demo-user-id', member.id);
    localStorage.setItem('demo-user-name', member.name);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestion du Personnel</h2>
          <p className="text-slate-500 text-sm">Créez des comptes et gérez vos techniciens.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-200"
        >
          <ICONS.UserPlus className="w-5 h-5" />
          Créer un Compte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="relative">
            <StaffCard 
              member={member} 
              onAssign={() => setShowAssignModal(member)}
              onLogin={() => handleSimulateLogin(member)}
            />
            <button 
              onClick={() => handleDeleteStaff(member.id)}
              className="absolute top-4 left-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
              title="Supprimer le compte"
            >
              <ICONS.Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal Affectation Travail */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in zoom-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <ICONS.Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Assigner à {showAssignModal.name}</h3>
              </div>
              <button onClick={() => setShowAssignModal(null)} className="text-slate-400 hover:text-slate-600">
                <ICONS.LogOut className="w-6 h-6 rotate-180" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-3">
                {pendingORs.length > 0 ? (
                  pendingORs.map(or => (
                    <button 
                      key={or.id}
                      onClick={() => setShowAssignModal(null)}
                      className="w-full p-4 border border-slate-200 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center group"
                    >
                      <div>
                        <p className="text-xs font-mono font-bold text-blue-600">{or.id}</p>
                        <p className="text-sm font-bold text-slate-800">{or.reportedProblem}</p>
                      </div>
                      <ICONS.Plus className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 font-bold">
                    Aucune intervention en attente
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
               <button onClick={() => setShowAssignModal(null)} className="px-6 py-2 text-slate-600 font-bold">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Création Personnel */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in zoom-in">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <ICONS.UserPlus className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">Nouveau Collaborateur</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <ICONS.LogOut className="w-6 h-6 rotate-180" />
              </button>
            </div>

            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom complet</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Marc Lefebvre" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500"
                  >
                    <option value={UserRole.MECHANIC}>Mécanicien</option>
                    <option value={UserRole.RECEPTIONIST}>Réceptionniste</option>
                    <option value={UserRole.MANAGER}>Gérant</option>
                    <option value={UserRole.ADMIN}>Administrateur</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spécialité</label>
                  <input 
                    type="text" 
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Diesel, Élec..." 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email professionnel</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nom@garagemaster.com" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" 
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
               <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-400 font-black uppercase text-xs tracking-widest">Annuler</button>
               <button 
                onClick={handleCreateAccount}
                className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
               >
                 Créer le compte
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StaffCard: React.FC<{ member: StaffMember, onAssign: () => void, onLogin: () => void }> = ({ member, onAssign, onLogin }) => (
  <div className="bg-white rounded-[32px] border border-slate-200 p-6 flex flex-col gap-4 shadow-sm hover:border-blue-300 transition-all group relative overflow-hidden h-full">
    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors -z-10"></div>
    
    <div className="flex justify-between items-start pl-8">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
        {member.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
          member.status === 'Available' ? 'bg-green-100 text-green-700' :
          member.status === 'Busy' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {member.status === 'Available' ? 'Disponible' : member.status === 'Busy' ? 'Occupé' : 'Absent'}
        </span>
        <button 
          onClick={onLogin}
          className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1 mt-1"
          title="Se connecter en tant que cet utilisateur"
        >
          <ICONS.Play className="w-2 h-2" /> Login
        </button>
      </div>
    </div>
    
    <div>
      <h4 className="font-black text-slate-800 text-lg leading-tight">{member.name}</h4>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{member.role}</p>
    </div>

    {member.role === UserRole.MECHANIC && (
      <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
        <div className="flex justify-between text-[10px] font-black">
          <span className="text-slate-400 uppercase tracking-widest">Spécialité</span>
          <span className="text-blue-600 uppercase tracking-wider">{member.specialty || 'Généraliste'}</span>
        </div>
        <div className="flex justify-between text-[10px] font-black">
          <span className="text-slate-400 uppercase tracking-widest">Charge</span>
          <span className={`${member.activeTasks > 2 ? 'text-red-500' : 'text-slate-700'}`}>{member.activeTasks} tâches</span>
        </div>
      </div>
    )}

    <div className="pt-2 mt-auto flex flex-col gap-2">
      {member.role === UserRole.MECHANIC && (
        <button 
          onClick={onAssign}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-50 flex items-center justify-center gap-2"
        >
          <ICONS.Wrench className="w-3.5 h-3.5" />
          Affecter
        </button>
      )}
      <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
        Consulter Dossier
      </button>
    </div>
  </div>
);
