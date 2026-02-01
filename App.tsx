
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Repairs } from './pages/Repairs';
import { Inventory } from './pages/Inventory';
import { Invoices } from './pages/Invoices';
import { Vehicles } from './pages/Vehicles';
import { Staff } from './pages/Staff';
import { CashManagement } from './pages/CashManagement';
import { Settings } from './pages/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'clients': return <Clients />;
      case 'repairs': return <Repairs />;
      case 'inventory': return <Inventory />;
      case 'invoices': return <Invoices />;
      case 'vehicles': return <Vehicles />;
      case 'staff': return <Staff />;
      case 'cash': return <CashManagement />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
