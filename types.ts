
export enum UserRole {
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST',
  MECHANIC = 'MECHANIC',
  MANAGER = 'MANAGER'
}

export enum ORStatus {
  PENDING = 'En attente',
  IN_PROGRESS = 'En cours',
  FINISHED = 'Terminé',
  DELIVERED = 'Livré'
}

export enum QuoteStatus {
  DRAFT = 'Brouillon',
  SENT = 'Envoyé',
  ACCEPTED = 'Accepté',
  REFUSED = 'Refusé'
}

export enum InvoiceStatus {
  UNPAID = 'Impayée',
  PARTIALLY_PAID = 'Partiellement payée',
  PAID = 'Payée'
}

export enum PaymentMethod {
  CASH = 'Espèces',
  MOBILE_MONEY = 'Mobile Money',
  TRANSFER = 'Virement',
  CARD = 'Carte'
}

export enum TransactionType {
  INCOME = 'Entrée',
  EXPENSE = 'Sortie',
  TRANSFER = 'Transfert'
}

export interface GarageInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  bankAccount: string;
  registrationNumber?: string; // SIRET or similar
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  balance: number;
}

export interface CashClosure {
  id: string;
  date: string;
  theoreticalBalance: number;
  actualBalance: number;
  difference: number;
  closedBy: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  label: string;
  type: TransactionType;
  category: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceId?: string;
  bankAccountId?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  mileage: number;
}

export interface Part {
  id: string;
  reference: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
}

export interface InterventionItem {
  type: 'PART' | 'LABOR';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface RepairOrder {
  id: string;
  vehicleId: string;
  clientId: string;
  entryDate: string;
  reportedProblem: string;
  diagnosis?: string;
  mechanicId?: string;
  status: ORStatus;
  items: InterventionItem[];
  totalCost: number;
}

export interface Quote {
  id: string;
  orId: string;
  date: string;
  status: QuoteStatus;
  total: number;
}

export interface Invoice {
  id: string;
  orId: string;
  quoteId?: string;
  date: string;
  status: InvoiceStatus;
  total: number;
  paidAmount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}
