
import React, { useState } from 'react';
import { ICONS, MOCK_TRANSACTIONS, MOCK_BANK_ACCOUNTS, MOCK_CLOSURES } from '../constants';
import { TransactionType, PaymentMethod, Transaction, BankAccount, CashClosure } from '../types';

type FinanceTab = 'CAISSE' | 'BANQUE' | 'CLOTURES';

export const CashManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('CAISSE');
  const [showTxModal, setShowTxModal] = useState(false);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Caisse calculations
  const cashTransactions = MOCK_TRANSACTIONS.filter(t => t.paymentMethod === PaymentMethod.CASH || t.paymentMethod === PaymentMethod.MOBILE_MONEY);
  const totalCashIn = cashTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
  const totalCashOut = cashTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
  const currentCash = totalCashIn - totalCashOut;

  // Bank calculations
  const totalBankBalance = MOCK_BANK_ACCOUNTS.reduce((acc, b) => acc + b.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Trésorerie & Finance</h2>
          <p className="text-slate-500 text-sm">Contrôlez vos fonds en caisse et vos comptes bancaires.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowTransferModal(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl flex items-center gap-2 font-bold transition-all border border-slate-200"
          >
            <ICONS.ArrowRightLeft className="w-5 h-5" />
            Dépôt en banque
          </button>
          <button 
            onClick={() => setShowTxModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-200"
          >
            <ICONS.Plus className="w-5 h-5" />
            Opération
          </button>
        </div>
      </div>

      {/* Financial Overview Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
          <ICONS.Wallet className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Disponible en Caisse</p>
          <p className="text-3xl font-black">{currentCash.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setActiveTab('CLOTURES')} className="text-[10px] bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-black uppercase transition-colors backdrop-blur-sm">
              Clôturer la journée
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ICONS.Building2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actif Bancaire</span>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalBankBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
            <p className="text-xs text-slate-400 font-bold mt-1">{MOCK_BANK_ACCOUNTS.length} comptes actifs</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <ICONS.TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Trésorerie</span>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{(totalBankBalance + currentCash).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
            <p className="text-xs text-green-600 font-bold mt-1">Sain • +4% vs mois dernier</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-8">
        <TabButton active={activeTab === 'CAISSE'} onClick={() => setActiveTab('CAISSE')} label="Caisse & Journal" icon={<ICONS.Wallet />} />
        <TabButton active={activeTab === 'BANQUE'} onClick={() => setActiveTab('BANQUE')} label="Comptes Bancaires" icon={<ICONS.Building2 />} />
        <TabButton active={activeTab === 'CLOTURES'} onClick={() => setActiveTab('CLOTURES')} label="Clôtures Journalières" icon={<ICONS.Lock />} />
      </div>

      {/* Content based on Tabs */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'CAISSE' && <CashTabContent transactions={MOCK_TRANSACTIONS} />}
        {activeTab === 'BANQUE' && <BankTabContent accounts={MOCK_BANK_ACCOUNTS} />}
        {activeTab === 'CLOTURES' && <ClosureTabContent closures={MOCK_CLOSURES} currentCash={currentCash} onOpenModal={() => setShowClosureModal(true)} />}
      </div>

      {/* Modals placeholders */}
      {showClosureModal && <ClosureModal theoretical={currentCash} onClose={() => setShowClosureModal(false)} />}
      {showTxModal && <TransactionModal onClose={() => setShowTxModal(false)} />}
      {showTransferModal && <TransferModal cashBalance={currentCash} accounts={MOCK_BANK_ACCOUNTS} onClose={() => setShowTransferModal(false)} />}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`pb-4 px-2 flex items-center gap-2 text-sm font-bold transition-all relative ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {/* Fix: cast icon to ReactElement<any> to resolve TypeScript error regarding className property */}
    {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
    {label}
    {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]"></div>}
  </button>
);

const CashTabContent: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => (
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <th className="px-6 py-4">Date</th>
          <th className="px-6 py-4">Opération</th>
          <th className="px-6 py-4">Mode</th>
          <th className="px-6 py-4 text-right">Montant</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {transactions.map(tx => (
          <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-xs font-mono text-slate-500">{tx.date}</td>
            <td className="px-6 py-4">
              <p className="font-bold text-slate-800">{tx.label}</p>
              <p className="text-[10px] font-black uppercase text-slate-400">{tx.category}</p>
            </td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                {tx.paymentMethod}
              </span>
            </td>
            <td className={`px-6 py-4 text-right font-black ${tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === TransactionType.INCOME ? '+' : '-'}{tx.amount.toFixed(2)} €
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BankTabContent: React.FC<{ accounts: BankAccount[] }> = ({ accounts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {accounts.map(acc => (
      <div key={acc.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <ICONS.Building2 className="w-24 h-24" />
        </div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="font-black text-slate-800 text-lg">{acc.name}</h4>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{acc.bankName}</p>
          </div>
          <button className="p-2 text-slate-300 hover:text-blue-600 bg-slate-50 rounded-xl transition-all">
            <ICONS.History className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">IBAN / Numéro</p>
            <p className="text-sm font-mono text-slate-600 truncate">{acc.accountNumber}</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Solde Actuel</p>
              <p className="text-2xl font-black text-slate-800">{acc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
            </div>
            <button className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase rounded-xl hover:bg-slate-800 transition-all">
              Relevé
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ClosureTabContent: React.FC<{ closures: CashClosure[]; currentCash: number; onOpenModal: () => void }> = ({ closures, currentCash, onOpenModal }) => (
  <div className="space-y-6">
    <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-3xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-200 text-amber-700 flex items-center justify-center rounded-2xl">
          <ICONS.Lock className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-slate-800">Clôture en attente</h4>
          <p className="text-sm text-slate-600">Vous avez <span className="font-bold">{currentCash.toFixed(2)} €</span> en caisse à valider ce soir.</p>
        </div>
      </div>
      <button 
        onClick={onOpenModal}
        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-amber-200 transition-all active:scale-95"
      >
        Lancer la clôture
      </button>
    </div>

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Historique des clôtures</h4>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Solde Système</th>
            <th className="px-6 py-4">Solde Réel</th>
            <th className="px-6 py-4">Écart</th>
            <th className="px-6 py-4">Agent</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {closures.map(cl => (
            <tr key={cl.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-700">{cl.date}</td>
              <td className="px-6 py-4 text-sm font-medium">{cl.theoreticalBalance.toFixed(2)} €</td>
              <td className="px-6 py-4 text-sm font-medium">{cl.actualBalance.toFixed(2)} €</td>
              <td className={`px-6 py-4 font-black ${cl.difference < 0 ? 'text-red-600' : cl.difference > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                {cl.difference === 0 ? 'Parfait' : `${cl.difference > 0 ? '+' : ''}${cl.difference.toFixed(2)} €`}
              </td>
              <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{cl.closedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Modals ---

const ClosureModal: React.FC<{ theoretical: number; onClose: () => void }> = ({ theoretical, onClose }) => {
  const [actual, setActual] = useState<string>('');
  const diff = parseFloat(actual || '0') - theoretical;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
                <ICONS.Lock className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Clôture Journalière</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><ICONS.LogOut className="w-6 h-6 rotate-180" /></button>
        </div>

        <div className="p-10 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Solde Système</p>
                <p className="text-3xl font-black text-blue-900">{theoretical.toFixed(2)} €</p>
              </div>
              <div className={`p-6 rounded-3xl border-2 ${diff === 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${diff === 0 ? 'text-green-400' : 'text-red-400'}`}>Écart constaté</p>
                <p className={`text-3xl font-black ${diff === 0 ? 'text-green-700' : 'text-red-700'}`}>{diff.toFixed(2)} €</p>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Montant compté physiquement</label>
              <div className="relative">
                <ICONS.Euro className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-8 h-8" />
                <input 
                  type="number" 
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 pl-16 outline-none focus:border-blue-500 focus:bg-white transition-all text-4xl font-black text-slate-800" 
                />
              </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-3xl space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observations</p>
              <textarea placeholder="Raison de l'écart, notes particulières..." className="w-full bg-transparent border-none outline-none text-sm font-medium resize-none" rows={2}></textarea>
           </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
           <button onClick={onClose} className="px-8 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Annuler</button>
           <button onClick={onClose} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95">
              Valider et Verrouiller
           </button>
        </div>
      </div>
    </div>
  );
};

const TransferModal: React.FC<{ cashBalance: number; accounts: BankAccount[]; onClose: () => void }> = ({ cashBalance, accounts, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in">
       <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
               <ICONS.ArrowRightLeft className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Dépôt en Banque</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><ICONS.LogOut className="w-6 h-6 rotate-180" /></button>
       </div>
       <div className="p-10 space-y-6">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
             <span className="text-xs font-bold text-blue-600 uppercase">Disponible en caisse</span>
             <span className="text-xl font-black text-blue-900">{cashBalance.toFixed(2)} €</span>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compte de destination</label>
             <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-purple-500">
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.bankName})</option>)}
             </select>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant à déposer</label>
             <input type="number" placeholder="0.00" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl text-slate-800 outline-none focus:border-purple-500" />
          </div>
       </div>
       <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-slate-400 font-black uppercase text-xs tracking-widest">Annuler</button>
          <button onClick={onClose} className="px-10 py-3 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95">
             Confirmer le dépôt
          </button>
       </div>
    </div>
  </div>
);

const TransactionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden animate-in zoom-in">
       <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">Enregistrer une opération</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><ICONS.LogOut className="w-6 h-6 rotate-180" /></button>
       </div>
       <div className="p-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                   <option value={TransactionType.INCOME}>Entrée</option>
                   <option value={TransactionType.EXPENSE}>Sortie</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source / Mode</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                   {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Désignation</label>
             <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="Ex: Achat fournitures..." />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</label>
             <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl outline-none focus:border-blue-500" placeholder="0.00 €" />
          </div>
       </div>
       <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-slate-400 font-black uppercase text-xs">Annuler</button>
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Valider</button>
       </div>
    </div>
  </div>
);
