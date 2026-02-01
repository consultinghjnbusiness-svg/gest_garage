
import React, { useState, useEffect } from 'react';
import { ICONS, MOCK_CLIENTS, MOCK_VEHICLES, MOCK_REPAIRS } from '../constants';
import { InvoiceStatus, GarageInfo, Invoice, ORStatus, RepairOrder } from '../types';
import { DocumentTemplate } from '../components/DocumentTemplate';

export const Invoices: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoiceDoc, setSelectedInvoiceDoc] = useState<any>(null);
  const [docFormat, setDocFormat] = useState<'A4' | 'TICKET'>('A4');
  
  const [garageInfo, setGarageInfo] = useState<GarageInfo>({
    name: 'GarageMaster Pro',
    phone: 'Non renseigné',
    email: 'contact@garage.com',
    address: 'Configurez votre adresse dans paramètres',
    bankAccount: 'RIB non configuré'
  });
  
  const [invoices, setInvoices] = useState<(Invoice & { clientName: string })[]>([]);
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);

  useEffect(() => {
    // Info Garage
    const savedGarage = localStorage.getItem('garage-info');
    if (savedGarage) setGarageInfo(JSON.parse(savedGarage));

    // Factures
    const savedInvoices = localStorage.getItem('garage-invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      const initial = [
        { id: 'FAC-2024-001', orId: 'OR-2024-001', clientName: 'Jean Dupont', date: '2024-10-10', status: InvoiceStatus.PAID, total: 185, paidAmount: 185 }
      ];
      setInvoices(initial);
      localStorage.setItem('garage-invoices', JSON.stringify(initial));
    }

    // Interventions
    const savedRepairs = localStorage.getItem('garage-repairs');
    if (savedRepairs) {
      setRepairs(JSON.parse(savedRepairs));
    } else {
      setRepairs(MOCK_REPAIRS);
    }
  }, []);

  const handleCreateInvoice = (or: RepairOrder) => {
    const client = MOCK_CLIENTS.find(c => c.id === or.clientId);
    
    const newInvoice: Invoice & { clientName: string } = {
      id: `FAC-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      orId: or.id,
      clientName: client?.name || 'Client Inconnu',
      date: new Date().toISOString().split('T')[0],
      status: InvoiceStatus.UNPAID,
      total: or.totalCost,
      paidAmount: 0
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem('garage-invoices', JSON.stringify(updatedInvoices));
    
    // Mettre à jour le statut de l'OR en "Livré" (facturé)
    const updatedRepairs = repairs.map(r => r.id === or.id ? { ...r, status: ORStatus.DELIVERED } : r);
    setRepairs(updatedRepairs);
    localStorage.setItem('garage-repairs', JSON.stringify(updatedRepairs));
    
    setShowModal(false);
  };

  const handlePrint = (invoice: any, format: 'A4' | 'TICKET' = 'A4') => {
    const or = repairs.find(o => o.id === invoice.orId) || MOCK_REPAIRS.find(o => o.id === invoice.orId) || repairs[0];
    const client = MOCK_CLIENTS.find(c => c.name === invoice.clientName) || MOCK_CLIENTS.find(c => c.id === or.clientId) || MOCK_CLIENTS[0];
    const vehicle = MOCK_VEHICLES.find(v => v.id === or.vehicleId) || MOCK_VEHICLES[0];
    
    setDocFormat(format);
    setSelectedInvoiceDoc({
      ...invoice,
      client,
      vehicle,
      items: or.items.length > 0 ? or.items : [
        { description: `Réparation : ${or.reportedProblem}`, quantity: 1, unitPrice: invoice.total, total: invoice.total }
      ]
    });
  };

  const finishedORs = repairs.filter(or => 
    (or.status === ORStatus.FINISHED || or.status === ORStatus.DELIVERED) &&
    !invoices.some(inv => inv.orId === or.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Facturation</h2>
          <p className="text-slate-500 text-sm">Gérez vos revenus et imprimez vos documents de caisse.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black transition-all shadow-lg shadow-blue-200"
        >
          <ICONS.Plus className="w-5 h-5" />
          Nouvelle Facture
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Montant TTC</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions / Impression</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length > 0 ? invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-black text-blue-600">{invoice.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{invoice.clientName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.date}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-800">{invoice.total.toFixed(2)} €</td>
                  <td className="px-6 py-4"><StatusBadge status={invoice.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handlePrint(invoice, 'A4')}
                        className="p-3 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-xl transition-all" 
                        title="Imprimer Facture A4"
                      >
                        <ICONS.FileText className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handlePrint(invoice, 'TICKET')}
                        className="p-3 text-slate-400 hover:text-amber-600 bg-slate-50 rounded-xl transition-all" 
                        title="Imprimer Ticket de Caisse"
                      >
                        <ICONS.CreditCard className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold uppercase text-xs">
                    Aucune facture disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoiceDoc && (
        <DocumentTemplate 
          type="FACTURE"
          format={docFormat}
          number={selectedInvoiceDoc.id}
          date={selectedInvoiceDoc.date}
          garage={garageInfo}
          client={selectedInvoiceDoc.client}
          vehicle={selectedInvoiceDoc.vehicle}
          items={selectedInvoiceDoc.items}
          total={selectedInvoiceDoc.total}
          onClose={() => setSelectedInvoiceDoc(null)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Générer une Facture</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <ICONS.LogOut className="w-6 h-6 rotate-180" />
              </button>
            </div>
            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
              {finishedORs.map(or => (
                <button 
                  key={or.id}
                  onClick={() => handleCreateInvoice(or)}
                  className="w-full p-6 border-2 border-slate-100 rounded-[32px] text-left hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{or.id}</span>
                    <p className="font-black text-slate-800 text-lg leading-tight mt-1">
                      {MOCK_CLIENTS.find(c => c.id === or.clientId)?.name || 'Client inconnu'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{or.reportedProblem}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-black text-slate-900">{or.totalCost.toFixed(2)} €</p>
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">Facturer →</p>
                  </div>
                </button>
              ))}
              {finishedORs.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <ICONS.Clock className="w-12 h-12 mx-auto text-slate-200" />
                  <p className="text-slate-500 font-bold italic">Aucun ordre de réparation terminé à facturer.</p>
                </div>
              )}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end">
               <button onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-400 font-black uppercase text-xs tracking-widest">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const styles = {
    [InvoiceStatus.PAID]: 'bg-green-100 text-green-700',
    [InvoiceStatus.PARTIALLY_PAID]: 'bg-amber-100 text-amber-700',
    [InvoiceStatus.UNPAID]: 'bg-red-100 text-red-700',
  };
  return <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>{status}</span>;
};
