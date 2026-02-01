
import React from 'react';
import { 
  Users, 
  Car, 
  Wrench, 
  FileText, 
  Package, 
  LayoutDashboard, 
  CreditCard, 
  LogOut,
  UserCircle,
  AlertTriangle,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Euro,
  ShieldCheck,
  UserPlus,
  Play,
  CheckCircle,
  ClipboardList,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  Lock,
  ArrowRightLeft,
  History,
  Settings,
  Download,
  Upload,
  Database,
  Trash2,
  Camera
} from 'lucide-react';
import { UserRole, Client, Vehicle, Part, User, Invoice, InvoiceStatus, RepairOrder, ORStatus, Transaction, TransactionType, PaymentMethod, BankAccount, CashClosure } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST] },
  { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.MANAGER] },
  { id: 'vehicles', label: 'Véhicules', icon: <Car className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.MECHANIC] },
  { id: 'repairs', label: 'Interventions', icon: <Wrench className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.MECHANIC, UserRole.MANAGER] },
  { id: 'inventory', label: 'Stock Pièces', icon: <Package className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.MECHANIC] },
  { id: 'invoices', label: 'Factures', icon: <FileText className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.MANAGER] },
  { id: 'cash', label: 'Finance & Trésorerie', icon: <Wallet className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
  { id: 'staff', label: 'Personnel', icon: <ShieldCheck className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
  { id: 'settings', label: 'Paramètres & Sauvegarde', icon: <Settings className="w-5 h-5" />, roles: [UserRole.ADMIN] },
];

export const MOCK_USER: User = {
  id: '1',
  name: 'Admin Garage',
  role: UserRole.ADMIN,
  email: 'admin@garagemaster.com'
};

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Jean Dupont', phone: '06 12 34 56 78', email: 'jean@example.com', address: '123 Rue de Paris' },
  { id: 'c2', name: 'Entreprise Transport Express', phone: '01 99 88 77 66', email: 'contact@texpress.fr', address: 'Z.A. les Bruyères' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', clientId: 'c1', make: 'Peugeot', model: '3008', year: 2021, licensePlate: 'AB-123-CD', vin: 'VF3M4567890123', mileage: 45000 },
  { id: 'v2', clientId: 'c2', make: 'Renault', model: 'Master', year: 2019, licensePlate: 'XY-987-ZZ', vin: 'VF1R1234567890', mileage: 125000 },
];

export interface StaffMember extends User {
  specialty?: string;
  status: 'Available' | 'Busy' | 'Off';
  activeTasks: number;
}

export const MOCK_STAFF: StaffMember[] = [
  { id: 'm1', name: 'Marc L.', role: UserRole.MECHANIC, email: 'marc@garagemaster.com', specialty: 'Moteur & Diesel', status: 'Busy', activeTasks: 3 },
  { id: 'm2', name: 'Julien B.', role: UserRole.MECHANIC, email: 'julien@garagemaster.com', specialty: 'Électronique & Hybride', status: 'Available', activeTasks: 1 },
  { id: 'm3', name: 'Ahmed S.', role: UserRole.MECHANIC, email: 'ahmed@garagemaster.com', specialty: 'Carrosserie & Peinture', status: 'Available', activeTasks: 0 },
  { id: 's1', name: 'Alice V.', role: UserRole.RECEPTIONIST, email: 'alice@garagemaster.com', status: 'Available', activeTasks: 0 },
];

export const MOCK_REPAIRS: RepairOrder[] = [
  { id: 'OR-2024-001', vehicleId: 'v1', clientId: 'c1', entryDate: '2024-10-15', reportedProblem: 'Bruit suspect train avant', status: ORStatus.IN_PROGRESS, mechanicId: 'm1', items: [], totalCost: 185 },
  { id: 'OR-2024-002', vehicleId: 'v2', clientId: 'c2', entryDate: '2024-10-16', reportedProblem: 'Révision complète 120k km', status: ORStatus.PENDING, items: [], totalCost: 420 },
  { id: 'OR-2024-003', vehicleId: 'v1', clientId: 'c1', entryDate: '2024-10-17', reportedProblem: 'Voyant moteur allumé', status: ORStatus.FINISHED, mechanicId: 'm1', items: [], totalCost: 120 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T-001', date: '2024-10-10', label: 'Paiement Facture FAC-2024-001', type: TransactionType.INCOME, category: 'Vente', amount: 185, paymentMethod: PaymentMethod.CASH, referenceId: 'FAC-2024-001' },
  { id: 'T-002', date: '2024-10-11', label: 'Achat consommables atelier', type: TransactionType.EXPENSE, category: 'Fournitures', amount: 54.20, paymentMethod: PaymentMethod.CASH },
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'B-001', name: 'Compte Principal', bankName: 'Société Générale', accountNumber: 'FR76 3000 3000 1234 5678 9012 345', balance: 12450.50 },
];

export const MOCK_CLOSURES: CashClosure[] = [
  { id: 'CL-001', date: '2024-10-14', theoreticalBalance: 450.00, actualBalance: 450.00, difference: 0, closedBy: 'Alice V.' },
];

export const MOCK_MECHANICS: User[] = MOCK_STAFF.filter(s => s.role === UserRole.MECHANIC);

export const MOCK_PARTS: Part[] = [
  { id: 'p1', reference: 'FLT-001', name: 'Filtre à Huile', purchasePrice: 8, sellingPrice: 15, stock: 45, minStock: 10 },
];

export const MOCK_INVOICES: (Invoice & { clientName: string })[] = [
  { id: 'FAC-2024-001', orId: 'OR-001', clientName: 'Jean Dupont', date: '2024-10-10', status: InvoiceStatus.PAID, total: 185, paidAmount: 185 },
];

export const ICONS = {
  Users, Car, Wrench, FileText, Package, LayoutDashboard, CreditCard, LogOut, UserCircle, AlertTriangle, Search, Plus, ArrowUpRight, TrendingUp, Clock, CheckCircle2, Euro, ShieldCheck, UserPlus, Play, CheckCircle, ClipboardList, Wallet, ArrowDownCircle, ArrowUpCircle, Building2, Lock, ArrowRightLeft, History, Settings, Download, Upload, Database, Trash2, Camera
};
