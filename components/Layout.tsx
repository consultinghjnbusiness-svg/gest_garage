
import React, { useState } from 'react';
import { NAV_ITEMS, MOCK_USER, ICONS } from '../constants';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Realized "LoggedIn" user from simulation
  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem('demo-user-id') || MOCK_USER.id,
    role: localStorage.getItem('demo-role') as UserRole || MOCK_USER.role,
    name: localStorage.getItem('demo-user-name') || MOCK_USER.name,
    email: MOCK_USER.email
  });

  const switchRole = () => {
    const nextRole = currentUser.role === UserRole.ADMIN ? UserRole.MECHANIC : UserRole.ADMIN;
    localStorage.setItem('demo-role', nextRole);
    // Reset to generic demo users when switching roles via header toggle
    if (nextRole === UserRole.MECHANIC) {
      localStorage.setItem('demo-user-id', 'm1');
      localStorage.setItem('demo-user-name', 'Marc L. (Demo)');
    } else {
      localStorage.setItem('demo-user-id', '1');
      localStorage.setItem('demo-user-name', 'Admin Garage');
    }
    window.location.reload(); 
  };

  const filteredNavItems = NAV_ITEMS.filter(item => 
    item.roles.includes(currentUser.role)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-20`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <ICONS.Wrench className="w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">GarageMaster</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <button 
            onClick={switchRole}
            className="w-full flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-slate-700 transition-colors"
          >
            <ICONS.ShieldCheck className="w-4 h-4" />
            {isSidebarOpen ? `Changer de Rôle` : ''}
          </button>

          <div className="flex items-center gap-3 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentUser.role === UserRole.MECHANIC ? 'bg-amber-100 border-amber-300' : 'bg-blue-100 border-blue-300'}`}>
              <ICONS.UserCircle className={`w-6 h-6 ${currentUser.role === UserRole.MECHANIC ? 'text-amber-600' : 'text-blue-600'}`} />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-tighter">{currentUser.role}</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="w-full mt-2 flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors group"
          >
            <ICONS.LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-medium">Réinitialiser</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
               <ICONS.LayoutDashboard className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-extrabold text-slate-800">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
                <ICONS.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Recherche globale..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
             </div>
             <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                    <ICONS.AlertTriangle className="w-5 h-5" />
                </button>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};
