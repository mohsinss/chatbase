

import { useState } from 'react';
import GeneralSettings from './GeneralSettings';

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex">
      {/* Left Menu */}
      <div className="w-64 bg-base-200 min-h-screen p-4">
        <ul className="menu">
          <li>
            <button 
              className={`${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
          </li>
          {/* Add other menu items as needed */}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {activeTab === 'general' && <GeneralSettings />}
      </div>
    </div>
  );
};

export default SettingsTabs; 