import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationList from '../components/notifications/NotificationList';
import BadgeSummary from '../components/badges/BadgeSummary';
import BadgeList from '../components/badges/BadgeList';
import './Pages.css';

function UserProfile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
          <div className="flex items-center gap-6">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-4 border-white shadow-md" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-emerald-600 flex items-center justify-center text-3xl text-white font-bold">
                {currentUser?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600">
                {currentUser?.displayName || 'User Profile'}
              </h1>
              <p className="text-slate-600 mt-1">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6">
          <div className="flex gap-4 mb-6">
            {['notifications', 'badges', 'badgeHistory'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === tab 
                    ? 'text-white bg-gradient-to-r from-purple-600 to-emerald-600' 
                    : 'text-purple-600 bg-white border border-purple-200 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>

          <div className="bg-white/50 rounded-xl p-4">
            {activeTab === 'notifications' && <NotificationList />}
            {activeTab === 'badges' && <BadgeSummary />}
            {activeTab === 'badgeHistory' && <BadgeList />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
