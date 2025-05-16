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
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-info">
          {currentUser?.photoURL && (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="profile-avatar" 
            />
          )}
          <div>
            <h1>{currentUser?.displayName}</h1>
            <p>{currentUser?.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button 
          className={`tab-btn ${activeTab === 'badgeHistory' ? 'active' : ''}`}
          onClick={() => setActiveTab('badgeHistory')}
        >
          Badge History
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'notifications' && <NotificationList />}
        {activeTab === 'badges' && <BadgeSummary />}
        {activeTab === 'badgeHistory' && <BadgeList />}
      </div>
    </div>
  );
}

export default UserProfile;
