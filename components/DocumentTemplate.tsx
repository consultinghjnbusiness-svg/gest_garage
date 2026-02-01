
import React from 'react';
import { GarageInfo, Client, Vehicle, InterventionItem } from '../types';
import { ICONS } from '../constants';

interface DocumentTemplateProps {
  type: 'DEVIS' | 'FACTURE';
  format?: 'A4' | 'TICKET';
  number: string;
  date: string;
  garage: GarageInfo;
  client: Client;
  vehicle: Vehicle;
  items: InterventionItem[];
  total: number;
  onClose: () => void;
}

export const DocumentTemplate: React.FC<DocumentTemplateProps> = ({
  type, format = 'A4', number, date, garage, client, vehicle, items, total, onClose
}) => {
  const isTicket = format === 'TICKET';

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[250] flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <style>
        {`
          @media print {
            body { background: white !important; }
            .no-print { display: none !important; }
            @page { margin: 0; }
            .print-container { 
              box-shadow: none !important; 
              width: 100% !important; 
              max-width: none !important;
              margin: 0 !important;
              border: none !important;
            }
          }
        `}
      </style>
      
      <div className={`bg-white shadow-2xl rounded-sm flex flex-col animate-in zoom-in duration-300 print-container ${isTicket ? 'w-[320px] p-6' : 'w-full max-w-4xl min-h-[1000px] p-16 print:p-8'}`}>
        
        {/* Actions Bar (Screen only) */}
        <div className="bg-slate-100 p-4 flex justify-between items-center no-print border-b border-slate-200 mb-8 rounded-t-lg -mt-4 -mx-4">
          <div className="flex items-center gap-2 text-slate-600 font-bold">
            <ICONS.FileText className="w-5 h-5" />
            Aperçu {isTicket ? 'Ticket' : 'Facture A4'}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-black uppercase text-xs flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              <ICONS.Download className="w-4 h-4" /> Lancer l'impression
            </button>
            <button onClick={onClose} className="bg-white text-slate-600 px-6 py-2 rounded-lg font-black uppercase text-xs border border-slate-200">
              Fermer
            </button>
          </div>
        </div>

        {/* --- TICKET FORMAT --- */}
        {isTicket ? (
          <div className="flex flex-col text-[12px] font-mono space-y-4 text-slate-900">
            <div className="text-center border-b border-dashed border-slate-300 pb-4">
              <h1 className="text-lg font-black uppercase leading-tight">{garage.name}</h1>
              <p className="text-[10px] mt-1">{garage.address}</p>
              <p className="text-[10px]">Tél: {garage.phone}</p>
              {garage.registrationNumber && <p className="text-[10px]">SIRET: {garage.registrationNumber}</p>}
            </div>

            <div className="space-y-1 py-2 text-[10px]">
              <div className="flex justify-between">
                <span>{type} N°:</span>
                <span className="font-bold">{number}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{date}</span>
              </div>
              <div className="flex justify-between">
                <span>Client:</span>
                <span className="font-bold">{client.name}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-100 mt-2 pt-1">
                <span>Véhicule:</span>
                <span>{vehicle.licensePlate}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-bold uppercase text-[10px]">{item.description}</span>
                  <div className="flex justify-between text-[11px]">
                    <span>{item.quantity} x {item.unitPrice.toFixed(2)}</span>
                    <span className="font-bold">{item.total.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-sm font-black border-b-2 border-double border-slate-900 pb-1">
                <span>TOTAL TTC</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-[9px] pt-1 italic opacity-60">
                <span>Dont TVA (20%)</span>
                <span>{(total * 0.2).toFixed(2)} €</span>
              </div>
            </div>

            <div className="text-center pt-6 space-y-2 border-t border-dashed border-slate-300 mt-6">
              <p className="font-black">MERCI DE VOTRE CONFIANCE</p>
              <p className="text-[9px]">A bientôt chez {garage.name}</p>
              <div className="flex justify-center pt-2">
                 <div className="w-24 h-4 bg-slate-900 rounded-sm"></div>
              </div>
            </div>
          </div>
        ) : (
          /* --- A4 FORMAT --- */
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-10">
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{garage.name}</h1>
                <div className="text-sm font-medium text-slate-600 space-y-1">
                  <p className="flex items-center gap-2"><ICONS.Search className="w-3 h-3" /> {garage.address}</p>
                  <p className="flex items-center gap-2"><ICONS.Users className="w-3 h-3" /> Tél : {garage.phone}</p>
                  <p className="flex items-center gap-2"><ICONS.FileText className="w-3 h-3" /> Email : {garage.email}</p>
                  {garage.registrationNumber && <p className="font-bold">SIRET : {garage.registrationNumber}</p>}
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="bg-slate-900 text-white px-6 py-2 inline-block font-black text-xl tracking-widest uppercase">
                  {type}
                </div>
                <p className="text-slate-500 font-mono text-sm font-bold">N° {number}</p>
                <p className="text-slate-500 font-bold text-sm">Date : {date}</p>
              </div>
            </div>

            {/* Client & Vehicle Section */}
            <div className="grid grid-cols-2 gap-12 py-12">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">Client</h3>
                <p className="font-black text-slate-900 text-lg">{client.name}</p>
                <p className="text-sm text-slate-600">{client.address}</p>
                <p className="text-sm text-slate-600 font-bold">{client.phone}</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">Véhicule</h3>
                <p className="font-black text-slate-900 text-lg">{vehicle.make} {vehicle.model}</p>
                <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded inline-block font-bold">IMMAT : {vehicle.licensePlate}</p>
                <p className="text-sm text-slate-600">Kilométrage : {vehicle.mileage.toLocaleString()} km</p>
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-xs font-black uppercase tracking-widest">
                    <th className="py-4">Désignation des prestations</th>
                    <th className="py-4 text-center w-24">Qté</th>
                    <th className="py-4 text-right w-32">P.U HT</th>
                    <th className="py-4 text-right w-32">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length > 0 ? items.map((item, idx) => (
                    <tr key={idx} className="text-sm">
                      <td className="py-4 font-bold text-slate-800 uppercase text-[12px]">{item.description}</td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">{item.unitPrice.toFixed(2)} €</td>
                      <td className="py-4 text-right font-bold">{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="py-8 text-slate-400 italic text-center" colSpan={4}>Aucune ligne de prestation enregistrée</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-12 flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Total HT</span>
                  <span className="font-bold">{(total * 0.8333).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>TVA (20%)</span>
                  <span className="font-bold">{(total * 0.1667).toFixed(2)} €</span>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="flex justify-between text-2xl font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                  <span>TOTAL TTC</span>
                  <span>{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-16 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-8 items-end">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Règlement par virement (RIB)</p>
                    <p className="text-xs font-mono font-bold text-slate-800 break-all uppercase tracking-tighter">{garage.bankAccount || 'Veuillez configurer votre RIB dans les paramètres'}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 italic font-medium">Auto-entrepreneur / Garage : TVA non applicable, art. 293 B du CGI (si applicable).</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-black text-slate-900 uppercase">Conditions de paiement</p>
                  <p className="text-[10px] text-slate-500">Paiement comptant à réception de facture.</p>
                  <div className="flex justify-end gap-2 mt-2 opacity-20 no-print">
                     <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                     <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12 text-[9px] font-bold text-slate-300 uppercase tracking-widest border-t border-slate-50 pt-4">
                Propulsé par GarageMaster Pro - Solution de Gestion Automobile Intelligente
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
